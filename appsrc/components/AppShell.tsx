'use client';
import Link from 'next/link';
import type { ReactNode } from 'react';
import { usePathname } from 'next/navigation';
import { Gauge, Truck, FileBarChart, Warehouse, CircleDot, Trash2, Wrench, Settings, LogOut } from 'lucide-react';
import { supabase } from '@/lib/supabase';

const items = [
  ['/', 'Início', Gauge],['/frota','Frota',Truck],['/relatorios','Relatórios',FileBarChart],['/estoque','Estoque de pneus',Warehouse],
  ['/aplicados','Pneus aplicados',CircleDot],['/sucata','Pneus sucateados',Trash2],['/servicos','Serviços em pneus',Wrench],['/configuracoes','Configurações',Settings]
] as const;

export function AppShell({children}:{children:ReactNode}){
 const pathname=usePathname();
 return <div className="shell"><aside className="sidebar">
  <div className="brand"><div className="brandMark">B</div><div className="brandText"><strong>BETMIX</strong><span>GESTÃO DE PNEUS</span></div></div>
  <nav className="nav">{items.map(([href,label,Icon])=><Link key={href} href={href} className={pathname===href?'active':''}><Icon size={18}/><span>{label}</span></Link>)}</nav>
  <button className="logout" onClick={()=>supabase.auth.signOut()}><LogOut size={17}/> Sair</button>
 </aside><main className="main"><header className="topbar"><div className="title"><h1>Gestão de Pneus BETMIX</h1><p>Controle técnico, operacional e financeiro do ciclo completo do pneu.</p></div><div className="user"><div className="avatar">R</div><div><strong>Gestor / Master</strong><small>Unidade Matriz</small></div></div></header>{children}</main></div>
}
