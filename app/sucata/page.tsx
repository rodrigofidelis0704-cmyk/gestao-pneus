'use client';

import {useEffect,useMemo,useState} from 'react';
import {AppShell} from '@/components/AppShell';
import {supabase} from '@/lib/supabase';
import {Search,Camera,CheckCircle2,AlertTriangle,RefreshCw} from 'lucide-react';

type Lookup={id:string;codigo:string;descricao:string};
type Analise={id:string;pneu_id:string;numero_fogo:string;rbr_mm:number;valor_perda:number;status:string;decisao_final:string|null;data_analise:string;analise_sucata_id?:string};

const locais=[
  ['BANDA','Banda'],['FLANCO','Flanco'],['OMBRO','Ombro'],['TALAO','Talão'],['INNERLINER','Innerliner'],['OUTROS','Outros']
];
const rbrs=Array.from({length:53},(_,i)=>(i*.5).toFixed(2));
const consertos=Array.from({length:11},(_,i)=>i);

export default function SucataPage(){
  const [fogo,setFogo]=useState('');
  const [pneu,setPneu]=useState<any>(null);
  const [vida,setVida]=useState<any>(null);
  const [vida1,setVida1]=useState<any>(null);
  const [qtdVidas,setQtdVidas]=useState(0);
  const [ultimoVeiculo,setUltimoVeiculo]=useState<any>(null);
  const [motivos,setMotivos]=useState<Lookup[]>([]);
  const [analises,setAnalises]=useState<Analise[]>([]);
  const [principal,setPrincipal]=useState('');
  const [secundario,setSecundario]=useState('');
  const [local,setLocal]=useState('BANDA');
  const [rbr,setRbr]=useState('3.00');
  const [qtdConsertos,setQtdConsertos]=useState('0');
  const [decisao,setDecisao]=useState('SUCATA');
  const [obs,setObs]=useState('');
  const [files,setFiles]=useState<Record<string,File|null>>({VISTA_GERAL:null,NUMERO_FOGO:null,DANO:null});
  const [busy,setBusy]=useState(false);
  const [msg,setMsg]=useState('');
  const [erro,setErro]=useState('');

  useEffect(()=>{carregarLookups();carregarAnalises()},[]);

  async function carregarLookups(){
    const {data}=await supabase.from('motivos_sucata').select('id,codigo,descricao').eq('ativo',true).order('codigo');
    setMotivos((data||[]) as Lookup[]);
  }

  async function carregarAnalises(){
    const {data}=await supabase.from('analises_sucata_pneu').select('id,pneu_id,numero_fogo,rbr_mm,valor_perda,status,decisao_final,data_analise').order('data_analise',{ascending:false}).limit(100);
    setAnalises((data||[]) as Analise[]);
  }

  async function buscarPneu(){
    setBusy(true);setErro('');setMsg('');setPneu(null);setVida(null);setUltimoVeiculo(null);
    try{
      const {data:p,error}=await supabase.from('pneus').select('*').eq('numero_fogo',fogo.trim()).eq('ativo',true).maybeSingle();
      if(error)throw error;if(!p)throw new Error('Pneu não encontrado.');
      if(!['USADO','REFORMADO'].includes(p.lote_estoque))throw new Error('Somente pneus USADOS ou REFORMADOS podem entrar em análise de sucata.');
      if(!p.unidade_atual_id)throw new Error('O pneu precisa estar fisicamente no estoque para iniciar a análise.');
      const {data:v}=await supabase.from('vidas_pneu').select('*').eq('pneu_id',p.id).eq('status','ATIVA').order('numero_vida',{ascending:false}).limit(1).maybeSingle();
      const {data:v1}=await supabase.from('vidas_pneu').select('*').eq('pneu_id',p.id).eq('numero_vida',1).maybeSingle();
      const {count}=await supabase.from('vidas_pneu').select('id',{count:'exact',head:true}).eq('pneu_id',p.id);
      const {data:mont}=await supabase.from('montagens_pneu').select('veiculo_id,data_montagem').eq('pneu_id',p.id).order('data_montagem',{ascending:false}).limit(1).maybeSingle();
      let veic:any=null;
      if(mont?.veiculo_id){const {data:vv}=await supabase.from('veiculos').select('id,codigo,placa,apelido').eq('id',mont.veiculo_id).maybeSingle();veic=vv;}
      setPneu(p);setVida(v);setVida1(v1);setQtdVidas(count||0);setUltimoVeiculo(veic);
      setRbr(String(Math.min(Number(p.sulco_atual_1??p.milimetragem_original??3),26).toFixed(2)));
    }catch(e:any){setErro(e.message||'Erro ao localizar pneu.');}
    finally{setBusy(false);}
  }

  async function textoMaterial(materialId:string|null){
    if(!materialId)return 'PNEU NOVO';
    const {data}=await supabase.from('materiais').select('descricao').eq('id',materialId).maybeSingle();
    return data?.descricao||'MATERIAL NÃO IDENTIFICADO';
  }
  async function textoReformador(id:string|null){
    if(!id)return 'NÃO SE APLICA';
    const {data}=await supabase.from('fornecedores').select('nome').eq('id',id).maybeSingle();
    return data?.nome||'REFORMADOR NÃO IDENTIFICADO';
  }

  async function uploadFoto(analiseId:string,tipo:string,file:File){
    const ext=(file.name.split('.').pop()||'jpg').toLowerCase();
    const path=`${analiseId}/${tipo.toLowerCase()}-${Date.now()}.${ext}`;
    const {error}=await supabase.storage.from('analise-sucata').upload(path,file,{upsert:true,contentType:file.type});
    if(error)throw error;
    const {error:dbError}=await supabase.from('fotos_analise_sucata').insert({analise_id:analiseId,tipo,url_arquivo:path});
    if(dbError)throw dbError;
  }

  async function concluirAnalise(){
    if(!pneu||!vida){setErro('Localize um pneu antes de iniciar a análise.');return;}
    if(!principal){setErro('Informe o motivo principal.');return;}
    if(secundario&&secundario===principal){setErro('Motivo secundário deve ser diferente do principal.');return;}
    if(!files.VISTA_GERAL||!files.NUMERO_FOGO||!files.DANO){setErro('As três fotos são obrigatórias: vista geral, número a fogo e dano.');return;}
    setBusy(true);setErro('');setMsg('');
    try{
      const {data:userData,error:userError}=await supabase.auth.getUser();
      if(userError||!userData.user)throw new Error('Usuário não autenticado. Faça login novamente.');
      const materialTexto=vida.numero_vida>1?await textoMaterial(vida.material_inicio_id):'PNEU NOVO';
      const reformadorTexto=await textoReformador(vida.fornecedor_reforma_id);
      const equipamento=ultimoVeiculo?`${ultimoVeiculo.codigo||''}${ultimoVeiculo.placa?` · ${ultimoVeiculo.placa}`:''}`.trim():'ESTOQUE';
      const payload:any={
        pneu_id:pneu.id,numero_fogo:pneu.numero_fogo,dot:pneu.dot,serie:pneu.serie,
        medida_id:pneu.medida_id,marca_id:pneu.marca_id,modelo_id:pneu.modelo_id,quantidade_vidas:qtdVidas,
        material_reforma_id:vida.numero_vida>1?vida.material_inicio_id:null,material_reforma_texto:materialTexto,
        reformador_id:vida.fornecedor_reforma_id||null,reformador_texto:reformadorTexto,
        ultimo_veiculo_id:ultimoVeiculo?.id||null,ultimo_equipamento_texto:equipamento,
        local_dano_codigo:local,rbr_mm:Number(rbr),motivo_sucata_id:principal,motivo_secundario_id:secundario||null,
        quantidade_consertos:Number(qtdConsertos),numero_vida:vida.numero_vida,
        valor_compra_original:Number(vida1?.valor_investimento||0),valor_reforma_atual:vida.numero_vida>1?Number(vida.valor_investimento||0):0,
        mm_original_vida:Number(pneu.milimetragem_original||0),responsavel_analise_id:userData.user.id,
        observacao:obs||null,status:'EM_ANALISE'
      };
      const {data:a,error:aError}=await supabase.from('analises_sucata_pneu').insert(payload).select('id').single();
      if(aError)throw aError;
      await uploadFoto(a.id,'VISTA_GERAL',files.VISTA_GERAL!);
      await uploadFoto(a.id,'NUMERO_FOGO',files.NUMERO_FOGO!);
      await uploadFoto(a.id,'DANO',files.DANO!);
      const {error:cError}=await supabase.from('analises_sucata_pneu').update({decisao_final:decisao,status:'CONCLUIDA'}).eq('id',a.id);
      if(cError)throw cError;
      setMsg(decisao==='SUCATA'?'Análise concluída. O movimento 751 foi liberado para este pneu.':'Análise concluída. O pneu não foi sucateado; siga a decisão técnica selecionada.');
      setFiles({VISTA_GERAL:null,NUMERO_FOGO:null,DANO:null});
      await carregarAnalises();
    }catch(e:any){setErro(e.message||'Erro ao concluir análise.');}
    finally{setBusy(false);}
  }

  async function executar751(a:Analise){
    if(!confirm(`Confirmar envio do pneu ${a.numero_fogo} para SUCATA?`))return;
    setBusy(true);setErro('');setMsg('');
    try{
      const {data:p,error:pError}=await supabase.from('pneus').select('id,unidade_atual_id,status_atual,lote_estoque').eq('id',a.pneu_id).single();
      if(pError)throw pError;if(!p.unidade_atual_id)throw new Error('Pneu não está disponível no estoque.');
      const {error}=await supabase.from('movimentacoes_pneu').insert({pneu_id:a.pneu_id,codigo_movimento:751,unidade_origem_id:p.unidade_atual_id,analise_sucata_id:a.id,data_movimentacao:new Date().toISOString()});
      if(error)throw error;
      setMsg(`Pneu ${a.numero_fogo} enviado para sucata. Movimento 751 registrado.`);
      await carregarAnalises();
      if(pneu?.id===a.pneu_id)setPneu({...pneu,status_atual:'SUCATA',lote_estoque:'SUCATA',unidade_atual_id:null});
    }catch(e:any){setErro(e.message||'Erro ao executar movimento 751.');}
    finally{setBusy(false);}
  }

  const concluidas=useMemo(()=>analises.filter(a=>a.status==='CONCLUIDA'),[analises]);
  const perda=useMemo(()=>concluidas.reduce((s,a)=>s+Number(a.valor_perda||0),0),[concluidas]);

  return <AppShell><div className="content">
    <div className="pageHead"><div><span className="eyebrow">ANÁLISE DE SUCATA</span><h2>Análise técnica de pneus</h2><p>Todo descarte exige análise concluída antes do movimento 751.</p></div><button className="btn" onClick={carregarAnalises}><RefreshCw size={16}/> Atualizar</button></div>
    {erro&&<div className="flash" style={{borderColor:'#dc2626'}}><AlertTriangle size={18}/>{erro}</div>}
    {msg&&<div className="flash"><CheckCircle2 size={18}/>{msg}</div>}
    <div className="kpis"><div className="kpi danger"><small>Perda analisada</small><b>R$ {perda.toLocaleString('pt-BR',{minimumFractionDigits:2})}</b></div><div className="kpi"><small>Análises concluídas</small><b>{concluidas.length}</b></div><div className="kpi warning"><small>Decisão sucata</small><b>{concluidas.filter(a=>a.decisao_final==='SUCATA').length}</b></div><div className="kpi green"><small>Recuperáveis</small><b>{concluidas.filter(a=>a.decisao_final&&a.decisao_final!=='SUCATA').length}</b></div></div>

    <section className="section"><div className="sectionHead"><div className="sectionTitle">1. Identificar pneu</div></div><div className="stockToolbar"><div className="finderInput compact"><Search size={17}/><input value={fogo} onChange={e=>setFogo(e.target.value)} onKeyDown={e=>e.key==='Enter'&&buscarPneu()} placeholder="Número a fogo, ex.: 210875"/></div><button className="btn primary" onClick={buscarPneu} disabled={busy||!fogo.trim()}>Localizar</button></div>
    {pneu&&<div className="note"><b>Nº fogo {pneu.numero_fogo}</b> · {pneu.status_atual} · lote {pneu.lote_estoque} · Vida {vida?.numero_vida||'-'} · MM atual {Number(pneu.sulco_atual_1||0).toFixed(1)} · {ultimoVeiculo?`Último equipamento: ${ultimoVeiculo.codigo||''} ${ultimoVeiculo.placa||''}`:'Sem histórico de equipamento'}</div>}</section>

    {pneu&&<section className="section"><div className="sectionHead"><div className="sectionTitle">2. Diagnóstico técnico</div></div><div className="formGrid">
      <label>Motivo principal<select value={principal} onChange={e=>setPrincipal(e.target.value)}><option value="">Selecione</option>{motivos.map(m=><option key={m.id} value={m.id}>{m.codigo} · {m.descricao}</option>)}</select></label>
      <label>Motivo secundário<select value={secundario} onChange={e=>setSecundario(e.target.value)}><option value="">Sem motivo secundário</option>{motivos.filter(m=>m.id!==principal).map(m=><option key={m.id} value={m.id}>{m.codigo} · {m.descricao}</option>)}</select></label>
      <label>Local do dano<select value={local} onChange={e=>setLocal(e.target.value)}>{locais.map(([v,t])=><option key={v} value={v}>{t}</option>)}</select></label>
      <label>RBR restante<select value={rbr} onChange={e=>setRbr(e.target.value)}>{rbrs.map(v=><option key={v} value={v}>{Number(v).toFixed(1)} mm</option>)}</select></label>
      <label>Quantidade de consertos<select value={qtdConsertos} onChange={e=>setQtdConsertos(e.target.value)}>{consertos.map(v=><option key={v} value={v}>{v}</option>)}</select></label>
      <label>Decisão final<select value={decisao} onChange={e=>setDecisao(e.target.value)}><option value="SUCATA">SUCATA</option><option value="CONSERTO">CONSERTO</option><option value="REFORMA">REFORMA</option><option value="REAPROVEITAR">REAPROVEITAR</option></select></label>
    </div><label className="field">Observação técnica<textarea value={obs} onChange={e=>setObs(e.target.value)} placeholder="Descreva a causa, circunstâncias e recomendações."/></label></section>}

    {pneu&&<section className="section"><div className="sectionHead"><div className="sectionTitle">3. Evidências fotográficas</div></div><div className="formGrid">
      <FotoInput label="Vista geral" tipo="VISTA_GERAL" file={files.VISTA_GERAL} onFile={f=>setFiles(s=>({...s,VISTA_GERAL:f}))}/>
      <FotoInput label="Número a fogo" tipo="NUMERO_FOGO" file={files.NUMERO_FOGO} onFile={f=>setFiles(s=>({...s,NUMERO_FOGO:f}))}/>
      <FotoInput label="Detalhe do dano" tipo="DANO" file={files.DANO} onFile={f=>setFiles(s=>({...s,DANO:f}))}/>
    </div><div className="note">As três fotos são obrigatórias. A análise não pode ser concluída sem vista geral, identificação do número a fogo e detalhe da avaria.</div><button className="btn primary wide" onClick={concluirAnalise} disabled={busy}>{busy?'Processando...':'Concluir análise técnica'}</button></section>}

    <section className="section"><div className="sectionHead"><div className="sectionTitle">Histórico de análises</div></div><div className="tableWrap"><table className="table"><thead><tr><th>Nº fogo</th><th>Status</th><th>Decisão</th><th>RBR</th><th>Perda</th><th>Data</th><th>Ação</th></tr></thead><tbody>{analises.map(a=><tr key={a.id}><td><b>{a.numero_fogo}</b></td><td><span className={'pill '+(a.status==='CONCLUIDA'?'green':'warning')}>{a.status.replace('_',' ')}</span></td><td>{a.decisao_final||'-'}</td><td>{Number(a.rbr_mm||0).toFixed(1)} mm</td><td>R$ {Number(a.valor_perda||0).toLocaleString('pt-BR',{minimumFractionDigits:2})}</td><td>{new Date(a.data_analise).toLocaleDateString('pt-BR')}</td><td>{a.status==='CONCLUIDA'&&a.decisao_final==='SUCATA'?<button className="btn dangerBtn" onClick={()=>executar751(a)} disabled={busy}>Executar 751</button>:<span>—</span>}</td></tr>)}</tbody></table></div></section>
  </div></AppShell>;
}

function FotoInput({label,tipo,file,onFile}:{label:string;tipo:string;file:File|null;onFile:(f:File|null)=>void}){
  return <label><span style={{display:'flex',gap:6,alignItems:'center'}}><Camera size={16}/>{label}</span><input type="file" accept="image/jpeg,image/png,image/webp" onChange={e=>onFile(e.target.files?.[0]||null)}/><small>{file?file.name:`Obrigatória · ${tipo}`}</small></label>;
}
