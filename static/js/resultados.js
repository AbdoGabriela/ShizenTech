const abrirZerar = document.getElementById("abrir-zerar");
const formZerar = document.getElementById("form-zerar");
const erroZerar = document.getElementById("erro-zerar");

function fecharZerar() {
  formZerar.hidden = true;
  abrirZerar.hidden = false;
  erroZerar.hidden = true;
  formZerar.reset();
}

abrirZerar.addEventListener("click", () => {
  abrirZerar.hidden = true;
  formZerar.hidden = false;
  document.getElementById("senha-zerar").focus();
});
document.getElementById("cancelar-zerar").addEventListener("click", fecharZerar);

formZerar.addEventListener("submit", (e) => {
  e.preventDefault();
  fetch("/api/zerar", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ senha: document.getElementById("senha-zerar").value }),
  })
    .then((r) => r.json().then((d) => ({ ok: r.ok, d })))
    .then(({ ok, d }) => {
      if (!ok) {
        erroZerar.textContent = d.erro || "Não foi possível zerar.";
        erroZerar.hidden = false;
        return;
      }
      fecharZerar();
      carregar();
    })
    .catch(() => {
      erroZerar.textContent = "Não foi possível falar com o servidor.";
      erroZerar.hidden = false;
    });
});

// Sem respostas (ou sem banco), as páginas continuam abertas: só os números ficam zerados.
const SEM_RESPOSTAS = {
  total: 0, media_total: "–", titulo: "Ainda não há respostas",
  mensagem: "Comece pelo seu termômetro. Enquanto isso, o jardim e os links já estão abertos.",
  contagem: [0, 0, 0], rotulos: [], medias: [],
};
let graficosAtuais = [];
let slidesIniciados = false;

function carregar() {
  fetch("/api/resultados")
    .then((r) => r.json())
    .then((d) => mostrar(d && d.total ? d : SEM_RESPOSTAS))
    .catch(() => mostrar(SEM_RESPOSTAS));
}

function mostrar(d) {
    if (slidesIniciados) { location.reload(); return; }
    document.getElementById("vazio").hidden = true;
    const conteudo = document.getElementById("conteudo");
    conteudo.hidden = false;
    document.getElementById("media").textContent = d.media_total;
    document.getElementById("total").textContent = d.total;
    document.getElementById("titulo").textContent = d.titulo;
    document.getElementById("mensagem").textContent = d.mensagem;

    Chart.defaults.color = "#e8efe9";
    Chart.defaults.font.family = "'Nunito Sans', sans-serif";

    const graficos = [
      new Chart(document.getElementById("grafico-faixas"), {
        type: "doughnut",
        data: {
          labels: ["Em equilíbrio (48 a 60)", "Pedindo atenção (30 a 47)", "Precisando de cuidado (abaixo de 30)"],
          datasets: [{ data: d.contagem, backgroundColor: ["#8fd6b4", "#e0a24a", "#c0728a"], borderColor: "#07110d" }],
        },
        options: { maintainAspectRatio: false, plugins: { legend: { position: "bottom" } } },
      }),
      new Chart(document.getElementById("grafico-perguntas"), {
        type: "bar",
        data: {
          labels: d.rotulos,
          datasets: [{ data: d.medias, backgroundColor: "#8fd6b4", borderRadius: 6 }],
        },
        options: {
          maintainAspectRatio: false,
          indexAxis: "y",
          plugins: { legend: { display: false } },
          scales: { x: { min: 0, max: 10 } },
        },
      }),
    ];

    graficosAtuais = graficos;
    slidesIniciados = true;
    const slides = iniciarSlides(conteudo, () => graficos.forEach((g) => g.resize()));
    const irParaLinks = () => { if (location.hash === "#links-importantes") slides.ir(Infinity); };
    irParaLinks();
    window.addEventListener("hashchange", irParaLinks);
}

carregar();
