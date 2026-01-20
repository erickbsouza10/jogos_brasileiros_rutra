// jogos-loader.js
import paraibano from "../scripts/2026/paraibano/ano.js";
import paulista from "../scripts/2026/paulista/ano.js";
import carioca from "../scripts/2026/carioca/ano.js";
import supercopa from "../scripts/2026/supercopa/ano.js";
import recopa from "../scripts/2026/recopa/ano.js";

/* ===============================
   NORMALIZA UM JOGO
================================ */
function normalizarJogo(jogo) {
  return {
    ...jogo,
    horario: jogo.horario || "--:--",
    estadio: jogo.estadio || "A definir",
    transmissao: jogo.transmissao || "A definir"
  };
}

/* ===============================
   NORMALIZA CAMPEONATO
================================ */
function normalizarCampeonato(camp) {
  // Supercopa / Recopa (partida única)
  if (camp.partida) {
    return {
      campeonato: camp.campeonato,
      fase: camp.fase ?? "Final",
      jogos: [normalizarJogo(camp.partida)]
    };
  }

  // Campeonatos com lista de jogos
  if (Array.isArray(camp.jogos)) {
    return {
      campeonato: camp.campeonato,
      fase: camp.fase ?? null,
      jogos: camp.jogos.map(normalizarJogo)
    };
  }

  return null;
}

/* ===============================
   EXPORT
================================ */
export async function carregarJogosESPN() {
  const campeonatos = [
    paraibano,
    paulista,
    carioca,
    supercopa,
    recopa
  ];

  return campeonatos
    .map(normalizarCampeonato)
    .filter(Boolean);
}
