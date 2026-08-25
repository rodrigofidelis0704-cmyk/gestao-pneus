'use client';
import { AppShell } from '@/components/AppShell';
import { appliedTires, stockTires } from '@/lib/demoData';
import Link from 'next/link';
function pct(a:number,b:number){return Math.min(100,Math.round(a/b*100))}
export default function Home(){
 const calibrados=7, metaCal=9, inspecionados=78, metaInsp=92;
 const criticos=appliedTires.filter(t=>t.mm<=3.5).length;
 const mascote=criticos===0&&calibrados>=metaCal&&inspecionados>=metaInsp?'feliz':criticos>0?'bravo':'atento';
 return <AppShell><div className="content dashboard">
  <section className="hero homeHero"><div><span className="eyebrow">OPERAÇÃO DE HOJE</span><h2>Rodar perfeito começa na rotina diária.</h2><p>Acompanhe metas, pneus críticos e estoque em uma única visão.</p></div><div className={'mascot '+mascote}><div className="helmet">BETMIX</div><div className="face">{mascote==='feliz'?'😄':mascote==='bravo'?'😠':'🙂'}</div><div className="body">🧰</div><span>{mascote==='bravo'?`${criticos} pneu crítico exige ação`:'Metas sob controle'}</span></div></section>
  <div className="dailyGrid"><div className="goalCard"><div><small>CALIBRAGEM</small><b>{calibrados}/{metaCal}</b><span>equipamentos na meta acumulada</span></div><div className="progress"><i style={{width:pct(calibrados,metaCal)+'%'}}/></div><strong>{pct(calibrados,metaCal)}%</strong></div><div className="goalCard"><div><small>INSPEÇÕES</small><b>{inspecionados}/{metaInsp}</b><span>pneus únicos inspecionados</span></div><div className="progress"><i style={{width:pct(inspecionados,metaInsp)+'%'}}/></div><strong>{pct(inspecionados,metaInsp)}%</strong></div><Link href="/aplicados" className="criticalCard"><small>TROCA IMEDIATA</small><b>{criticos}</b><span>≤ 3,5 mm · prazo de ação: 3 dias</span><em>Ver pneus críticos →</em></Link></div>
  <h3 className="sectionLabel">Visão gerencial</h3><div className="cards managementCards"><Link href="/estoque" className="card"><h3>Estoque</h3><strong>{stockTires.length} pneus disponíveis</strong><p>Novos, usados, reformados e em reforma.</p></Link><Link href="/servicos" className="card"><h3>Serviços</h3><strong>Operação por equipamento</strong><p>Troca/rodízio por arrasto, calibragem e inspeção.</p></Link><Link href="/sucata" className="card"><h3>Perdas</h3><strong>Operacional + manutenção</strong><p>Destaque automático das perdas evitáveis.</p></Link><Link href="/relatorios" className="card"><h3>Previsão</h3><strong>30 / 60 / 90 dias</strong><p>Consumo, estoque, reforma e compra recomendada.</p></Link></div>
 </div></AppShell>
}
