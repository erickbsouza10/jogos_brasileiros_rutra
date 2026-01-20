import fs from "fs";
import "dotenv/config";

const CAMPEONATOS = [
  {
    nome: "Campeonato Paulista",
    arquivo: "paulista.json",
    tournamentId: 17,
    seasonId: 29415,
    estado: "SP"
  },
  {
    nome: "Campeonato Carioca",
    arquivo: "carioca.json",
    tournamentId: 45,
    seasonId: 29287,
    estado: "RJ"
  },
  {
    nome: "Campeonato Paraibano",
    arquivo: "paraibano.json",
    tournamentId: 371,
    seasonId: 29403,
    estado: "PB"
  }
];

async function buscarJogos(camp) {
  let todosJogos = [];
  let page = 0;

  while (page < 3) { // busca 3 páginas
    const url =
      `https://sofascore.p.rapidapi.com/tournaments/get-matches` +
      `?tournamentId=${camp.tournamentId}` +
      `&seasonId=${camp.seasonId}` +
      `&pageIndex=${page}`;

    const res = await fetch(url, {
      headers: {
        "X-RapidAPI-Key": process.env.RAPIDAPI_KEY,
        "X-RapidAPI-Host": "sofascore.p.rapidapi.com"
      }
    });

    if (!res.ok) {
      console.error(await res.text());
      break;
    }

    const data = await res.json();
    if (!data.events || data.events.length === 0) break;

    todosJogos.push(...data.events);
    page++;
  }

  const jogos = todosJogos.map(j => ({
    data: new Date(j.startTimestamp * 1000).toISOString().slice(0, 10),
    horario: new Date(j.startTimestamp * 1000).toISOString().slice(11, 16),
    estadio: j.venue?.name || null,
    status: j.status?.type || null,
    mandante: {
      id: j.homeTeam.slug,
      nome: j.homeTeam.name
    },
    visitante: {
      id: j.awayTeam.slug,
      nome: j.awayTeam.name
    }
  }));

  const jsonFinal = {
    campeonato: camp.nome,
    estado: camp.estado,
    fonte: "Sofascore",
    total_jogos: jogos.length,
    jogos
  };

  fs.mkdirSync("data", { recursive: true });
  fs.writeFileSync(
    `data/${camp.arquivo}`,
    JSON.stringify(jsonFinal, null, 2)
  );

  console.log(`✔ ${camp.arquivo} gerado (${jogos.length} jogos)`);
}

async function executar() {
  for (const camp of CAMPEONATOS) {
    await buscarJogos(camp);
  }
}

executar();
