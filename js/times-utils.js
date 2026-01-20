import timesData from "./times.js";

/* ===============================
   NORMALIZAÇÃO (ÚNICA REGRA)
================================ */
function normalizar(v) {
  return v
    ?.toString()
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

/* ===============================
   MAPA MANUAL PELO NOME (ALT)
   👉 PRIORIDADE TOTAL
================================ */
const MAPA_POR_NOME = {
  "atletico-mg": {
    nome: "Atlético Mineiro",
    escudo: "https://upload.wikimedia.org/wikipedia/commons/2/27/Clube_Atl%C3%A9tico_Mineiro_logo.svg"
  },
  "palmeiras": {
    nome: "Palmeiras",
    escudo: "https://upload.wikimedia.org/wikipedia/commons/1/10/Palmeiras_logo.svg"
  },
  "coritiba": {
    nome: "Coritiba",
    escudo: "https://a.espncdn.com/i/teamlogos/soccer/500-dark/3456.png"
  },
  "athletico-paranaense": {
    nome: "Athletico Paranaense",
    escudo: "https://upload.wikimedia.org/wikipedia/commons/2/2e/Athletico_Paranaense_logo.svg"
  },
  "internacional": {
    nome: "Internacional",
    escudo: "https://upload.wikimedia.org/wikipedia/commons/f/f1/Escudo_do_Sport_Club_Internacional.svg"
  },
  "vitoria": {
    nome: "Vitória",
    escudo: "https://upload.wikimedia.org/wikipedia/commons/7/7c/Esporte_Clube_Vit%C3%B3ria_logo.svg"
  },
  "remo": {
    nome: "Remo",
    escudo: "https://www.clubedoremo.com.br/images/escudo-simbolo.png"
  },
  "fluminense": {
    nome: "Fluminense",
    escudo: "https://upload.wikimedia.org/wikipedia/commons/a/ad/Fluminense_FC_escudo.png"
  },
  "gremio": {
    nome: "Grêmio",
    escudo: "https://upload.wikimedia.org/wikipedia/commons/0/08/Gremio_logo.svg"
  },
  "chapecoense": {
    nome: "Chapecoense",
    escudo: "https://upload.wikimedia.org/wikipedia/pt/b/bc/Escudo_de_2018_da_Chapecoense.png"
  },
  "santos": {
    nome: "Santos",
    escudo: "https://upload.wikimedia.org/wikipedia/commons/3/35/Santos_logo.svg"
  },
  "corinthians": {
    nome: "Corinthians",
    escudo: "https://upload.wikimedia.org/wikipedia/commons/5/5a/Corinthians_logo.svg"
  },
  "bahia": {
    nome: "Bahia",
    escudo: "https://cdn.worldvectorlogo.com/logos/bahia-1.svg"
  },
  "sao-paulo": {
    nome: "São Paulo",
    escudo: "https://upload.wikimedia.org/wikipedia/commons/6/6f/Sao_Paulo_FC_crest.svg"
  },
  "flamengo": {
    nome: "Flamengo",
    escudo: "https://upload.wikimedia.org/wikipedia/commons/9/96/Clube_de_Regatas_do_Flamengo_logo.svg"
  },
  "mirassol": {
    nome: "Mirassol",
    escudo: "https://upload.wikimedia.org/wikipedia/commons/c/cf/Mirassol_FC_Escudo.jpg"
  },
  "vasco-da-gama": {
    nome: "Vasco",
    escudo: "https://upload.wikimedia.org/wikipedia/commons/2/26/CR_Vasco_da_Gama_logo.svg"
  },
  "botafogo": {
    nome: "Botafogo",
    escudo: "https://upload.wikimedia.org/wikipedia/commons/1/17/Botafogo_Futebol_Clube_logo.svg"
  },
  "cruzeiro": {
    nome: "Cruzeiro",
    escudo: "https://upload.wikimedia.org/wikipedia/commons/9/90/Cruzeiro_Esporte_Clube_%28logo%29.svg"
  }
};

/* ===============================
   INDEXAÇÃO DO times.js (SECUNDÁRIO)
================================ */
const timesIndex = {};

if (timesData?.clubes) {
  timesData.clubes.forEach(grupo => {
    grupo.times.forEach(time => {
      timesIndex[normalizar(time.id)] = time;
      timesIndex[normalizar(time.nome)] = time;
    });
  });
}

/* ===============================
   FUNÇÃO FINAL (API SAFE)
================================ */
export function getTimeById(apiId, apiNome = "", apiEscudo = "") {
  const nomeKey = normalizar(apiNome);

  // 1️⃣ PRIORIDADE ABSOLUTA → NOME (ALT)
  if (MAPA_POR_NOME[nomeKey]) {
    return {
      id: apiId,
      nome: MAPA_POR_NOME[nomeKey].nome,
      escudo: MAPA_POR_NOME[nomeKey].escudo,
      cor_principal: "#64748B"
    };
  }

  // 2️⃣ tenta pelo times.js
  if (timesIndex[nomeKey]) {
    return timesIndex[nomeKey];
  }

  // 3️⃣ escudo vindo direto da API
  if (apiEscudo && apiEscudo.startsWith("http")) {
    return {
      id: apiId,
      nome: apiNome || apiId,
      escudo: apiEscudo,
      cor_principal: "#64748B"
    };
  }

  // 4️⃣ fallback final
  return {
    id: apiId,
    nome: apiNome || apiId,
    escudo: "https://cdn-icons-png.freepik.com/512/786/786346.png",
    cor_principal: "#64748B"
  };
}
