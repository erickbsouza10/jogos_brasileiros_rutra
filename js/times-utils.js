import timesData from "../scripts/times.js";

const timesIndex = {};

timesData.clubes.forEach(grupo => {
  grupo.times.forEach(time => {
    timesIndex[time.id] = time;
  });
});

export function getTimeById(id) {
  return timesIndex[id] || {
    id,
    nome: id,
    escudo: "https://via.placeholder.com/64?text=?",
    cor_principal: "#64748B"
  };
}
