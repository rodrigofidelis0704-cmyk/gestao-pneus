export type TireStatus = 'NOVO'|'USADO'|'REFORMADO'|'EM_REFORMA'|'SUCATA';
export type Tire = {
  fogo:string; material:string; descricao:string; marca:string; modelo:string; medida:string; dot:string;
  vida:number; mm:number; status:TireStatus; valor:number; km:number; equipamento?:string; placa?:string; posicao?:string;
  ultimaInspecao?:string; proximaInspecao?:string; fornecedor?:string;
};

export const fleet = [
  {id:'BT1001',placa:'ABC1D23',tipo:'Betoneira',modelo:'VW 31.320',chassi:'8x4',km:118420,horimetro:7820},
  {id:'BT1032',placa:'SYX3D99',tipo:'Betoneira',modelo:'VW 26.280',chassi:'6x4',km:116774,horimetro:6914},
  {id:'BL415',placa:'QXZ7H11',tipo:'Bomba',modelo:'Mercedes Atego',chassi:'6x2',km:84210,horimetro:11240},
  {id:'BT1120',placa:'RVA4E20',tipo:'Betoneira',modelo:'Volvo VM360',chassi:'8x4',km:62390,horimetro:3910},
];

export const appliedTires:Tire[] = [
  {fogo:'082601',material:'55',descricao:'Pneu 275/80R22,5 Direcional',marca:'Pirelli',modelo:'FG88',medida:'275/80R22,5',dot:'0725',vida:1,mm:12.8,status:'NOVO',valor:1490,km:28400,equipamento:'BT1001',placa:'ABC1D23',posicao:'1EE',ultimaInspecao:'18/08/2026',proximaInspecao:'17/09/2026'},
  {fogo:'082602',material:'55',descricao:'Pneu 275/80R22,5 Direcional',marca:'Pirelli',modelo:'FG88',medida:'275/80R22,5',dot:'0825',vida:1,mm:12.4,status:'NOVO',valor:1450,km:28400,equipamento:'BT1001',placa:'ABC1D23',posicao:'1DE',ultimaInspecao:'18/08/2026',proximaInspecao:'17/09/2026'},
  {fogo:'072501',material:'58R',descricao:'Pneu 295/80R22,5 Tração Reformado',marca:'Michelin',modelo:'XDE+',medida:'295/80R22,5',dot:'1823',vida:2,mm:8.7,status:'REFORMADO',valor:820,km:48200,equipamento:'BT1001',placa:'ABC1D23',posicao:'3EE',ultimaInspecao:'20/08/2026',proximaInspecao:'19/09/2026'},
  {fogo:'072502',material:'58R',descricao:'Pneu 295/80R22,5 Tração Reformado',marca:'Michelin',modelo:'XDE+',medida:'295/80R22,5',dot:'2023',vida:2,mm:6.2,status:'REFORMADO',valor:690,km:51800,equipamento:'BT1001',placa:'ABC1D23',posicao:'3EI',ultimaInspecao:'20/08/2026',proximaInspecao:'04/09/2026'},
  {fogo:'052401',material:'55',descricao:'Pneu 275/80R22,5 Direcional',marca:'Pirelli',modelo:'FG88',medida:'275/80R22,5',dot:'1421',vida:1,mm:4.4,status:'USADO',valor:510,km:78500,equipamento:'BT1001',placa:'ABC1D23',posicao:'3DI',ultimaInspecao:'20/08/2026',proximaInspecao:'27/08/2026'},
  {fogo:'052402',material:'58',descricao:'Pneu 295/80R22,5',marca:'Michelin',modelo:'XDE+',medida:'295/80R22,5',dot:'1221',vida:1,mm:3.2,status:'USADO',valor:390,km:92300,equipamento:'BT1001',placa:'ABC1D23',posicao:'3DE',ultimaInspecao:'20/08/2026',proximaInspecao:'23/08/2026'},
  {fogo:'052403',material:'7187',descricao:'Pneu 295/80R22,5 Eixo Livre',marca:'Goodyear',modelo:'MSA+',medida:'295/80R22,5',dot:'1120',vida:1,mm:9.2,status:'USADO',valor:720,km:64200,equipamento:'BT1001',placa:'ABC1D23',posicao:'4EE',ultimaInspecao:'20/08/2026',proximaInspecao:'19/09/2026'},
  {fogo:'052404',material:'7187',descricao:'Pneu 295/80R22,5 Eixo Livre',marca:'Goodyear',modelo:'MSA+',medida:'295/80R22,5',dot:'1320',vida:1,mm:7.8,status:'USADO',valor:660,km:66100,equipamento:'BT1001',placa:'ABC1D23',posicao:'4EI',ultimaInspecao:'20/08/2026',proximaInspecao:'19/09/2026'},
  {fogo:'052405',material:'7187',descricao:'Pneu 295/80R22,5 Eixo Livre',marca:'Goodyear',modelo:'MSA+',medida:'295/80R22,5',dot:'1720',vida:1,mm:5.0,status:'USADO',valor:510,km:69800,equipamento:'BT1001',placa:'ABC1D23',posicao:'4DI',ultimaInspecao:'20/08/2026',proximaInspecao:'27/08/2026'},
  {fogo:'052406',material:'7187',descricao:'Pneu 295/80R22,5 Eixo Livre',marca:'Goodyear',modelo:'MSA+',medida:'295/80R22,5',dot:'1920',vida:1,mm:10.1,status:'USADO',valor:760,km:62200,equipamento:'BT1001',placa:'ABC1D23',posicao:'4DE',ultimaInspecao:'20/08/2026',proximaInspecao:'19/09/2026'},
];

