import { jogos2026 } from "./jogos-loader.js";
import { getTimeById } from "./times-utils.js";
let mesAtual = new Date().getMonth(); // 0-11
let anoAtual = new Date().getFullYear();
let mesesRenderizados = new Set();

const daysContainer = document.getElementById("daysContainer");
const STORAGE_KEY = "agenda_jogos_selecionados";
let jogosSelecionados = JSON.parse(localStorage.getItem(STORAGE_KEY)) || {};

/* ===============================
   UTILIDADES DE DATA
================================ */
function atualizarPreviewJSON() {
    const output = document.getElementById("jsonOutput");
    if (!output) return;

    output.value = JSON.stringify(
        {
            campeonato: "Agenda personalizada",
            jogos: jogosSelecionados
        },
        null,
        2
    );
}

function salvarSelecao() {
    localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify(jogosSelecionados, null, 2)
    );
}
function adicionarJogoSelecionado(card) {
    const data = card.dataset.data;

    if (!jogosSelecionados[data]) {
        jogosSelecionados[data] = [];
    }

    // evita duplicar
    if (jogosSelecionados[data].some(j => j.id === card.dataset.jogoId)) return;

    jogosSelecionados[data].push({
        id: card.dataset.jogoId,
        data: card.dataset.data,
        horario: card.dataset.horario
    });

    salvarSelecao();
    atualizarPreviewJSON();
    atualizarBotaoFinalizar();
    updateFollowCount();

}

function removerJogoSelecionado(card) {
    const data = card.dataset.data;
    if (!jogosSelecionados[data]) return;

    jogosSelecionados[data] =
        jogosSelecionados[data].filter(j => j.id !== card.dataset.jogoId);

    if (jogosSelecionados[data].length === 0) {
        delete jogosSelecionados[data];
    }

    salvarSelecao();
    atualizarPreviewJSON();
    atualizarBotaoFinalizar();
    updateFollowCount();

}

function nomeMes(mes) {
    return new Date(anoAtual, mes).toLocaleDateString("pt-BR", {
        month: "long"
    });
}

function parseDate(dateStr) {
    return new Date(dateStr + "T00:00:00");
}

function formatDateBR(date) {
    return date.toLocaleDateString("pt-BR", {
        day: "2-digit",
        month: "long",
        year: "numeric"
    });
}

function formatWeekDay(date) {
    return date.toLocaleDateString("pt-BR", {
        weekday: "long"
    });
}

/* ===============================
   AGRUPAR JOGOS POR DIA (ROBUSTO)
================================ */

function agruparJogosPorData(mesSelecionado) {
    const hoje = new Date();
    hoje.setHours(0, 0, 0, 0);

    const mapa = {};

    jogos2026.forEach(campeonato => {

        if (Array.isArray(campeonato.jogos)) {
            campeonato.jogos.forEach(jogo => {
                adicionarJogoMes(mapa, hoje, campeonato, jogo, mesSelecionado);
            });
        }

        if (campeonato.partida) {
            adicionarJogoMes(mapa, hoje, campeonato, campeonato.partida, mesSelecionado);
        }

    });

    return mapa;
}

function adicionarJogoMes(mapa, hoje, campeonato, jogo, mesSelecionado) {
    const dataJogo = parseDate(jogo.data);

    if (dataJogo.getMonth() !== mesSelecionado) return;
    if (dataJogo < hoje && mesSelecionado === hoje.getMonth()) return;

    const chave = jogo.data;

    if (!mapa[chave]) {
        mapa[chave] = [];
    }

    mapa[chave].push({ campeonato, jogo });
}


function adicionarJogo(mapa, hoje, campeonato, jogo) {
    const dataJogo = parseDate(jogo.data);
    if (dataJogo < hoje) return;

    if (!mapa[jogo.data]) {
        mapa[jogo.data] = [];
    }

    mapa[jogo.data].push({ campeonato, jogo });
}

/* ===============================
   SVG ICONS INLINE
================================ */

function iconClock() {
    return `
    <svg class="w-4 h-4" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M12 1.75A10.25 10.25 0 1 0 22.25 12 10.262 10.262 0 0 0 12 1.75Zm0 18.5A8.25 8.25 0 1 1 20.25 12 8.259 8.259 0 0 1 12 20.25Zm.75-13h-1.5v6l5.25 3.15.75-1.23-4.5-2.67Z"/>
    </svg>
  `;
}

function iconStadium() {
    return `
    <svg class="w-4 h-4" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M4 5h16v2H4V5Zm0 4h16v10H4V9Zm2 2v6h12v-6H6Zm5-9h2v2h-2V2Z"/>
    </svg>
  `;
}

