// Mostra um "slide" por vez dentro de um contêiner.
function iniciarSlides(raiz, aoMudar) {
  const slides = [...raiz.querySelectorAll(".slide")];
  const barra = raiz.querySelector(".progresso i");
  let atual = 0;

  function ir(i) {
    atual = Math.max(0, Math.min(i, slides.length - 1));
    slides.forEach((s, n) => s.classList.toggle("ativo", n === atual));
    raiz.classList.toggle("na-capa", slides[atual].classList.contains("capa"));
    raiz.classList.toggle("na-jardim", slides[atual].classList.contains("jardim"));
    raiz.classList.toggle("na-final", slides[atual].classList.contains("final"));
    if (barra) barra.style.width = (atual / (slides.length - 1)) * 100 + "%";
    const titulo = slides[atual].querySelector("h1, h2");
    if (titulo) {
      titulo.setAttribute("tabindex", "-1");
      titulo.focus({ preventScroll: true });
    }
    if (aoMudar) aoMudar(atual);
  }

  raiz.addEventListener("click", (e) => {
    const proximo = e.target.closest("[data-next]");
    if (proximo && !proximo.disabled) ir(atual + 1);
    if (e.target.closest("[data-prev]")) ir(atual - 1);
  });

  ir(0);
  return { ir, atual: () => atual };
}

// Formulário das perguntas: uma pergunta por tela.
document.addEventListener("DOMContentLoaded", () => {
  const form = document.querySelector("form[data-slides]");
  if (!form) return;

  const slides = [...form.querySelectorAll(".slide")];
  const respondida = (s) => !s.hasAttribute("data-pergunta") || !!s.querySelector("input:checked");

  function marcarBotoes() {
    slides.forEach((s) => {
      const botao = s.querySelector("[data-next], [type=submit]");
      if (botao && s.hasAttribute("data-pergunta")) botao.disabled = !respondida(s);
    });
  }

  const nav = iniciarSlides(form);
  marcarBotoes();

  form.addEventListener("change", (e) => {
    if (e.target.type !== "radio") return;
    marcarBotoes();
  });

  form.addEventListener("submit", (e) => {
    const pendente = slides.findIndex((s) => !respondida(s));
    if (pendente !== -1) {
      e.preventDefault();
      nav.ir(pendente);
    }
  });
});