export const stockTires:Tire[] = [
  {fogo:'082603',material:'7187',descricao:'Pneu 295/80R22,5 Eixo Livre Misto',marca:'Goodyear',modelo:'MSA+',medida:'295/80R22,5',dot:'1125',vida:1,mm:18,status:'NOVO',valor:2100,km:0},
  {fogo:'082604',material:'58',descricao:'Pneu 295/80R22,5 Direcional',marca:'Michelin',modelo:'XDE+',medida:'295/80R22,5',dot:'1225',vida:1,mm:18,status:'NOVO',valor:2100,km:0},
  {fogo:'062505',material:'55',descricao:'Pneu 275/80R22,5 Direcional',marca:'Pirelli',modelo:'FG88',medida:'275/80R22,5',dot:'0924',vida:1,mm:8.5,status:'USADO',valor:720,km:47100},
  {fogo:'062506',material:'58R',descricao:'Pneu 295/80R22,5 Reformado',marca:'Michelin',modelo:'XDE+',medida:'295/80R22,5',dot:'1223',vida:2,mm:14,status:'REFORMADO',valor:960,km:58100},
  {fogo:'062507',material:'7187',descricao:'Pneu 295/80R22,5 Eixo Livre',marca:'Goodyear',modelo:'MSA+',medida:'295/80R22,5',dot:'1523',vida:1,mm:6.4,status:'USADO',valor:580,km:70300},
];

export const movements = [
 {doc:'21082026-1542-01',fogo:'062506',material:'58R',tipo:551,data:'21/08/2026',hora:'15:42',responsavel:'Rodrigo',descricao:'Retorno de reforma'},
 {doc:'21082026-1418-01',fogo:'052406',material:'7187',tipo:201,data:'21/08/2026',hora:'14:18',responsavel:'Operador',descricao:'Equipamento → estoque'},
 {doc:'21082026-0935-01',fogo:'082603',material:'7187',tipo:101,data:'21/08/2026',hora:'09:35',responsavel:'Operador',descricao:'Entrada por NF'},
 {doc:'20082026-1702-01',fogo:'072502',material:'58R',tipo:261,data:'20/08/2026',hora:'17:02',responsavel:'Operador',descricao:'Estoque → equipamento'},
];

export const scrap = [
 {fogo:'BT11062',material:'Goodyear ARMO MAX MSD',vida:1,mm:22.78,valor:2700,classificacao:'OPERACIONAL',motivo:'Flanco passante',data:'20/06/2026'},
 {fogo:'BT356-4DI',material:'XBRI ECOMIX',vida:1,mm:10.75,valor:1216.24,classificacao:'OPERACIONAL',motivo:'Pedra entre rodado',data:'17/06/2026'},
 {fogo:'BT383-4DE',material:'Michelin XMULT Z',vida:4,mm:3,valor:597.17,classificacao:'ESTRUTURAL_FADIGA',motivo:'Estouro / quebra de carcaça',data:'01/07/2026'},
 {fogo:'BT1043-3DE',material:'Pirelli FG88',vida:1,mm:2.83,valor:900.96,classificacao:'ERRO_MANUTENCAO',motivo:'Rodou vazio',data:'07/07/2026'},
];

export const suppliers = ['Reformadora Sul','VIPAL Borrachas','Rodoband Pneus'];
export const positions8x4 = ['1EE','1DE','2EE','2DE','3EE','3EI','3DI','3DE','4EE','4EI','4DI','4DE','STP1'];