function iconTV() {
    return `
    <svg class="w-4 h-4" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M21 3H3a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h18a2 2 0 0 0 2-2V5a2 2 0 0 0-2-2Zm0 14H3V5h18Zm-6 3h-6v-1h6Z"/>
    </svg>
  `;
}
function totalJogosSelecionados() {
    return Object.values(jogosSelecionados)
        .reduce((acc, arr) => acc + arr.length, 0);
}

/* ===============================
   CARD DE JOGO
================================ */
function atualizarBotaoFinalizar() {
    const btn = document.getElementById("finalizarBtn");
    if (!btn) return;

    const totalSelecionados = Object.values(jogosSelecionados)
        .reduce((acc, arr) => acc + arr.length, 0);

    if (totalSelecionados > 0) {
        btn.classList.remove("hidden");
    } else {
        btn.classList.add("hidden");
    }
}


function criarCard(campeonato, jogo) {
    const mandante = getTimeById(jogo.mandante.id);
    const visitante = getTimeById(jogo.visitante.id);

    const jogoId = `${jogo.mandante.id}-x-${jogo.visitante.id}-${jogo.data}-${jogo.horario}`;


    return `
<article 
  class="card card-jogo flex gap-4 items-start cursor-pointer"
  data-jogo-id="${jogoId}"
  data-data="${jogo.data}"
  data-horario="${jogo.horario}"
>



      <!-- CHECKBOX LATERAL -->
      <div class="checkbox-wrap">
   <input 
  type="checkbox"
  class="jogo-checkbox"
  data-jogo-id="${jogoId}"
/>

        <span class="checkbox-ui"></span>
      </div>

      <!-- CONTEÚDO -->
      <div class="flex-1">

        <div class="mb-2">
          <span class="bg-accent-50 text-accent text-xs font-semibold px-3 py-1 rounded-full">
            ${campeonato.campeonato}
          </span>
        </div>

<div class="flex items-center justify-between gap-4 mb-3">
  <div class="flex items-center gap-2">
    <img
      src="${mandante.escudo}"
      class="w-10 h-10"
      alt="${mandante.nome}"
      onerror="this.onerror=null;this.src='https://cdn-icons-png.freepik.com/512/786/786346.png';"
    >
    <strong>${mandante.nome}</strong>
  </div>

  <span class="font-bold text-text-secondary">VS</span>

  <div class="flex items-center gap-2">
    <strong>${visitante.nome}</strong>
    <img
      src="${visitante.escudo}"
      class="w-10 h-10"
      alt="${visitante.nome}"
      onerror="this.onerror=null;this.src='https://cdn-icons-png.freepik.com/512/786/786346.png';"
    >
  </div>
</div>


        <div class="flex items-center justify-between text-sm text-text-secondary">
          <div class="flex items-center gap-2">
            ${iconClock()}
            <span>${jogo.horario}</span>
          </div>

          <div class="flex items-center gap-2">
            ${iconStadium()}
            <span>${jogo.estadio}</span>
          </div>

          <div class="flex items-center gap-2">
            ${iconTV()}
            <span>${jogo.transmissao}</span>
          </div>
        </div>

      </div>
    </article>
  `;
}
function horarioParaMinutos(horario) {
    const [h, m] = horario.split(":").map(Number);
    return h * 60 + m;
}

function diferencaMinutos(h1, h2) {
    return Math.abs(h1 - h2);
}
function mostrarAvisoFlutuante(card, mensagem) {
    // remove aviso anterior se existir
    const existente = card.querySelector(".aviso-flutuante");
    if (existente) existente.remove();

    const aviso = document.createElement("div");
    aviso.className = "aviso-flutuante";
    aviso.textContent = mensagem;

    card.style.position = "relative";
    card.appendChild(aviso);

    // animação de entrada
    requestAnimationFrame(() => {
        aviso.classList.add("ativo");
    });

    // remover automaticamente
    setTimeout(() => {
        aviso.classList.remove("ativo");
        setTimeout(() => aviso.remove(), 200);
    }, 2500);
}

function ativarSelecaoJogos() {
    daysContainer.addEventListener("click", (e) => {
        const card = e.target.closest(".card-jogo");
        if (!card) return;

        const checkbox = card.querySelector(".jogo-checkbox");

        // Se estiver tentando DESMARCAR, libera sempre
        if (checkbox.checked) {
            checkbox.checked = false;
            atualizarEstadoCard(card, false);
            removerJogoSelecionado(card);
            return;
        }

        const dataAtual = card.dataset.data;
        const horarioAtual = horarioParaMinutos(card.dataset.horario);

        // Busca jogos já selecionados no mesmo dia
        const selecionados = document.querySelectorAll(
            `.card-jogo.selecionado[data-data="${dataAtual}"]`
        );

        for (const outro of selecionados) {
            const horarioOutro = horarioParaMinutos(outro.dataset.horario);

            if (diferencaMinutos(horarioAtual, horarioOutro) < 105) {
                mostrarAvisoFlutuante(
                    card,
                    "Jogos no mesmo dia precisam ter pelo menos 105 minutos de diferença"
                );
                return;
            }

        }

        // Se passou na validação → marca
        checkbox.checked = true;
        atualizarEstadoCard(card, true);
        adicionarJogoSelecionado(card);
        atualizarBotaoFinalizar();
    });
}

