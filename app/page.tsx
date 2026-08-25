'use client';

import {useEffect,useState} from 'react';
import Link from 'next/link';
import {AppShell} from '@/components/AppShell';
import {Gauge,Package,Truck,ClipboardCheck,Recycle,BarChart3,ArrowRight,Activity,ShieldCheck,Wrench} from 'lucide-react';
import {supabase} from '@/lib/supabase';
import styles from './home.module.css';

type HomeStats={veiculos:number;pneus:number;aplicados:number;estoque:number;criticos:number};
const initialStats:HomeStats={veiculos:0,pneus:0,aplicados:0,estoque:0,criticos:0};

export default function Home(){
  const [stats,setStats]=useState<HomeStats>(initialStats);
  const [loading,setLoading]=useState(true);

  useEffect(()=>{
    let ativo=true;
    async function carregar(){
      setLoading(true);
      const [veiculos,pneus,aplicados,estoque,criticos]=await Promise.all([
        supabase.from('veiculos').select('id',{count:'exact',head:true}).eq('ativo',true),
        supabase.from('pneus').select('id',{count:'exact',head:true}).eq('ativo',true),
        supabase.from('montagens_pneu').select('id',{count:'exact',head:true}).is('data_desmontagem',null),
        supabase.from('pneus').select('id',{count:'exact',head:true}).eq('ativo',true).not('unidade_atual_id','is',null).in('status_atual',['NOVO','USADO','REFORMADO']),
        supabase.from('pneus').select('id',{count:'exact',head:true}).eq('ativo',true).lte('sulco_atual_1',3.5).neq('status_atual','SUCATA')
      ]);
      if(!ativo)return;
      setStats({veiculos:veiculos.count??0,pneus:pneus.count??0,aplicados:aplicados.count??0,estoque:estoque.count??0,criticos:criticos.count??0});
      setLoading(false);
    }
    carregar();
    return()=>{ativo=false};
  },[]);

  const v=(n:number)=>loading?'—':n.toLocaleString('pt-BR');

  return <AppShell><div className={`content ${styles.home}`}>
    <section className={styles.hero}>
      <div className={styles.heroGrid}>
        <div>
          <span className={styles.eyebrow}><Activity size={14}/> GESTÃO INTELIGENTE DE PNEUS</span>
          <h2>Rodar perfeito começa com informação em movimento.</h2>
          <p>Acompanhe frota, estoque, pneus aplicados, serviços e análises em uma única visão operacional.</p>
          <div className={styles.heroActions}>
            <Link href="/servicos" className={styles.primary}>Abrir serviços <ArrowRight size={16}/></Link>
            <Link href="/estoque" className={styles.ghost}>Ver estoque</Link>
          </div>
        </div>
        <div className={styles.visual}>
          <div className={styles.tireHalo}/><div className={styles.tire}/>
          <div className={`${styles.floatCard} ${styles.floatOne}`}><small>PNEUS APLICADOS</small><b>{v(stats.aplicados)}</b></div>
          <div className={`${styles.floatCard} ${styles.floatTwo}`}><small>ESTOQUE DISPONÍVEL</small><b>{v(stats.estoque)}</b></div>
          <div className={`${styles.floatCard} ${styles.floatThree}`}><small>FROTA ATIVA</small><b>{v(stats.veiculos)}</b></div>
        </div>
      </div>
    </section>

    <div className={styles.stats}>
      <Link href="/estoque" className={styles.statCard}><div className={styles.statIcon}><Package size={22}/></div><div><small>ESTOQUE DISPONÍVEL</small><b>{v(stats.estoque)}</b><span>novos, usados e reformados</span></div></Link>
      <Link href="/aplicados" className={styles.statCard}><div className={styles.statIcon}><Truck size={22}/></div><div><small>PNEUS APLICADOS</small><b>{v(stats.aplicados)}</b><span>montagens ativas na frota</span></div></Link>
      <div className={styles.statCard}><div className={styles.statIcon}><Gauge size={22}/></div><div><small>FROTA ATIVA</small><b>{v(stats.veiculos)}</b><span>equipamentos cadastrados</span></div></div>
      <Link href="/aplicados" className={styles.statCard}><div className={styles.statIcon}><ShieldCheck size={22}/></div><div><small>AÇÃO IMEDIATA</small><b>{v(stats.criticos)}</b><span>pneus com sulco 1 ≤ 3,5 mm</span></div></Link>
    </div>

    <div className={styles.sectionTitle}><h3>Acesso rápido</h3><span>{v(stats.pneus)} pneus ativos cadastrados</span></div>
    <div className={styles.modules}>
      <Link href="/estoque" className={styles.module}><span className={styles.wheelMark}/><div className={styles.moduleIcon}><Package size={23}/></div><h4>Estoque</h4><p>Novos, usados, reformados, transferências e envio ao reformador.</p><em>Acessar estoque →</em></Link>
      <Link href="/servicos" className={styles.module}><span className={styles.wheelMark}/><div className={styles.moduleIcon}><Wrench size={23}/></div><h4>Serviços</h4><p>Troca, rodízio, calibragem, inspeção, conserto e reaplicação.</p><em>Abrir serviços →</em></Link>
      <Link href="/aplicados" className={styles.module}><span className={styles.wheelMark}/><div className={styles.moduleIcon}><Truck size={23}/></div><h4>Pneus aplicados</h4><p>Visualize frota, posições, sulcos, vidas e situação de cada pneu.</p><em>Ver frota →</em></Link>
      <Link href="/sucata" className={`${styles.module} ${stats.criticos>0?styles.critical:''}`}><span className={styles.wheelMark}/><div className={styles.moduleIcon}><Recycle size={23}/></div><h4>Análise de sucata</h4><p>Diagnóstico técnico, fotos, causa principal, perda e decisão final.</p><em>Analisar pneus →</em></Link>
      <Link href="/relatorios" className={styles.module}><span className={styles.wheelMark}/><div className={styles.moduleIcon}><BarChart3 size={23}/></div><h4>Relatórios</h4><p>CPK, perdas, consumo, estoque, reformas e previsão de necessidade.</p><em>Abrir indicadores →</em></Link>
    </div>

    <div className={styles.progressGrid}>
      <div className={styles.progressCard}><div className={styles.progressTop}><div><small>BASE OPERACIONAL</small><b>{v(stats.pneus)}</b></div><ClipboardCheck size={28}/></div><div className={styles.bar}><i style={{width:'100%'}}/></div></div>
      <div className={styles.progressCard}><div className={styles.progressTop}><div><small>PNEUS EM USO</small><b>{v(stats.aplicados)}</b></div><Truck size={28}/></div><div className={styles.bar}><i style={{width:stats.pneus?`${Math.min(100,Math.round(stats.aplicados/stats.pneus*100))}%`:'0%'}}/></div></div>
    </div>

    <div className={styles.footerStrip}><div><ShieldCheck size={21}/><span><strong>Dados reais do Supabase.</strong> Indicadores atualizados diretamente da base operacional.</span></div><span>BETMIX · Gestão de pneus</span></div>
  </div></AppShell>;
}
