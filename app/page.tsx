'use client';

import Link from 'next/link';
import {AppShell} from '@/components/AppShell';
import {Gauge,Package,Truck,ClipboardCheck,Recycle,BarChart3,ArrowRight,Activity,ShieldCheck,Wrench} from 'lucide-react';
import styles from './home.module.css';

function pct(a:number,b:number){return Math.min(100,Math.round(a/b*100))}

export default function Home(){
  const calibrados=7,metaCal=9,inspecionados=78,metaInsp=92,criticos=3;
  const pCal=pct(calibrados,metaCal),pInsp=pct(inspecionados,metaInsp);
  return <AppShell><div className={`content ${styles.home}`}>
    <section className={styles.hero}>
      <div className={styles.heroGrid}>
        <div>
          <span className={styles.eyebrow}><Activity size={14}/> OPERAÇÃO DE PNEUS</span>
          <h2>Rodar perfeito começa com controle visual e ação rápida.</h2>
          <p>Acompanhe estoque, serviços, pneus aplicados, análises e indicadores em uma única visão operacional.</p>
          <div className={styles.heroActions}>
            <Link href="/servicos" className={styles.primary}>Abrir serviços <ArrowRight size={16}/></Link>
            <Link href="/estoque" className={styles.ghost}>Ver estoque</Link>
          </div>
        </div>
        <div className={styles.visual}>
          <div className={styles.tireHalo}/><div className={styles.tire}/>
          <div className={`${styles.floatCard} ${styles.floatOne}`}><small>ESTOQUE</small><b>60 pneus de simulação</b></div>
          <div className={`${styles.floatCard} ${styles.floatTwo}`}><small>ANÁLISE</small><b>Sucata com rastreabilidade</b></div>
          <div className={`${styles.floatCard} ${styles.floatThree}`}><small>FROTA</small><b>Mapa por posição</b></div>
        </div>
      </div>
    </section>

    <div className={styles.stats}>
      <div className={styles.statCard}><div className={styles.statIcon}><Package size={22}/></div><div><small>Estoque disponível</small><b>60</b><span>20 novos · 20 usados · 20 reformados</span></div></div>
      <div className={styles.statCard}><div className={styles.statIcon}><Gauge size={22}/></div><div><small>Calibragem</small><b>{pCal}%</b><span>{calibrados}/{metaCal} equipamentos na meta</span></div></div>
      <div className={styles.statCard}><div className={styles.statIcon}><ClipboardCheck size={22}/></div><div><small>Inspeções</small><b>{pInsp}%</b><span>{inspecionados}/{metaInsp} pneus inspecionados</span></div></div>
      <div className={styles.statCard}><div className={styles.statIcon}><ShieldCheck size={22}/></div><div><small>Ação imediata</small><b>{criticos}</b><span>pneus críticos para revisão</span></div></div>
    </div>

    <div className={styles.sectionTitle}><h3>Acesso rápido</h3><span>Principais rotinas da gestão</span></div>
    <div className={styles.modules}>
      <Link href="/estoque" className={styles.module}><span className={styles.wheelMark}/><div className={styles.moduleIcon}><Package size={23}/></div><h4>Estoque</h4><p>Novos, usados, reformados, transferências e envio ao reformador.</p><em>Acessar estoque →</em></Link>
      <Link href="/servicos" className={styles.module}><span className={styles.wheelMark}/><div className={styles.moduleIcon}><Wrench size={23}/></div><h4>Serviços</h4><p>Troca, rodízio, calibragem, inspeção, conserto e reaplicação.</p><em>Abrir serviços →</em></Link>
      <Link href="/aplicados" className={styles.module}><span className={styles.wheelMark}/><div className={styles.moduleIcon}><Truck size={23}/></div><h4>Pneus aplicados</h4><p>Visualize a frota, posições, sulcos, vidas e situação de cada pneu.</p><em>Ver frota →</em></Link>
      <Link href="/sucata" className={`${styles.module} ${styles.critical}`}><span className={styles.wheelMark}/><div className={styles.moduleIcon}><Recycle size={23}/></div><h4>Análise de sucata</h4><p>Diagnóstico técnico, fotos, causa principal, perda e decisão final.</p><em>Analisar pneus →</em></Link>
      <Link href="/relatorios" className={styles.module}><span className={styles.wheelMark}/><div className={styles.moduleIcon}><BarChart3 size={23}/></div><h4>Relatórios</h4><p>CPK, perdas, consumo, estoque, reformas e previsão de necessidade.</p><em>Abrir indicadores →</em></Link>
    </div>

    <div className={styles.progressGrid}>
      <div className={styles.progressCard}><div className={styles.progressTop}><div><small>CALIBRAGEM DO PERÍODO</small><b>{pCal}%</b></div><Gauge size={28}/></div><div className={styles.bar}><i style={{width:`${pCal}%`}}/></div></div>
      <div className={styles.progressCard}><div className={styles.progressTop}><div><small>INSPEÇÕES DO PERÍODO</small><b>{pInsp}%</b></div><ClipboardCheck size={28}/></div><div className={styles.bar}><i style={{width:`${pInsp}%`}}/></div></div>
    </div>

    <div className={styles.footerStrip}><div><ShieldCheck size={21}/><span><strong>Gestão orientada por processo.</strong> Identificar → Registrar → Manter → Inspecionar → Renovar → Analisar.</span></div><span>BETMIX · Gestão de pneus</span></div>
  </div></AppShell>;
}
