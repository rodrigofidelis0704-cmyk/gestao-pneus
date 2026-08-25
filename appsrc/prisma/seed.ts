import { PrismaClient, TipoEixoMaterial, TipoPosicao, LadoPosicao, LocalizacaoLateral } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  const medidas = {
    m275: await prisma.medidaPneu.upsert({
      where: { descricao: "275/80R22,5" },
      update: {},
      create: { descricao: "275/80R22,5" }
    }),
    m295: await prisma.medidaPneu.upsert({
      where: { descricao: "295/80R22,5" },
      update: {},
      create: { descricao: "295/80R22,5" }
    })
  };

  const rodoviario = await prisma.aplicacao.upsert({
    where: { codigo: "RODOVIARIO" },
    update: {},
    create: { codigo: "RODOVIARIO", descricao: "Operação 100% em pistas pavimentadas" }
  });

  const misto = await prisma.aplicacao.upsert({
    where: { codigo: "MISTO" },
    update: {},
    create: { codigo: "MISTO", descricao: "Operação mista" }
  });

  const materiais = [
    { codigo: "55", descricao: "Pneu 275/80R22,5 Direcional Rodoviário", medidaId: medidas.m275.id, aplicacaoId: rodoviario.id, tipoEixo: TipoEixoMaterial.DIRECIONAL },
    { codigo: "58", descricao: "Pneu 295/80R22,5 Direcional Rodoviário", medidaId: medidas.m295.id, aplicacaoId: rodoviario.id, tipoEixo: TipoEixoMaterial.DIRECIONAL },
    { codigo: "7187", descricao: "Pneu 295/80R22,5 Eixo Livre Misto", medidaId: medidas.m295.id, aplicacaoId: misto.id, tipoEixo: TipoEixoMaterial.EIXO_LIVRE }
  ];

  for (const material of materiais) {
    await prisma.material.upsert({
      where: { codigo: material.codigo },
      update: material,
      create: material
    });
  }

  for (const nome of ["Pirelli", "Michelin", "Goodyear"]) {
    await prisma.marca.upsert({ where: { nome }, update: {}, create: { nome } });
  }

  const layouts: Record<string, string[]> = {
    "4x2": ["1EE","1DE","2EE","2EI","2DI","2DE","STP1"],
    "6x2": ["1EE","1DE","2EE","2EI","2DI","2DE","3EE","3EI","3DI","3DE","STP1"],
    "6x4": ["1EE","1DE","2EE","2EI","2DI","2DE","3EE","3EI","3DI","3DE","STP1"],
    "8x4": ["1EE","1DE","2EE","2DE","3EE","3EI","3DI","3DE","4EE","4EI","4DI","4DE","STP1"],
    "CARRETA_3_EIXOS": ["1EE","1EI","1DI","1DE","2EE","2EI","2DI","2DE","3EE","3EI","3DI","3DE","STP1","STP2"],
    "CARRETA_4_EIXOS": ["1EE","1EI","1DI","1DE","2EE","2EI","2DI","2DE","3EE","3EI","3DI","3DE","4EE","4EI","4DI","4DE","STP1","STP2"]
  };

  for (const [codigo, posicoes] of Object.entries(layouts)) {
    const eixos = Math.max(...posicoes.filter(p => /^\d/.test(p)).map(p => Number(p[0])));
    const cfg = await prisma.configuracaoChassi.upsert({
      where: { codigo },
      update: {},
      create: { codigo, descricao: codigo.replaceAll("_"," "), quantidadeEixos: eixos }
    });

    for (let i = 0; i < posicoes.length; i++) {
      const p = posicoes[i];
      const estepe = p.startsWith("STP");
      const numeroEixo = estepe ? null : Number(p[0]);
      const lado = estepe ? null : (p[1] === "E" ? LadoPosicao.ESQUERDO : LadoPosicao.DIREITO);
      const localizacao = estepe ? null : (p[2] === "I" ? LocalizacaoLateral.INTERNO : LocalizacaoLateral.EXTERNO);

      await prisma.posicaoConfiguracao.upsert({
        where: { configuracaoChassiId_codigo: { configuracaoChassiId: cfg.id, codigo: p } },
        update: {},
        create: {
          configuracaoChassiId: cfg.id,
          codigo: p,
          numeroEixo,
          lado,
          localizacaoLateral: localizacao,
          tipoPosicao: estepe ? TipoPosicao.ESTEPE : TipoPosicao.RODANTE,
          rodante: !estepe,
          ordemVisual: i + 1
        }
      });
    }
  }

  console.log("Seed concluído.");
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());