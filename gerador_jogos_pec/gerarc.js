import fs from "fs";
import "dotenv/config";

const LEAGUE_ID = 71; // Carioca
const SEASON = 2026;

const url = `https://api-football-v1.p.rapidapi.com/v3/fixtures?league=${LEAGUE_ID}&season=${SEASON}`;

const res = await fetch(url, {
  headers: {
    "X-RapidAPI-Key": process.env.API_FOOTBALL_KEY,
    "X-RapidAPI-Host": "api-football-v1.p.rapidapi.com"
  }
});

if (!res.ok) {
  throw new Error("Erro na API: " + res.status);
}

const data = await res.json();

const jogos = data.response.map(j => ({
  data: j.fixture.date.slice(0, 10),
  horario: j.fixture.date.slice(11, 16),
  estadio: j.fixture.venue?.name || null,
  rodada: j.league.round,
  status: j.fixture.status.short,
  mandante: {
    id: j.teams.home.name.toLowerCase().replace(/\s+/g, "-"),
    nome: j.teams.home.name
  },
  visitante: {
    id: j.teams.away.name.toLowerCase().replace(/\s+/g, "-"),
    nome: j.teams.away.name
  }
}));

fs.writeFileSync(
  "carioca-2026.json",
  JSON.stringify(
    {
      campeonato: "Campeonato Carioca 2026",
      estado: "RJ",
      jogos
    },
    null,
    2
  )
);

console.log("✔ carioca-2026.json gerado com sucesso");
