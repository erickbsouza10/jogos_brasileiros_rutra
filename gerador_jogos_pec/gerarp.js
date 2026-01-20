import fs from "fs";
import "dotenv/config";

const TOURNAMENT_ID = 17;
const SEASON_ID = 29415;

const url = `https://sofascore.p.rapidapi.com/tournaments/get-next-matches?tournamentId=${TOURNAMENT_ID}&seasonId=${SEASON_ID}&pageIndex=0`;

const res = await fetch(url, {
  headers: {
    "X-RapidAPI-Key": process.env.RAPIDAPI_KEY,
    "X-RapidAPI-Host": "sofascore.p.rapidapi.com"
  }
});

if (!res.ok) {
  console.error(await res.text());
  throw new Error("Erro Sofascore: " + res.status);
}

const data = await res.json();

const jogos = data.events.map(j => ({
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

fs.writeFileSync(
  "paulista-sofascore.json",
  JSON.stringify(
    {
      campeonato: "Campeonato Paulista",
      fonte: "Sofascore",
      jogos
    },
    null,
    2
  )
);

console.log("✔ paulista-sofascore.json gerado");
