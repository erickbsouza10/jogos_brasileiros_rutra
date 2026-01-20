const BASE_URL =
  "https://site.api.espn.com/apis/site/v2/sports/soccer/bra.1/scoreboard";

async function fetchDia(dateYYYYMMDD) {
  const res = await fetch(`${BASE_URL}?dates=${dateYYYYMMDD}&lang=pt`);
  const data = await res.json();
  return data.events ?? [];
}

function normalizar(event) {
  const comp = event.competitions[0];
  const [home, away] = comp.competitors;
  const [data, hora] = event.date.split("T");

  return {
    data,
    horario: hora?.substring(0, 5) ?? null,
    estadio: comp.venue?.fullName ?? null,
    transmissao: null,
    mandante: {
      id: home.team.abbreviation.toLowerCase(),
      nome: home.team.displayName
    },
    visitante: {
      id: away.team.abbreviation.toLowerCase(),
      nome: away.team.displayName
    }
  };
}

export async function carregarMesESPN(ano, mes) {
  const diasNoMes = new Date(ano, mes + 1, 0).getDate();
  const promises = [];

  for (let dia = 1; dia <= diasNoMes; dia++) {
    const d =
      `${ano}${String(mes + 1).padStart(2, "0")}${String(dia).padStart(2, "0")}`;
    promises.push(fetchDia(d));
  }

  const responses = await Promise.all(promises);

  const eventos = responses.flat();

  const mapa = new Map();
  eventos.forEach(e => mapa.set(e.id, e));

  return Array.from(mapa.values()).map(normalizar);
}
