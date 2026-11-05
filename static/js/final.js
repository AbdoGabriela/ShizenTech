// Página final: bonsai florido grande e pétalas caindo.
(function () {
  const bon = document.getElementById("final-bonsai");
  const cvp = document.getElementById("final-petalas");
  if (!bon || !cvp || !window.criarBonsai) return;

  // Bonsai florido (o mesmo desenho do jardim, na fase "Florida")
  const g = bon.getContext("2d");
  g.imageSmoothingEnabled = false;
  g.drawImage(window.criarBonsai({ id: 21, p: 60 }), 0, 0);

  // Pétalas
  const cx = cvp.getContext("2d");
  const COR = ["#f28bb0", "#f6a5c2", "#ffd3e2", "#e86e9c"];
  const QUANT = 46, TAM = 4;
  let petalas = [], antes = 0;

  function ajustar() {
    cvp.width = Math.max(1, cvp.clientWidth);
    cvp.height = Math.max(1, cvp.clientHeight);
  }
  function nova(inicio) {
    const rb = bon.getBoundingClientRect(), rc = cvp.getBoundingClientRect();
    const doBonsai = Math.random() < 0.7;
    const x = doBonsai ? rb.left - rc.left + rb.width * (0.1 + Math.random() * 0.8) : Math.random() * cvp.width;
    const y = doBonsai ? rb.top - rc.top + rb.height * (0.05 + Math.random() * 0.4) : -TAM * 2;
    return {
      x, y: inicio ? Math.random() * cvp.height : y,
      vy: 22 + Math.random() * 26, amp: 8 + Math.random() * 18, freq: 0.8 + Math.random() * 1.2,
      fase: Math.random() * 6.28, cor: COR[Math.floor(Math.random() * COR.length)], x0: x,
    };
  }
  function quadro(agora) {
    requestAnimationFrame(quadro);
    if (cvp.offsetParent === null) { antes = 0; return; }
    if (cvp.width !== cvp.clientWidth || cvp.height !== cvp.clientHeight) ajustar();
    if (!petalas.length) petalas = Array.from({ length: QUANT }, () => nova(true));
    const dt = antes ? Math.min(0.05, (agora - antes) / 1000) : 0;
    antes = agora;
    cx.clearRect(0, 0, cvp.width, cvp.height);
    petalas.forEach((p, i) => {
      p.y += p.vy * dt;
      p.fase += p.freq * dt;
      const x = Math.round((p.x0 + Math.sin(p.fase) * p.amp) / TAM) * TAM, y = Math.round(p.y / TAM) * TAM;
      cx.fillStyle = p.cor;
      cx.fillRect(x, y, TAM * 2, TAM);
      cx.fillStyle = "#ffe7ef";
      cx.fillRect(x, y, TAM, TAM);
      if (p.y > cvp.height + TAM) petalas[i] = nova(false);
    });
  }
  ajustar();
  requestAnimationFrame(quadro);
})();
