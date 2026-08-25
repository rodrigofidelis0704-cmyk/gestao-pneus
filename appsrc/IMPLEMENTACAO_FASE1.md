# Implementação Fase 1 - Base de domínio

Esta versão consolida a modelagem aprovada para o sistema BETMIX antes da expansão das telas.

## Incluído
- Empresa > Unidade > Estoque.
- Status EM_REFORMA e EM_TRANSFERENCIA.
- Movimentações oficiais 101/102, 201/202, 261/262, 361/362, 461/462, 551/552, 601/602 e 751.
- Documento sequencial e vínculo de estorno.
- Inspeção com quatro sulcos, menor sulco, criticidade e prazo.
- Calibragem registrada por equipamento.
- Lotes de reforma e retorno aprovado/reprovado.
- Valor de reforma e nova milimetragem no retorno.
- Estrutura para acrescentar uma vida no movimento 551.
- Lotes de transferência entre estoques.
- Análise de sucata com Operacional, Estrutural/Fadiga e Erro de Manutenção.
- Correção do seed incompatível que referenciava TipoServicoPneu/TipoServico inexistentes.

## Antes de migrar banco existente
Gerar e revisar uma migration Prisma. Há alterações estruturais e não se recomenda executar `db push` diretamente em produção sem backup.
