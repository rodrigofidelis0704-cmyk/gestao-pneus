export function classificarSulco(menorSulco: number) {
  if (menorSulco <= 3.5) return { status: "CRITICO", dias: 3, texto: "Trocar imediatamente" } as const;
  if (menorSulco <= 5) return { status: "AMARELO", dias: 7, texto: "Programar troca" } as const;
  if (menorSulco <= 7) return { status: "LARANJA", dias: 15, texto: "Acompanhar" } as const;
  return { status: "VERDE", dias: 30, texto: "Condição normal" } as const;
}

export function validarNovaLeitura(anterior: number | null, atual: number) {
  if (atual < 0) return false;
  if (anterior == null) return true;
  return atual <= anterior;
}
