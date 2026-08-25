'use client';

import {useMemo,useState} from 'react';
import {AppShell} from '@/components/AppShell';
import {fleet,appliedTires,stockTires,positions8x4,Tire} from '@/lib/demoData';
import {classificarSulco,validarNovaLeitura} from '@/lib/domain/inspecao';
import {Search,ClipboardList,RefreshCcw,Gauge,ScanSearch,Wrench,History,Warehouse,CheckCircle2,X} from 'lucide-react';
import s from './servicos.module.css';

type Mode='troca'|'inspecao'|null;
type SearchMode='placa'|'frota';

export default function Servicos(){
 const [searchMode,setSearchMode]=useState<SearchMode>('frota');
 const [query,setQuery]=useState('BT1001');
 const [vehicle,setVehicle]=useState(fleet[0]);
 const [km,setKm]=useState(String(fleet[0].km));
 const [h,setH]=useState(String(fleet[0].horimetro));
 const [started,setStarted]=useState(false);
 const [mode,setMode]=useState<Mode>(null);
 const [tires,setTires]=useState<Tire[]>(appliedTires.filter(t=>t.equipamento===fleet[0].id));
 const [stock,setStock]=useState<Tire[]>(stockTires);
 const [selected,setSelected]=useState<Tire|null>(null);
 const [sulcos,setSulcos]=useState(['','','','']);
 const [message,setMessage]=useState('');

 const byPos=useMemo(()=>Object.fromEntries(tires.map(t=>[t.posicao!,t])),[tires]);
 const total=tires.length;
 const criticos=tires.filter(t=>t.mm<=3.5).length;
 const atencao=tires.filter(t=>t.mm>3.5&&t.mm<=5).length;
 const media=total?tires.reduce((a,b)=>a+b.mm,0)/total:0;
 const emDia=Math.max(0,total-criticos-atencao);

 function findVehicle(){
  const v=fleet.find(x=>searchMode==='placa'?x.placa?.toLowerCase()===query.toLowerCase():x.id.toLowerCase()===query.toLowerCase());
  if(!v){setMessage('Equipamento não localizado.');return}
  setVehicle(v);setKm(String(v.km));setH(String(v.horimetro));setStarted(false);setMode(null);
  setTires(appliedTires.filter(t=>t.equipamento===v.id));
  setMessage('Equipamento localizado. Confira os dados e abra a operação.');
 }

 function quickAction(action:string){
  if(!started){setMessage('Abra o equipamento antes de iniciar um serviço.');return}
  if(action==='troca'){setMode('troca');setMessage('Modo Troca / Rodízio ativado. Arraste os pneus entre as posições ou para o estoque.');return}
  if(action==='inspecao'){setMode('inspecao');setMessage('Modo Inspeção ativado. Clique em um pneu para registrar os sulcos.');return}
  setMode(null);
  const labels:Record<string,string>={inventario:'Inventário de pneus aplicado iniciado.',calibragem:'Calibragem do equipamento preparada.',conserto:'Fluxo de conserto e reaplicação preparado.',historico:'Histórico do equipamento selecionado.'};
  setMessage(labels[action]||'Ação selecionada.');
 }

 function dropOnPosition(pos:string,data:string){
  if(mode!=='troca')return;
  if(data.startsWith('stock:')){
   const fogo=data.slice(6);const p=stock.find(x=>x.fogo===fogo);if(!p)return;
   if(byPos[pos]){setMessage('Posição ocupada. Faça o rodízio ou retire o pneu atual primeiro.');return}
   setStock(v=>v.filter(x=>x.fogo!==fogo));
   setTires(v=>[...v,{...p,equipamento:vehicle.id,placa:vehicle.placa,posicao:pos}]);
   setMessage(`Pneu ${fogo} aplicado em ${pos}. Movimento 261 preparado.`);return;
  }
  const src=data.slice(4);const a=byPos[src];if(!a||src===pos)return;const b=byPos[pos];
  setTires(list=>list.map(t=>t.fogo===a.fogo?{...t,posicao:pos}:b&&t.fogo===b.fogo?{...t,posicao:src}:t));
  setMessage(b?`Rodízio ${src} ↔ ${pos} registrado.`:`Pneu ${a.fogo} movido de ${src} para ${pos}.`);
 }

 function dropStock(data:string){
  if(mode!=='troca'||!data.startsWith('pos:'))return;
  const pos=data.slice(4);const p=byPos[pos];if(!p)return;
  setSelected(p);setSulcos([String(p.mm),String(p.mm),String(p.mm),String(p.mm)]);
 }

 function confirmRemoval(){
  if(!selected)return;const vals=sulcos.map(Number);
  if(vals.some(v=>Number.isNaN(v)||v<0)){setMessage('Preencha corretamente os sulcos.');return}
  const mm=Math.min(...vals);
  setTires(v=>v.filter(x=>x.fogo!==selected.fogo));
  setStock(v=>[...v,{...selected,mm,status:'USADO',equipamento:undefined,placa:undefined,posicao:undefined}]);
  setMessage(`Pneu ${selected.fogo} retornou ao estoque como USADO. Movimento 201 preparado.`);setSelected(null);
 }

 function inspect(t:Tire){setSelected(t);setSulcos([String(t.mm),String(t.mm),String(t.mm),String(t.mm)])}
 function saveInspection(){
  if(!selected)return;const vals=sulcos.map(Number);
  if(vals.some(v=>Number.isNaN(v)||!validarNovaLeitura(selected.mm,v))){setMessage(`A leitura não pode ser maior que a última aferida (${selected.mm.toFixed(1)} mm).`);return}
  const menor=Math.min(...vals);const c=classificarSulco(menor);
  setTires(v=>v.map(t=>t.fogo===selected.fogo?{...t,mm:menor}:t));
  setMessage(`${selected.fogo}: ${menor.toFixed(1)} mm — ${c.texto}. Próxima ação em ${c.dias} dias.`);setSelected(null);
 }

 function statusClass(mm:number){if(mm<=3.5)return s.red;if(mm<=5)return s.yellow;if(mm<=7)return s.orange;return s.green}
 function chip(mm:number){if(mm<=3.5)return <span className={`${s.tag} ${s.late}`}>TROCA IMEDIATA</span>;if(mm<=5)return <span className={`${s.tag} ${s.att}`}>7 DIAS</span>;return <span className={`${s.tag} ${s.ok}`}>EM DIA</span>}

 return <AppShell><div className={`content ${s.page}`}>
  <div className={s.head}><div><span className="eyebrow">SERVIÇOS EM PNEUS</span><h2>Visão geral do equipamento</h2><p>Identifique a frota, acompanhe os pneus aplicados e execute os serviços em um único lugar.</p></div></div>

  <div className={s.quick}>
   <button className={s.action} onClick={()=>quickAction('inventario')}><ClipboardList/><span>Inventário de pneus aplicados</span></button>
   <button className={`${s.action} ${mode==='troca'?s.active:''}`} onClick={()=>quickAction('troca')}><RefreshCcw/><span>Troca / Rodízio</span></button>
   <button className={s.action} onClick={()=>quickAction('calibragem')}><Gauge/><span>Registrar calibragem</span></button>
   <button className={`${s.action} ${mode==='inspecao'?s.active:''}`} onClick={()=>quickAction('inspecao')}><ScanSearch/><span>Inspeção de pneus</span></button>
   <button className={s.action} onClick={()=>quickAction('conserto')}><Wrench/><span>Conserto / Reaplicação</span></button>
   <button className={s.action} onClick={()=>quickAction('historico')}><History/><span>Histórico de serviços</span></button>
  </div>

  <section className={s.finder}>
   <div className={s.tabs}><button className={searchMode==='placa'?s.active:''} onClick={()=>setSearchMode('placa')}>Buscar por placa</button><button className={searchMode==='frota'?s.active:''} onClick={()=>setSearchMode('frota')}>Buscar por ID da frota</button></div>
   <div className={s.searchRow}><div className={s.searchBox}><Search size={18}/><input value={query} onChange={e=>setQuery(e.target.value)} onKeyDown={e=>e.key==='Enter'&&findVehicle()} placeholder={searchMode==='placa'?'Digite a placa':'Digite o ID da frota'}/></div><button className={s.searchBtn} onClick={findVehicle}>Pesquisar</button></div>
  </section>

  {message&&<div className={s.msg}><CheckCircle2 size={17}/> {message}</div>}

  <section className={s.equipment}>
   <div className={s.visualCard}><div className={s.truck}><span className={s.truckLabel}>BETMIX · {vehicle.id}</span></div><div className={s.visualMeta}><div><small>CONFIGURAÇÃO</small><b>{vehicle.chassi}</b></div><div><small>TIPO</small><b>{vehicle.tipo}</b></div></div></div>
   <div className={s.infoCard}><div className={s.infoTop}><div><small className="eyebrow">FROTA SELECIONADA</small><h3>{vehicle.id} · {vehicle.placa}</h3></div><span className={s.status}>ATIVO</span></div><div className={s.details}><div className={s.detail}><small>MODELO</small><b>{vehicle.modelo}</b></div><div className={s.detail}><small>TIPO</small><b>{vehicle.tipo}</b></div><div className={s.detail}><small>CHASSI</small><b>{vehicle.chassi}</b></div><div className={s.detail}><small>PNEUS APLICADOS</small><b>{total}</b></div></div><div className={s.inputs}><label>KM atual<input value={km} onChange={e=>setKm(e.target.value)}/></label><label>Horímetro<input value={h} onChange={e=>setH(e.target.value)}/></label><button className={s.openBtn} onClick={()=>{setStarted(true);setMessage('Equipamento aberto para operação.')}}>Abrir equipamento</button></div></div>
  </section>

  <div className={s.summary}><div className={`${s.summaryCard} ${s.danger}`}><small>Troca imediata</small><b>{criticos}</b></div><div className={`${s.summaryCard} ${s.warn}`}><small>Atenção em 7 dias</small><b>{atencao}</b></div><div className={`${s.summaryCard} ${s.good}`}><small>Inspeções em dia</small><b>{emDia}</b></div><div className={`${s.summaryCard} ${s.orange}`}><small>MM médio</small><b>{media.toFixed(1)}</b></div><div className={s.summaryCard}><small>Pneus em estoque</small><b>{stock.length}</b></div></div>

  {started&&<div className={s.workspace}>
   <section className={s.diagram}><div className={s.diagramHead}><div><h3>Esquemática do equipamento · {vehicle.chassi}</h3><span>{mode==='troca'?'Arraste os pneus entre as posições':mode==='inspecao'?'Clique no pneu para registrar Sulco 1 a 4':'Selecione uma ação no topo'}</span></div></div><div className={s.vehicleDiagram}><div className={s.chassis}>BETMIX · {vehicle.id}</div>{positions8x4.map(pos=>{const t=byPos[pos];return <div key={pos} className={`${s.slot} ${t?statusClass(t.mm):''}`} onDragOver={e=>e.preventDefault()} onDrop={e=>dropOnPosition(pos,e.dataTransfer.getData('text/plain'))} onClick={()=>mode==='inspecao'&&t&&inspect(t)}><small>{pos}</small>{t?<div draggable={mode==='troca'} onDragStart={e=>e.dataTransfer.setData('text/plain','pos:'+pos)}><div className={s.tire}>◉</div><b>{t.fogo}</b><em>{t.mm.toFixed(1)} mm</em></div>:<em>Livre</em>}</div>})}</div></section>
   <aside className={s.side} onDragOver={e=>e.preventDefault()} onDrop={e=>dropStock(e.dataTransfer.getData('text/plain'))}><Warehouse size={31}/><h3>Estoque / movimentação</h3><p>No modo Troca, arraste um pneu aplicado para esta área para realizar a retirada e registrar os sulcos.</p><div className={s.sideBlock}><small>PNEUS DISPONÍVEIS</small><b>{stock.length}</b></div><div className={s.sideBlock}><small>MODO ATUAL</small><b>{mode==='troca'?'TROCA / RODÍZIO':mode==='inspecao'?'INSPEÇÃO':'VISUALIZAÇÃO'}</b></div><div className={s.sideBlock}><small>STATUS GERAL</small><b>{criticos?'AÇÃO NECESSÁRIA':'SEM CRÍTICOS'}</b></div></aside>
  </div>}

  <section><div className={s.diagramHead}><div><h3>Pneus aplicados no equipamento</h3><span>Detalhamento por posição, vida, sulcos e status de manutenção.</span></div></div><div className={s.tableWrap}><table className={s.table}><thead><tr><th>Posição</th><th>Nº fogo</th><th>Material</th><th>Marca / Modelo</th><th>Medida</th><th>Vida</th><th>Sulco 1</th><th>Sulco 2</th><th>Sulco 3</th><th>Sulco 4</th><th>KM acumulado</th><th>Status inspeção</th><th>Calibragem</th></tr></thead><tbody>{tires.map(t=><tr key={t.fogo}><td><b>{t.posicao}</b></td><td><b>{t.fogo}</b></td><td>{t.material}</td><td>{t.marca} {t.modelo}</td><td>{t.medida}</td><td>{t.vida}</td><td>{t.mm.toFixed(1)}</td><td>{t.mm.toFixed(1)}</td><td>{t.mm.toFixed(1)}</td><td>{t.mm.toFixed(1)}</td><td>{t.km.toLocaleString('pt-BR')} km</td><td>{chip(t.mm)}</td><td><span className={`${s.tag} ${s.ok}`}>EM DIA</span></td></tr>)}</tbody></table></div></section>

  {selected&&<div className="modalBackdrop"><div className="modal"><button className="modalClose" onClick={()=>setSelected(null)}><X/></button><span className="eyebrow">{mode==='inspecao'?'INSPEÇÃO DE PNEU':'RETIRADA DO EQUIPAMENTO'}</span><h3>Pneu {selected.fogo} · posição {selected.posicao}</h3><p>Informe os sulcos em milímetros.</p><div className="sulcos">{sulcos.map((v,i)=><label key={i}>Sulco {i+1}<input type="number" step="0.1" value={v} onChange={e=>setSulcos(x=>x.map((a,j)=>j===i?e.target.value:a))}/></label>)}</div>{mode==='troca'&&<label className="field">Motivo da retirada<select><option>Desgaste</option><option>Pneu furado / Conserto</option><option>Aproveitamento</option><option>Análise</option></select></label>}<button className="btn primary wide" onClick={mode==='inspecao'?saveInspection:confirmRemoval}>Confirmar</button></div></div>}
 </div></AppShell>
}
