export type TireRow = {
  material: string; descricao: string; fogo: string; dot: string; medida: string; marca: string; modelo: string;
  vidas: number; mm: string; data: string; valor: string; km: string; extra?: string;
};

export const novos: TireRow[] = [
  {material:"55",descricao:"Pneu 275/80R22,5 Direcional Rodoviário",fogo:"082601",dot:"0724",medida:"275/80R22,5",marca:"Pirelli",modelo:"FG88",vidas:1,mm:"18,0 mm",data:"20/08/2026",valor:"R$ 1.200,00",km:"0 km"},
  {material:"58",descricao:"Pneu 295/80R22,5 Direcional Rodoviário",fogo:"082602",dot:"1024",medida:"295/80R22,5",marca:"Michelin",modelo:"XDE+",vidas:1,mm:"18,0 mm",data:"20/08/2026",valor:"R$ 1.250,00",km:"0 km"},
  {material:"7187",descricao:"Pneu 295/80R22,5 Eixo Livre Misto",fogo:"082603",dot:"1124",medida:"295/80R22,5",marca:"Goodyear",modelo:"MSA+",vidas:1,mm:"18,0 mm",data:"20/08/2026",valor:"R$ 1.300,00",km:"0 km"}
];
export const reformados: TireRow[] = [
  {material:"55R",descricao:"Pneu 275/80R22,5 Direcional Rodoviário (Reformado)",fogo:"072501",dot:"1823",medida:"275/80R22,5",marca:"Pirelli",modelo:"FG88",vidas:2,mm:"14,0 mm",data:"10/08/2026",valor:"R$ 480,00",km:"48.200 km",extra:"Reformadora Sul"},
  {material:"58R",descricao:"Pneu 295/80R22,5 Direcional Rodoviário (Reformado)",fogo:"072502",dot:"2023",medida:"295/80R22,5",marca:"Michelin",modelo:"XDE+",vidas:2,mm:"14,0 mm",data:"12/08/2026",valor:"R$ 500,00",km:"51.800 km",extra:"VIPAL Borrachas"}
];
export const usados: TireRow[] = [
  {material:"55",descricao:"Pneu 275/80R22,5 Direcional Rodoviário",fogo:"052401",dot:"1421",medida:"275/80R22,5",marca:"Pirelli",modelo:"FG88",vidas:1,mm:"11,0 mm",data:"18/08/2026",valor:"R$ 420,00",km:"78.500 km"},
  {material:"58",descricao:"Pneu 295/80R22,5 Direcional Rodoviário",fogo:"052402",dot:"1221",medida:"295/80R22,5",marca:"Michelin",modelo:"XDE+",vidas:1,mm:"8,5 mm",data:"18/08/2026",valor:"R$ 380,00",km:"92.300 km"},
  {material:"7187",descricao:"Pneu 295/80R22,5 Eixo Livre Misto",fogo:"052403",dot:"1120",medida:"295/80R22,5",marca:"Goodyear",modelo:"MSA+",vidas:1,mm:"13,2 mm",data:"19/08/2026",valor:"R$ 520,00",km:"64.200 km"}
];
export const terceiros: TireRow[] = [
  {material:"55",descricao:"Pneu 275/80R22,5 Direcional Rodoviário",fogo:"042301",dot:"0620",medida:"275/80R22,5",marca:"Pirelli",modelo:"FG88",vidas:1,mm:"3,2 mm",data:"05/08/2026",valor:"R$ 180,00",km:"112.400 km",extra:"Reformadora Sul"},
  {material:"58",descricao:"Pneu 295/80R22,5 Direcional Rodoviário",fogo:"042302",dot:"0520",medida:"295/80R22,5",marca:"Michelin",modelo:"XDE+",vidas:1,mm:"2,8 mm",data:"08/08/2026",valor:"R$ 160,00",km:"128.700 km",extra:"VIPAL Borrachas"},
  {material:"7187",descricao:"Pneu 295/80R22,5 Eixo Livre Misto",fogo:"042303",dot:"0720",medida:"295/80R22,5",marca:"Goodyear",modelo:"MSA+",vidas:1,mm:"4,1 mm",data:"10/08/2026",valor:"R$ 210,00",km:"95.300 km",extra:"Rodoband Pneus"}
];