function restaurarSelecao() {
    Object.values(jogosSelecionados).flat().forEach(jogo => {
        const card = document.querySelector(
            `.card-jogo[data-jogo-id="${jogo.id}"]`
        );
        if (!card) return;

        const checkbox = card.querySelector(".jogo-checkbox");
        checkbox.checked = true;
        atualizarEstadoCard(card, true);
    });
}

function atualizarEstadoCard(card, ativo) {
    card.classList.toggle("selecionado", ativo);
}

function renderBotoesMes() {
    const container = document.createElement("div");
    container.className = "flex justify-center gap-4 my-10";

    const btnProximo = document.createElement("button");
    btnProximo.className = "btn-meses";
    btnProximo.textContent = `Ver ${nomeMes(mesAtual + 1)}`;

    btnProximo.onclick = () => {
        mesAtual++;
        renderizarMes(mesAtual);
    };

    container.appendChild(btnProximo);
    daysContainer.appendChild(container);
}
document.addEventListener("click", (e) => {
    if (e.target.id === "finalizarBtn") {
        window.location.href = "../pages/selecionados.html";
    }
});

/* ===============================
   RENDER SCROLL DE DIAS
================================ */

function renderizarMes(mes) {
    if (mesesRenderizados.has(mes)) return;

    const jogosPorData = agruparJogosPorData(mes);
    const datas = Object.keys(jogosPorData).sort();

    mesesRenderizados.add(mes);

    // Wrapper do mês
    const wrapperMes = document.createElement("div");
    wrapperMes.className = "space-y-6";

    // ❌ Mês sem jogos
    if (datas.length === 0) {
        wrapperMes.innerHTML = `
      <div class="text-center py-20 text-text-secondary">
        <h3 class="text-xl font-heading font-bold mb-2 capitalize">
          ${nomeMes(mes)}
        </h3>
        <p>Jogos ainda não disponíveis</p>
      </div>
    `;
    } else {
        datas.forEach(data => {
            const dateObj = parseDate(data);

            const section = document.createElement("section");
            section.className = "space-y-4";

            section.innerHTML = `
        <header class="flex items-center justify-between">
          <h3 class="text-2xl font-heading font-bold text-primary mt-6" style="margin-top: 20px">
            ${formatDateBR(dateObj)}
          </h3>
          <span class="text-sm text-text-secondary capitalize">
            ${formatWeekDay(dateObj)}
          </span>
        </header>

        <div class="space-y-4">
          ${jogosPorData[data]
                    .map(({ campeonato, jogo }) => criarCard(campeonato, jogo))
                    .join("")}
        </div>
      `;

            wrapperMes.appendChild(section);
            daysContainer.appendChild(wrapperMes);


        });
    }

    // 🔘 Botão do próximo mês (exclusivo deste mês)
    const btnContainer = document.createElement("div");
    btnContainer.className = "flex justify-center my-10";

    const btn = document.createElement("button");
    btn.className = "btn-meses";
    btn.textContent = `Ver ${nomeMes(mes + 1)}`;

    btn.onclick = () => {
        btn.remove();              // remove o botão atual
        renderizarMes(mes + 1);    // renderiza o próximo mês
    };

    btnContainer.appendChild(btn);
    wrapperMes.appendChild(btnContainer);

    daysContainer.appendChild(wrapperMes);
    restaurarSelecao();

}
function updateFollowCount() {
    const count = totalJogosSelecionados();
    const countElement = document.getElementById("followCount");
    const btn = document.getElementById("favoritesBtn");

    if (!countElement || !btn) return;

    countElement.textContent = count;

    btn.classList.toggle("hidden", count === 0);
}

document.addEventListener("click", (e) => {
    if (e.target.closest("#favoritesBtn")) {
        const total = totalJogosSelecionados();

        if (total > 0) {
            window.location.href = "../pages/selecionados.html";
        }
    }
});



export function iniciarAgendaMensal() {
    ativarSelecaoJogos();
    renderizarMes(mesAtual);
    atualizarPreviewJSON();
    updateFollowCount();

}

