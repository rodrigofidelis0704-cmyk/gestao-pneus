# Gestão de Pneus BETMIX

Aplicação Next.js para gestão do ciclo completo dos pneus da frota BETMIX.

## Módulos implementados na interface de teste

- Dashboard operacional com metas de calibragem e inspeção, pneus críticos e mascote animado.
- Frota e configurações de chassi.
- Serviços por equipamento: placa/código, KM/horímetro, troca/rodízio por arrastar, retirada para estoque, aplicação do estoque, calibragem e inspeção com quatro sulcos.
- Regra de inspeção: leitura atual nunca maior que a última; <=3,5 mm crítico/3 dias; 3,6–5 mm/7 dias; 5,1–7 mm/15 dias; >7 mm/30 dias.
- Estoque por condição: Novo, Usado, Reformado e Em Reforma.
- Entrada por Nota Fiscal, lotes múltiplos, envio para reforma, transferência entre estoques e sucata.
- Restrições: NOVO não reforma/não sucateia; REFORMADO não reforma; USADO sem restrição normal.
- Pneus aplicados com criticidade por sulco.
- Sucata com perdas Operacionais, Estrutural/Fadiga e Erro de Manutenção.
- Relatórios com Data Inicial/Data Final e impressão/exportação para PDF pelo navegador.
- Configurações, fornecedores, perfis e logs de movimentação.
- Modelo Prisma da Fase 1 com Empresa > Unidade > Estoque, inspeções, calibragens, lotes de reforma/transferência e análise de sucata.
- Códigos de movimentação: 101/102, 201/202, 261/262, 361/362, 461/462, 551/552, 601/602, 751/752.

## Perfis

- Gestor / Master: acesso total.
- Operador: operações normais; não pode retornar um pneu da sucata.

## Execução

```bash
npm install
npm run prisma:generate
npm run dev
```

Para usar banco real, configure `DATABASE_URL`, `NEXT_PUBLIC_SUPABASE_URL` e `NEXT_PUBLIC_SUPABASE_ANON_KEY` conforme o ambiente. A interface entregue contém dados de demonstração para permitir teste imediato das regras de interação sem depender de carga inicial no banco.
