import './globals.css';
import { AuthGate } from '@/components/AuthGate';

export const metadata = {
  title: 'Gestão de Pneus Betmix',
  description: 'Sistema web de gestão de pneus, estoque, serviços e frota'
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="pt-BR"><body><AuthGate>{children}</AuthGate></body></html>;
}
