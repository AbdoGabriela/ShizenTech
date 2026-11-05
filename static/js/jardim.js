// Jardim zen em pixel art da tela "Jardim de todos": um bonsai para cada resposta.
(function () {
  if (!document.getElementById("jardim-canvas")) return;
  const W = 192, H = 120, HOR = 60, S = 30;
  const cv = document.getElementById("jardim-canvas"), cx = cv.getContext("2d");
  const rnd = (s) => () => { s |= 0; s = (s + 0x6D2B79F5) | 0; let t = Math.imul(s ^ (s >>> 15), 1 | s);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t; return ((t ^ (t >>> 14)) >>> 0) / 4294967296; };
  const faixa = (p) => (p >= 48 ? "florida" : p >= 30 ? "verde" : "outono");
  const NOME = { outono: "Outono", verde: "Verde", florida: "Florida" };
  const PAL = {
    outono: { a: "#b8501f", b: "#d9772b", c: "#f0c36e" },
    verde: { a: "#2a6b45", b: "#3f9a63", c: "#7cc48f" },
    florida: { a: "#24593a", b: "#36865a", c: "#5fae7f" },
  };
  const FL = ["#ee7fa8", "#f27aa6", "#f59bbb", "#ee7fa8", "#f7b8d0", "#ffe3ec"];
  const VASOS = [["#3d5a73", "#6f93ad"], ["#7a4a35", "#a86f4f"], ["#5a6b5c", "#8aa28c"]];

  const px = (g, x, y, col) => { g.fillStyle = col; g.fillRect(x, y, 1, 1); };
  function elipse(g, cx0, cy0, rx, ry, col) {
    for (let y = Math.floor(cy0 - ry); y <= Math.ceil(cy0 + ry); y++)
      for (let x = Math.floor(cx0 - rx); x <= Math.ceil(cx0 + rx); x++)
        if (((x + .5 - cx0) / rx) ** 2 + ((y + .5 - cy0) / ry) ** 2 <= 1) px(g, x, y, col);
  }
  function linha(g, x0, y0, x1, y1, col, esp) {
    const n = Math.max(Math.abs(x1 - x0), Math.abs(y1 - y0), 1);
    for (let i = 0; i <= n; i++) {
      const x = Math.round(x0 + (x1 - x0) * i / n), y = Math.round(y0 + (y1 - y0) * i / n);
      for (let k = 0; k < esp; k++) px(g, x + k, y, col);
    }
  }

  // Terreno: musgo, caminho de cascalho rastelado, lago com ponte, pedras e bambu
  const caminhoX = (y) => 100 + 5 * Math.sin((y - HOR) / 13);
  const caminhoL = (y) => 6 + (y - HOR) * 0.22;
  const lago = { x: 156, y: 96, rx: 24, ry: 6 };
  const fundo = document.createElement("canvas"); fundo.width = W; fundo.height = H;
  (function cenario() {
    const g = fundo.getContext("2d"), r = rnd(5);
    ["#d6e4dc", "#c9ddd4", "#bcd3c9", "#aecabf", "#a0c0b6", "#92b5aa"].forEach((c, i) => { g.fillStyle = c; g.fillRect(0, i * 10, W, 10); });
    for (let y = -8; y <= 8; y++) for (let x = -8; x <= 8; x++) { const d = x * x + y * y; if (d <= 64) px(g, 150 + x, 20 + y, d <= 36 ? "#fbf4d6" : "#efe8c4"); }
    [["#a5c0b8", 38, 9, 17, 0.6], ["#86a8a0", 46, 7, 11, 1.9], ["#6a928b", 52, 5, 8, 3.1]].forEach(([c, base, amp, per, fase]) => {
      for (let x = 0; x < W; x++) {
        const h = base - Math.floor(amp * (0.6 * Math.sin(x / per + fase) + 0.4 * Math.sin(x / (per * 0.45) + fase * 2)));
        g.fillStyle = c; g.fillRect(x, h, 1, HOR - h);
      }
    });
    g.fillStyle = "rgba(255,255,255,.28)"; g.fillRect(0, 48, W, 3); g.fillRect(0, 55, W, 5);
    [[4, 14], [9, 6], [14, 18]].forEach(([x, topo]) => {
      for (let y = topo; y < HOR + 26; y++) {
        const no = (y - topo) % 9 === 0;
        px(g, x, y, no ? "#7fb069" : "#4f8a3f"); px(g, x + 1, y, no ? "#8fc27a" : "#6aa656");
      }
      for (let k = 0; k < 6; k++) { px(g, x - 1 - (k % 3), topo + 4 + k * 7, "#4f8a3f"); px(g, x + 2 + (k % 3), topo + 6 + k * 7, "#6aa656"); }
    });
    g.fillStyle = "#557f3b"; g.fillRect(0, HOR, W, H - HOR);
    for (let y = HOR; y < H; y++) for (let x = 0; x < W; x++) { const v = r(); if (v < .12) px(g, x, y, "#628f46"); else if (v < .2) px(g, x, y, "#46702f"); else if (v < .215) px(g, x, y, "#7bab52"); }
    for (let y = HOR; y < H; y++) {
      const c = caminhoX(y), w = caminhoL(y);
      for (let x = Math.floor(c - w / 2 - 1); x <= Math.ceil(c + w / 2 + 1); x++) {
        const ad = Math.abs(x - c);
        if (ad <= w / 2) px(g, x, y, Math.round(ad) % 3 === 0 ? "#cdcbbd" : "#e4e2d6");
        else if (ad <= w / 2 + 1) px(g, x, y, "#9a9a8c");
      }
    }
    const pedra = (x, y, rx, ry) => { elipse(g, x, y, rx, ry, "#7c847f"); elipse(g, x - 1, y - 1, rx * .6, ry * .5, "#9aa39e"); elipse(g, x, y - ry * .7, rx * .7, ry * .35, "#628f46"); };
    pedra(14, 108, 7, 4.5); pedra(26, 113, 5, 3.5); pedra(8, 115, 4, 3);
    for (let y = -lago.ry - 1; y <= lago.ry + 1; y++) for (let x = -lago.rx - 1; x <= lago.rx + 1; x++) {
      const d = (x / lago.rx) ** 2 + (y / lago.ry) ** 2;
      if (d <= 1) px(g, lago.x + x, lago.y + y, y < -2 ? "#8cc0be" : "#6fa7a8");
      else if (d <= 1.3) px(g, lago.x + x, lago.y + y, "#8a8f8c");
    }
    for (let x = 140; x <= 172; x++) for (let y = 93; y <= 96; y++) px(g, x, y, x % 3 === 0 ? "#6b4328" : "#8a5a3a");
    for (let x = 140; x <= 172; x++) px(g, x, 91, "#6b4328");
    [140, 172].forEach((x) => { px(g, x, 92, "#4a3426"); px(g, x, 97, "#4a3426"); });
    px(g, 145, 100, "#9fd18f"); px(g, 146, 100, "#9fd18f"); px(g, 146, 99, "#f4c6d7"); px(g, 168, 101, "#9fd18f"); px(g, 169, 101, "#9fd18f");
  })();

  // Lugares para os bonsais (embaralhados, sempre na mesma ordem), longe do caminho, do lago e das pedras
  const lugares = [];
  const naCasa = (x, y) => x > 62 && x < 146 && y < 108;
  [66, 74, 82, 90, 98, 106, 114].forEach((y, linhaN) => {
    for (let x = linhaN % 2 ? 33 : 22; x <= 178; x += 22) {
      if (Math.abs(x - caminhoX(y - 6)) < caminhoL(y - 6) / 2 + 13) continue;
      if (((x - lago.x) / (lago.rx + 14)) ** 2 + ((y - lago.y) / (lago.ry + 10)) ** 2 < 1) continue;
      if (x < 36 && y > 102) continue;
      if (y > 104 && Math.abs(x - lago.x) < 38) continue; // deixa a água do lago à vista
      if (naCasa(x, y)) continue;
      lugares.push({ x, y });
    }
  });
  (function embaralhar() { const r = rnd(11); for (let i = lugares.length - 1; i > 0; i--) { const j = Math.floor(r() * (i + 1)); [lugares[i], lugares[j]] = [lugares[j], lugares[i]]; } })();

  // Bonsai: vaso, tronco torto e três copas achatadas, como no logo
  function copa(g, x, y, rx, ry, pal, flor, r) {
    elipse(g, x, y, rx, ry, pal.a);
    elipse(g, x - .5, y - .8, rx * .82, ry * .7, pal.b);
    elipse(g, x - rx * .25, y - ry * .55, rx * .4, ry * .3, pal.c);
    if (flor) for (let k = 0; k < 24; k++) {
      const a = r() * 6.283, d = Math.sqrt(r()), bx = Math.round(x + Math.cos(a) * rx * .85 * d), by = Math.round(y + Math.sin(a) * ry * .85 * d), c = FL[Math.floor(r() * FL.length)];
      px(g, bx, by, c); px(g, bx + 1, by, c); if (k % 3 === 0) px(g, bx, by + 1, c);
    }
  }
  function bonsai(t) {
    const s = document.createElement("canvas"); s.width = S; s.height = S;
    const g = s.getContext("2d"), r = rnd(t.id * 977 + 13), f = faixa(t.p), pal = PAL[f];
    const v = VASOS[Math.floor(r() * VASOS.length)], L = Math.floor(r() * 3) - 1, tr = "#4a3426";
    elipse(g, 15, 28.2, 11, 1.8, "rgba(0,0,0,.25)");
    for (let x = 7; x <= 22; x++) px(g, x, 24, v[1]);
    for (let y = 25; y <= 27; y++) for (let x = y === 27 ? 10 : 9; x <= (y === 27 ? 19 : 20); x++) px(g, x, y, v[0]);
    for (let x = 10; x <= 19; x++) px(g, x, 23, "#4f7a3a");
    for (let x = 13; x <= 16; x++) px(g, x, 22, "#628f46");
    linha(g, 15, 22, 14 + L, 16, tr, 3); linha(g, 14 + L, 16, 16 + L, 11, tr, 2); linha(g, 16 + L, 11, 15 + L, 7, tr, 2);
    linha(g, 15 + L, 15, 8, 12, tr, 2); linha(g, 16 + L, 13, 22, 11, tr, 2);
    const flor = f === "florida";
    copa(g, 7, 11, 6.2, 3, pal, flor, r); copa(g, 23, 10, 6.2, 3, pal, flor, r); copa(g, 15 + L, 5.5, 8, 3.7, pal, flor, r);
    if (f === "outono") [3, 4, 5, 6, 24, 25, 26, 27].forEach((x, k) => { if (k % 2 === 0 || r() < .5) px(g, x, 25 + Math.floor(r() * 3), k % 2 ? pal.b : pal.c); });
    return s;
  }

  // ---------- Casinha de madeira e sala (desenhos em pixel art) ----------
  const R = (g, x, y, w, h, c) => { g.fillStyle = c; g.fillRect(x, y, w, h); };
  const criar = (w, h, fn) => { const s = document.createElement("canvas"); s.width = w; s.height = h; fn(s.getContext("2d")); return s; };
  const brilho = (spr) => criar(spr.width, spr.height, (g) => { g.drawImage(spr, 0, 0); g.globalCompositeOperation = "source-in"; g.fillStyle = "#d9fff0"; g.fillRect(0, 0, spr.width, spr.height); });
  const contorno = (spr, x, y) => [[-1, 0], [1, 0], [0, -1], [0, 1]].forEach(([dx, dy]) => cx.drawImage(spr, x + dx, y + dy));
  const el = (id) => document.getElementById(id);
  cx.imageSmoothingEnabled = false;
  const wrap = el("jardim-cena");

  function criarCasa() {
    return criar(52, 38, (g) => {
      for (let i = 0; i < 14; i++) {
        const meia = 4 + i * 1.75, x0 = Math.round(26 - meia), x1 = Math.round(26 + meia);
        R(g, x0, i, x1 - x0, 1, i % 3 === 2 ? "#55312a" : "#6b3f33"); px(g, x0, i, "#8a5645");
      }
      R(g, 22, 0, 8, 1, "#8a5645"); R(g, 0, 14, 52, 1, "#3a2420");
      R(g, 5, 15, 42, 21, "#b08558");
      for (let y = 18; y < 36; y += 4) R(g, 5, y, 42, 1, "#8e6a43");
      R(g, 5, 15, 2, 21, "#6b4a2e"); R(g, 45, 15, 2, 21, "#6b4a2e"); R(g, 5, 15, 42, 1, "#7a5638");
      R(g, 21, 22, 10, 14, "#5a3a24");
      for (let x = 23; x < 31; x += 3) R(g, x, 22, 1, 14, "#4a2f1d");
      R(g, 23, 24, 6, 3, "#cfe5e3"); R(g, 26, 24, 1, 3, "#4a3426"); px(g, 29, 30, "#e0c070");
      [[10, 22], [35, 22]].forEach(([x, y]) => {
        R(g, x, y, 8, 7, "#4a3426"); R(g, x + 1, y + 1, 6, 5, "#cfe5e3");
        R(g, x + 3, y + 1, 1, 5, "#4a3426"); R(g, x + 1, y + 3, 6, 1, "#4a3426");
      });
      R(g, 34, 30, 10, 2, "#4a3426");
      [35, 37, 39, 41, 43].forEach((x, k) => px(g, x, 29, k % 2 ? "#ee7fa8" : "#f7b8d0"));
      R(g, 19, 36, 14, 2, "#9aa39e"); R(g, 19, 36, 14, 1, "#c4cbc6");
    });
  }

  // ---------- Sala por dentro ----------
  function criarSala() {
    return criar(W, H, (g) => {
      R(g, 0, 0, W, 84, "#b98a5c");
      for (let x = 0; x < W; x += 8) { R(g, x, 0, 1, 84, "#a67b50"); R(g, x + 1, 0, 1, 84, "#cda072"); }
      R(g, 0, 78, W, 6, "#7a5638"); R(g, 0, 78, W, 1, "#a67b50");
      R(g, 0, 84, W, H - 84, "#8a5e3c");
      for (let y = 84, k = 0; y < H; y += 6, k++) {
        R(g, 0, y, W, 1, "#734c2f");
        for (let x = (k % 2) * 14; x < W; x += 28) R(g, x, y, 1, 6, "#734c2f");
      }
      R(g, 0, 84, W, 1, "#5e3f27");
      R(g, 10, 16, 36, 40, "#4a3426");
      ["#c4dcd2", "#bcd3c9", "#aecabf", "#a0c0b6"].forEach((c, i) => R(g, 12, 18 + i * 9, 32, 9, c));
      for (let x = 12; x < 44; x++) { const h = 36 - Math.floor(5 * Math.sin(x / 5) + 3); R(g, x, h, 1, 54 - h, "#86a8a0"); }
      R(g, 12, 46, 32, 2, "rgba(255,255,255,.3)");
      R(g, 27, 18, 2, 36, "#4a3426"); R(g, 12, 35, 32, 2, "#4a3426");
      R(g, 8, 56, 40, 3, "#7a5638"); R(g, 8, 56, 40, 1, "#a67b50");
      R(g, 148, 28, 32, 56, "#4a3426"); R(g, 150, 30, 28, 52, "#f1ecdc");
      for (let x = 150; x <= 178; x += 7) R(g, x, 30, 1, 52, "#4a3426");
      for (let y = 30; y <= 82; y += 13) R(g, 150, y, 28, 1, "#4a3426");
      R(g, 153, 54, 2, 5, "#c9a24a");
      R(g, 34, 90, 118, 26, "#4a5f45"); R(g, 36, 92, 114, 22, "#7d9a68");
      for (let x = 36; x < 150; x += 19) R(g, x, 92, 1, 22, "#6f8b5b");
      R(g, 36, 103, 114, 1, "#6f8b5b");
      R(g, 80, 16, 36, 36, "rgba(0,0,0,.2)");
    });
  }

  function criarPessoa() {
    const base = criar(26, 30, (g) => {
      elipse(g, 13, 27.5, 12, 2.2, "rgba(0,0,0,.25)");
      elipse(g, 13, 25, 10, 3.2, "#a8566a"); elipse(g, 13, 24, 8.5, 2.2, "#c06a80");
      elipse(g, 13, 22, 11, 3.5, "#4a6b8a"); elipse(g, 13, 21.3, 9, 2.3, "#5d81a3");
    });
    const topo = criar(26, 30, (g) => {
      R(g, 8, 10, 10, 11, "#e8e4d8"); R(g, 8, 10, 10, 1, "#cfcabb");
      linha(g, 8, 11, 4, 20, "#e8e4d8", 2); linha(g, 17, 11, 21, 20, "#e8e4d8", 2);
      R(g, 3, 20, 3, 2, "#e0b48a"); R(g, 20, 20, 3, 2, "#e0b48a");
      elipse(g, 13, 6.5, 4, 4.2, "#e0b48a"); elipse(g, 13, 4, 4.2, 2.6, "#3a2a22"); elipse(g, 13, 1.5, 2, 1.6, "#3a2a22");
      R(g, 10, 7, 2, 1, "#4a3426"); R(g, 14, 7, 2, 1, "#4a3426"); R(g, 12, 9, 2, 1, "#b0705a");
    });
    const junto = criar(26, 30, (g) => { g.drawImage(base, 0, 0); g.drawImage(topo, 0, 0); });
    return { base, topo, glow: brilho(junto) };
  }

  function criarMesa() {
    return criar(40, 22, (g) => {
      R(g, 2, 8, 36, 3, "#7a5638"); R(g, 2, 8, 36, 1, "#a67b50");
      R(g, 5, 11, 2, 9, "#5a3a24"); R(g, 33, 11, 2, 9, "#5a3a24");
      elipse(g, 13, 5, 4.6, 3, "#2f5f4f"); elipse(g, 12, 4, 2.6, 1.4, "#4a8a72");
      R(g, 11, 1, 4, 1, "#244a3d"); px(g, 12, 0, "#244a3d"); linha(g, 8, 5, 5, 3, "#2f5f4f", 1);
      px(g, 18, 3, "#244a3d"); px(g, 19, 4, "#244a3d"); px(g, 19, 5, "#244a3d"); px(g, 18, 6, "#244a3d");
      [25, 31].forEach((x) => { R(g, x, 5, 5, 3, "#f1ecdc"); R(g, x, 5, 5, 1, "#c58b3a"); px(g, x + 5, 6, "#cfd8d4"); R(g, x - 1, 8, 7, 1, "#cfd8d4"); });
    });
  }

  function criarIncensario() {
    return criar(16, 16, (g) => {
      R(g, 2, 11, 12, 3, "#7a5638"); R(g, 2, 11, 12, 1, "#a67b50"); R(g, 3, 14, 2, 2, "#5a3a24"); R(g, 11, 14, 2, 2, "#5a3a24");
      elipse(g, 8, 9.5, 5, 2.5, "#8a6a2e"); elipse(g, 8, 8.5, 4, 1.5, "#c9a24a");
      linha(g, 6, 8, 5, 2, "#4a3426", 1); linha(g, 8, 8, 8, 1, "#4a3426", 1); linha(g, 10, 8, 11, 3, "#4a3426", 1);
      px(g, 5, 1, "#ff7a3a"); px(g, 8, 0, "#ffd27a"); px(g, 11, 2, "#ff7a3a");
    });
  }

  // ---------- Novos itens: yoga, cama, plantas e cantinho de desenho ----------
  function criarTapete() {
    return criar(14, 46, (g) => {
      elipse(g, 8, 44.5, 6, 1.4, "rgba(0,0,0,.28)");
      for (let y = 4; y <= 44; y++) {
        const ox = Math.round((44 - y) * 0.07), x0 = 2 + ox;
        R(g, x0, y, 10, 1, "#7a5fa8"); px(g, x0, y, "#5a4488"); px(g, x0 + 1, y, "#66508f");
        R(g, x0 + 3, y, 2, 1, "#a98bd6"); px(g, x0 + 9, y, "#5a4488");
      }
      [15, 31].forEach((y) => { const ox = Math.round((44 - y) * 0.07); R(g, 2 + ox, y, 10, 2, "#e8dcb8"); R(g, 2 + ox, y + 2, 10, 1, "#b8a878"); });
      const ox = Math.round(40 * 0.07);
      elipse(g, 7 + ox, 4, 5.2, 2.6, "#5a4488"); elipse(g, 7 + ox, 3.7, 4.6, 2.2, "#a98bd6");
      elipse(g, 7 + ox, 3.7, 3, 1.4, "#7a5fa8"); elipse(g, 7 + ox, 3.7, 1.5, .8, "#d8c6f2");
    });
  }

  function almofada(g, x, y, rx, ry, base, luz, sombra) {
    elipse(g, x, y + 1, rx, ry, sombra); elipse(g, x, y, rx, ry, base); elipse(g, x - rx * .25, y - ry * .35, rx * .55, ry * .45, luz);
  }
  function criarCama() {
    return criar(46, 30, (g) => {
      R(g, 1, 28, 44, 2, "rgba(0,0,0,.25)");
      R(g, 3, 24, 3, 5, "#5a3a24"); R(g, 40, 24, 3, 5, "#5a3a24");
      R(g, 0, 2, 5, 24, "#6b4328"); R(g, 0, 2, 5, 1, "#8a5a3a"); R(g, 1, 4, 1, 20, "#7a5230");
      R(g, 43, 12, 3, 14, "#6b4328"); R(g, 43, 12, 3, 1, "#8a5a3a");
      R(g, 5, 15, 38, 9, "#7a5638"); R(g, 5, 15, 38, 1, "#a67b50");
      R(g, 5, 9, 38, 7, "#f1ecdc"); R(g, 5, 9, 38, 1, "#ffffff");
      R(g, 14, 10, 29, 10, "#5d81a3"); R(g, 14, 10, 29, 2, "#7a9cbc");
      for (let x = 19; x < 43; x += 6) R(g, x, 12, 1, 8, "#4a6b8a");
      R(g, 14, 15, 29, 1, "#4a6b8a"); R(g, 14, 19, 29, 1, "#46637f");
      R(g, 14, 10, 2, 10, "#7a9cbc");
      almofada(g, 11, 6.5, 7.5, 4.4, "#f1ecdc", "#ffffff", "#cfcabb");
      almofada(g, 18.5, 5.2, 5.6, 3.7, "#f4c6d7", "#fde3ec", "#d79bb3");
      almofada(g, 7.5, 9.6, 4.2, 3.1, "#c9b8ee", "#e6dcf8", "#9d8ccc");
      px(g, 9, 5, "#cfcabb"); px(g, 15, 4, "#d79bb3");
    });
  }

  function folha(g, x, y, rx, ry, cores) {
    elipse(g, x, y, rx, ry, cores[0]); elipse(g, x - .5, y - ry * .25, rx * .7, ry * .6, cores[1]); px(g, Math.round(x - rx * .3), Math.round(y - ry * .5), cores[2]);
  }
  function criarPlantaChao() {
    return criar(26, 30, (g) => {
      elipse(g, 13, 28.6, 10, 1.4, "rgba(0,0,0,.28)");
      const C = ["#2a6b45", "#3f9a63", "#7cc48f"];
      linha(g, 13, 20, 13, 6, "#2a6b45", 1); linha(g, 13, 20, 7, 11, "#2a6b45", 1); linha(g, 13, 20, 19, 10, "#2a6b45", 1);
      folha(g, 13, 7, 3.4, 6, C); folha(g, 6.5, 11.5, 4.6, 3.2, C); folha(g, 19.5, 10.5, 4.6, 3.2, C);
      folha(g, 8, 16, 4, 2.6, C); folha(g, 18.5, 16, 4, 2.6, C);
      px(g, 13, 2, "#f28bb0"); px(g, 12, 3, "#f28bb0"); px(g, 14, 3, "#f28bb0"); px(g, 13, 3, "#ffe3ec");
      R(g, 6, 20, 14, 2, "#cf7d4a"); R(g, 6, 20, 14, 1, "#e0a070");
      for (let y = 22; y <= 28; y++) R(g, 7 + Math.floor((y - 22) / 3), y, 12 - 2 * Math.floor((y - 22) / 3), 1, y % 2 ? "#b8683a" : "#a85a30");
      R(g, 8, 22, 2, 5, "#cf7d4a");
    });
  }
  function criarPlantasJanela() {
    return criar(34, 12, (g) => {
      R(g, 2, 7, 7, 5, "#b8683a"); R(g, 1, 6, 9, 1, "#cf7d4a");
      elipse(g, 5.5, 4, 3.4, 2.6, "#2f7d4f"); elipse(g, 5, 3, 2, 1.4, "#7cc48f"); px(g, 3, 1, "#7cc48f"); px(g, 8, 1, "#3f9a63");
      R(g, 14, 7, 7, 5, "#e8e4d8"); R(g, 13, 6, 9, 1, "#ffffff");
      R(g, 16, 1, 3, 6, "#3f9a63"); px(g, 16, 1, "#7cc48f"); R(g, 13, 3, 3, 1, "#3f9a63"); R(g, 13, 2, 1, 2, "#3f9a63"); R(g, 19, 4, 3, 1, "#3f9a63"); R(g, 21, 3, 1, 2, "#3f9a63");
      px(g, 17, 0, "#f28bb0"); px(g, 21, 2, "#f28bb0");
      R(g, 26, 7, 7, 5, "#6f93ad"); R(g, 25, 6, 9, 1, "#8fb0c8");
      linha(g, 29, 6, 26, 1, "#3f9a63", 1); linha(g, 29, 6, 29, 0, "#57b37b", 1); linha(g, 29, 6, 32, 1, "#3f9a63", 1); px(g, 26, 0, "#7cc48f"); px(g, 32, 0, "#7cc48f");
    });
  }
  function criarCantoDesenho() {
    return criar(32, 40, (g) => {
      R(g, 8, 0, 14, 14, "#d8d2bf"); R(g, 9, 1, 12, 12, "#f1ecdc");
      R(g, 15, 5, 3, 3, "#f0c36e"); px(g, 14, 6, "#f0c36e"); px(g, 18, 6, "#f0c36e"); px(g, 16, 4, "#f0c36e");
      linha(g, 10, 11, 14, 8, "#6f93ad", 1); linha(g, 14, 8, 17, 11, "#6f93ad", 1); linha(g, 17, 11, 20, 9, "#86a8a0", 1);
      R(g, 11, 12, 9, 1, "#3f9a63"); px(g, 15, 0, "#c0392b"); px(g, 15, 1, "#e0584a");
      R(g, 24, 4, 6, 8, "#f1ecdc"); R(g, 24, 4, 6, 1, "#d8d2bf");
      [6, 8, 10].forEach((y) => R(g, 25, y, 4, 1, "#9aa39e")); px(g, 26, 3, "#c0392b");
      R(g, 0, 28, 32, 3, "#7a5638"); R(g, 0, 28, 32, 1, "#a67b50");
      R(g, 2, 31, 2, 9, "#5a3a24"); R(g, 28, 31, 2, 9, "#5a3a24");
      R(g, 6, 31, 20, 5, "#6b4a2e"); R(g, 6, 31, 20, 1, "#8a5a3a"); R(g, 15, 33, 2, 1, "#e0c070");
      R(g, 3, 25, 12, 3, "#f1ecdc"); R(g, 3, 25, 12, 1, "#ffffff"); R(g, 9, 25, 1, 3, "#b8b2a0");
      linha(g, 4, 26, 7, 26, "#6f93ad", 1); linha(g, 11, 26, 13, 26, "#9aa39e", 1);
      R(g, 17, 20, 5, 8, "#6f93ad"); R(g, 17, 20, 5, 1, "#8fb0c8");
      R(g, 17, 15, 1, 5, "#e0a24a"); R(g, 19, 14, 1, 6, "#ee7fa8"); R(g, 21, 16, 1, 4, "#3f9a63");
      R(g, 25, 24, 4, 4, "#22304a"); R(g, 26, 23, 2, 1, "#22304a"); R(g, 26, 25, 1, 1, "#4a6b9a");
      linha(g, 28, 23, 31, 18, "#f1ecdc", 1); px(g, 31, 18, "#cfd8d4");
    });
  }
  function zzz(t, x, y) {
    for (let k = 0; k < 3; k++) {
      const ph = ((t / 1000 + k) % 3) / 3, a = Math.sin(ph * Math.PI), zx = x + Math.round(ph * 12), zy = y - Math.round(ph * 14);
      cx.fillStyle = `rgba(230,255,245,${a.toFixed(2)})`;
      cx.fillRect(zx, zy, 3, 1); cx.fillRect(zx + 1, zy + 1, 1, 1); cx.fillRect(zx, zy + 2, 3, 1);
    }
  }

  // ---------- Gatinho, fotos de família e celular ----------
  function criarGato(f) {
    return criar(16, 10, (g) => {
      elipse(g, 9.5, 6.3 - f * .4, 6.8, 3.2 + f * .6, "#e0883a");
      elipse(g, 9.5, 7.8, 6, 1.5, "#c9702a");
      elipse(g, 9, 4.7 - f * .4, 4, 1.1, "#f0b070");
      [[8, 3], [11, 3], [13, 4]].forEach(([x, y]) => px(g, x, Math.round(y - f * .4), "#b8601f"));
      R(g, 14, 6, 2, 1, "#c9702a"); R(g, 15, 7, 1, 2, "#c9702a"); R(g, 12, 9, 4, 1, "#c9702a"); px(g, 11, 9, "#f1ecdc");
      elipse(g, 3.5, 6.4, 3.2, 2.6, "#e0883a");
      R(g, 1, 3, 2, 2, "#e0883a"); R(g, 5, 3, 2, 2, "#e0883a"); px(g, 2, 4, "#f28bb0"); px(g, 5, 4, "#f28bb0");
      px(g, 2, 6, "#4a3426"); px(g, 4, 6, "#4a3426"); px(g, 3, 7, "#f28bb0");
      R(g, 2, 9, 3, 1, "#f1ecdc");
    });
  }

  const gente = (g, x, yb, alt, roupa, cabelo) => {
    R(g, x, yb - alt, 3, alt, roupa); R(g, x, yb - alt - 3, 3, 3, "#e0b48a"); R(g, x, yb - alt - 3, 3, 1, cabelo);
  };
  const moldura = (g, x, y, w, h, fundo) => { R(g, x, y, w, h, "#4a3426"); R(g, x + 1, y + 1, w - 2, h - 2, "#f1ecdc"); R(g, x + 2, y + 2, w - 4, h - 4, fundo); };
  const coracao = (g, x, y, c, l) => { [[1, 0], [3, 0], [0, 1], [1, 1], [2, 1], [3, 1], [4, 1], [1, 2], [2, 2], [3, 2], [2, 3]].forEach(([dx, dy]) => px(g, x + dx, y + dy, c)); px(g, x + 1, y, l); };

  function criarFotosDir() {
    return criar(32, 34, (g) => {
      moldura(g, 0, 0, 16, 14, "#cfe3dc"); R(g, 2, 10, 12, 2, "#8fc27a");
      gente(g, 3, 11, 4, "#5d81a3", "#3a2a22"); gente(g, 7, 11, 2, "#f0c36e", "#6b4328"); gente(g, 11, 11, 4, "#c06a80", "#3a2a22");
      px(g, 6, 8, "#e0b48a"); px(g, 10, 8, "#e0b48a");
      moldura(g, 18, 2, 13, 17, "#f4d9c6");
      R(g, 21, 12, 4, 5, "#5d81a3"); R(g, 24, 12, 4, 5, "#c06a80"); R(g, 24, 13, 1, 1, "#e0b48a");
      R(g, 21, 9, 3, 3, "#e0b48a"); R(g, 21, 9, 3, 1, "#3a2a22"); R(g, 25, 9, 3, 3, "#e0b48a"); R(g, 25, 9, 3, 1, "#8a5a3a");
      coracao(g, 22, 5, "#c0392b", "#e0584a");
      moldura(g, 2, 19, 28, 14, "#f1e6c8"); R(g, 4, 29, 24, 2, "#d9c9a0");
      [[6, "#5d81a3", "#3a2a22"], [10, "#c06a80", "#6b4328"], [14, "#7cc48f", "#3a2a22"], [18, "#e0a24a", "#8a5a3a"], [22, "#9d8ccc", "#3a2a22"]]
        .forEach(([x, c, hc]) => gente(g, x, 29, 3, c, hc));
      [9, 13, 17, 21].forEach((x) => px(g, x, 27, "#e0b48a"));
    });
  }
  function criarFotosEsq() {
    return criar(27, 20, (g) => {
      moldura(g, 0, 0, 15, 19, "#e8e0d0");
      gente(g, 3, 15, 6, "#7a5fa8", "#d8d8d8"); gente(g, 8, 15, 6, "#4a6b8a", "#d8d8d8");
      px(g, 6, 11, "#e0b48a"); px(g, 7, 11, "#e0b48a");
      moldura(g, 17, 7, 10, 12, "#f4c6d7"); coracao(g, 19, 11, "#c0392b", "#e0584a");
    });
  }
  function criarCelular() {
    return criar(30, 24, (g) => {
      R(g, 1, 19, 28, 2, "#7a5638"); R(g, 1, 19, 28, 1, "#a67b50"); R(g, 4, 21, 2, 3, "#5a3a24"); R(g, 24, 21, 2, 3, "#5a3a24");
      elipse(g, 8, 12.5, 6.4, 6.4, "#c0392b"); elipse(g, 8, 12.5, 4.8, 4.8, "#f1ecdc");
      R(g, 7, 10, 3, 6, "#3a4a66"); R(g, 7, 10, 3, 1, "#5a6a86");
      linha(g, 4, 8, 12, 17, "#c0392b", 2);
      R(g, 19, 6, 8, 13, "#22304a"); R(g, 19, 6, 8, 1, "#3a4a66"); R(g, 20, 8, 6, 9, "#0b1220");
      px(g, 22, 7, "#4a5a76"); linha(g, 21, 9, 23, 11, "#16233a", 1); px(g, 22, 18, "#3a4a66");
    });
  }

  // O cartaz usa a imagem enviada, reduzida aos poucos para ficar com cara de pixel
  const foto = new Image();
  let reduzida = null;
  function reduzir(img, alvo) {
    let c = criar(256, 256, (g) => g.drawImage(img, 0, 0, 256, 256)), s = 256;
    while (s / 2 >= alvo) { const n = criar(s / 2, s / 2, (g) => g.drawImage(c, 0, 0, s / 2, s / 2)); s /= 2; c = n; }
    return c;
  }
  function criarCartaz() {
    return criar(36, 36, (g) => {
      R(g, 0, 0, 36, 36, "#4a3426"); R(g, 1, 1, 34, 34, "#7a5638");
      if (reduzida) g.drawImage(reduzida, 3, 3, 30, 30); else R(g, 3, 3, 30, 30, "#0e2a4a");
    });
  }

  const casaSpr = criarCasa(), casaGlow = brilho(casaSpr), salaBG = criarSala();
  const pessoa = criarPessoa(), mesaSpr = criarMesa(), mesaGlow = brilho(mesaSpr), incSpr = criarIncensario(), incGlow = brilho(incSpr);
  let cartazSpr = criarCartaz(), cartazGlow = brilho(cartazSpr);
  const matSpr = criarTapete(), matGlow = brilho(matSpr), camaSpr = criarCama(), camaGlow = brilho(camaSpr);
  const plantaSpr = criarPlantaChao(), plantaGlow = brilho(plantaSpr), janelaSpr = criarPlantasJanela(), janelaGlow = brilho(janelaSpr);
  const cantoSpr = criarCantoDesenho(), cantoGlow = brilho(cantoSpr);
  const gatoA = criarGato(0), gatoB = criarGato(1), gatoGlow = brilho(gatoA);
  const fotosDirSpr = criarFotosDir(), fotosDirGlow = brilho(fotosDirSpr), fotosEsqSpr = criarFotosEsq(), fotosEsqGlow = brilho(fotosEsqSpr);
  const celSpr = criarCelular(), celGlow = brilho(celSpr);
  foto.onload = () => { reduzida = reduzir(foto, 30); cartazSpr = criarCartaz(); cartazGlow = brilho(cartazSpr); };
  foto.src = wrap.dataset.cartaz;

  // ---------- Fumaça e vapor ----------
  function fumaca(agora, x, y, n, alto) {
    for (let k = 0; k < n; k++) {
      const idade = (agora / 70 + k * (alto / n)) % alto, a = Math.max(0, 1 - idade / alto) * 0.6;
      cx.fillStyle = `rgba(240,240,236,${a.toFixed(2)})`;
      cx.fillRect(x + Math.round(Math.sin(idade / 4 + k * 1.7) * (1 + idade / 14)), y - Math.floor(idade), 1, 1);
    }
  }


  // ---------- Cenas: jardim e sala da casinha ----------
  const arvores = [];
  const anim = { id: 0, t0: 0 };
  let extras = 900000;
  const DICA = "Cada bonsai é uma resposta. O outono é uma estação, não uma nota ruim.";
  const TXT_SALA = "Passe o mouse sobre as coisas da sala e clique nelas para cuidar do seu bonsai. Clique na porta para sair.";
  const elInfo = el("jardim-info");
  let aviso = DICA;
  const mostrar = (txt) => { elInfo.textContent = txt; };
  const info = (txt) => { aviso = txt; mostrar(txt); };

  const slide = cv.closest(".slide"), dica = el("jardim-dica"), modal = el("jardim-modal"), btnCasa = el("j-casa");
  let cena = "jardim", fade = null, hover = null;
  const ir = (para) => { if (fade) return; fade = { t0: performance.now(), fase: "sai", para }; hover = null; dica.hidden = true; fx.length = 0; comida.length = 0; ondas.length = 0; };
  const abrirCartaz = () => { modal.hidden = false; el("jardim-modal-fechar").focus(); };

  // ---------- Carinho no gato e regador nas plantas ----------
  const fx = [];
  let gatoT = -9999;
  const coracaoSpr = criar(5, 5, (g) => {
    ["01010", "11111", "11111", "01110", "00100"].forEach((l, y) => [...l].forEach((c, x) => { if (c === "1") px(g, x, y, "#f28bb0"); }));
    px(g, 1, 1, "#ffd3e2");
  });
  // Cursor de regador em pixel art (16x16 ampliado para 32x32; a ponta do bico é o ponto de clique)
  const cursorRegador = (() => {
    const pq = criar(16, 16, (g) => {
      R(g, 5, 6, 8, 7, "#5b8fb9"); R(g, 5, 6, 8, 1, "#8dbbdc"); R(g, 5, 12, 8, 1, "#3e6d92");
      R(g, 13, 7, 2, 1, "#27475f"); R(g, 14, 8, 1, 3, "#27475f"); R(g, 13, 11, 2, 1, "#27475f");
      px(g, 4, 8, "#3e6d92"); px(g, 3, 7, "#3e6d92"); px(g, 2, 6, "#3e6d92"); R(g, 1, 4, 2, 3, "#8dbbdc");
      R(g, 6, 5, 6, 1, "#27475f"); R(g, 4, 6, 1, 1, "#27475f"); R(g, 4, 13, 10, 1, "#27475f");
    });
    const gr = criar(32, 32, (g) => { g.imageSmoothingEnabled = false; g.drawImage(pq, 0, 0, 32, 32); });
    return `url(${gr.toDataURL()}) 4 8, pointer`;
  })();
  const brilhar = (a, n) => {
    const t0 = performance.now();
    for (let i = 0; i < n; i++) {
      fx.push({ tipo: "brilho", x: a.x + 2 + Math.random() * Math.max(1, a.w - 4), y: a.y + 2 + Math.random() * Math.max(1, a.h - 4),
        t0: t0 + Math.random() * 260, vida: 650 });
    }
  };
  const fazerCarinho = (a) => {
    const t0 = performance.now();
    gatoT = t0;
    [[24, 0], [29, 160], [34, 320]].forEach(([dx, atraso]) => fx.push({ tipo: "coracao", x: dx, y: 60, t0: t0 + atraso, vida: 1500 }));
    a.msg = "Ronrom... ele gostou do carinho."; a.msgAte = t0 + 2200;
  };
  const regar = (a) => {
    const t0 = performance.now();
    for (let i = 0; i < 14; i++) {
      fx.push({ tipo: "gota", x: a.x + 3 + Math.floor(Math.random() * (a.w - 6)), y: a.y - 6, queda: Math.max(10, a.h * 0.75),
        t0: t0 + Math.random() * 600, vida: 650 });
    }
    a.msg = "Regadinha feita. As folhas agradecem."; a.msgAte = t0 + 2200;
  };
  function desenharFx(t) {
    for (let i = fx.length - 1; i >= 0; i--) {
      const f = fx[i], d = t - f.t0;
      if (d > f.vida) { fx.splice(i, 1); continue; }
      if (d < 0) continue;
      const k = d / f.vida;
      if (f.tipo === "brilho") {
        const r = k < 0.5 ? 1 : 0, a = k < 0.15 ? k / 0.15 : 1 - (k - 0.15) / 0.85, x = Math.round(f.x), y = Math.round(f.y);
        cx.globalAlpha = Math.max(0, a);
        px(cx, x, y, "#fffbe0");
        if (r) { px(cx, x - 1, y, "#ffe9a8"); px(cx, x + 1, y, "#ffe9a8"); px(cx, x, y - 1, "#ffe9a8"); px(cx, x, y + 1, "#ffe9a8"); }
        cx.globalAlpha = 1;
      } else if (f.tipo === "coracao") {
        cx.globalAlpha = Math.min(1, (1 - k) * 2);
        cx.drawImage(coracaoSpr, Math.round(f.x + Math.sin(k * 7) * 2), Math.round(f.y - k * 16));
        cx.globalAlpha = 1;
      } else if (k < 0.85) {
        const y = Math.round(f.y + f.queda * k * k * 1.2 / 0.85);
        R(cx, f.x, y, 1, 2, "#7fd0f2"); px(cx, f.x, y, "#e4f8ff");
      } else {
        const y = Math.round(f.y + f.queda * 0.85 * 1.2), a = (1 - k) / 0.15;
        cx.globalAlpha = a; px(cx, f.x - 1, y + 1, "#7fd0f2"); px(cx, f.x + 1, y + 1, "#7fd0f2"); px(cx, f.x, y, "#e4f8ff"); cx.globalAlpha = 1;
      }
    }
  }

  // ---------- Bonsai da última resposta, dentro da sala ----------
  // Cada clique nas coisas da sala ajuda o bonsai a se recuperar, até ele ficar florido.
  let meu = null;
  const PASSO = 4, ALVO = 52;
  const ajustarMeu = (p) => { meu.p = p; meu.spr = bonsai(meu); meu.glow = brilho(meu.spr); };
  fetch("/api/respostas-recentes?limite=1")
    .then((r) => r.json())
    .then((d) => {
      const a = d.respostas && d.respostas[0];
      if (!a) return;
      meu = { id: a.id, p0: a.pontos, p: a.pontos };
      ajustarMeu(a.pontos);
    })
    .catch(() => {});
  // Devolve uma mensagem quando o bonsai muda de fase
  function cuidar() {
    if (!meu || meu.p >= ALVO) return null;
    const antes = faixa(meu.p);
    ajustarMeu(Math.min(ALVO, meu.p + PASSO));
    const depois = faixa(meu.p);
    if (depois === antes) return null;
    return depois === "florida" ? "Seu bonsai floresceu." : "Seu bonsai está se recuperando.";
  }

  // ---------- Peixes do lago e ração (brincadeira, não conta na pontuação) ----------
  const LAGO = { x1: 138, x2: 174, y1: 98, y2: 100 };
  const peixes = [
    { x: 148, y: 99, dir: 1, vel: 5, fase: 0 },
    { x: 164, y: 100, dir: -1, vel: 4, fase: 2 },
    { x: 156, y: 98, dir: 1, vel: 3, fase: 4 },
  ];
  const comida = [], ondas = [];
  let ultimoPeixe = 0;
  const darComida = (a) => {
    const t0 = performance.now();
    for (let i = 0; i < 6; i++) {
      comida.push({ x: 141 + Math.floor(Math.random() * 30), y: 82, yAlvo: 98 + Math.floor(Math.random() * 3), t0: t0 + i * 140, pouso: 0 });
    }
    a.msg = "Plim, plim. Os peixinhos adoraram a comidinha."; a.msgAte = t0 + 2600;
  };
  function desenharPeixes(t) {
    const dt = ultimoPeixe ? Math.min(0.05, (t - ultimoPeixe) / 1000) : 0;
    ultimoPeixe = t;
    peixes.forEach((f) => {
      const alvo = comida.find((c) => c.pouso && !c.comida && Math.abs(c.x - f.x) < 24) || comida.filter((c) => c.pouso && !c.comida).sort((a, b) => Math.abs(a.x - f.x) - Math.abs(b.x - f.x))[0];
      if (alvo) {
        f.dir = alvo.x >= f.x ? 1 : -1;
        f.x += f.dir * 16 * dt;
        f.y += Math.sign(alvo.yAlvo - f.y) * 6 * dt;
        if (Math.abs(alvo.x - f.x) < 2 && Math.abs(alvo.yAlvo - f.y) < 2.5) { alvo.comida = true; ondas.push({ x: alvo.x, y: alvo.yAlvo, t0: t }); }
      } else {
        f.x += f.dir * f.vel * dt;
        f.y = Math.min(LAGO.y2, Math.max(LAGO.y1, f.y + Math.sin(t / 900 + f.fase) * 0.3 * dt * 10));
        if (f.x > LAGO.x2) f.dir = -1; else if (f.x < LAGO.x1) f.dir = 1;
      }
      f.x = Math.min(LAGO.x2, Math.max(LAGO.x1, f.x));
      f.y = Math.min(LAGO.y2, Math.max(LAGO.y1, f.y)); // nunca sai da água
      const x = Math.round(f.x), y = Math.round(f.y), d = f.dir, rabo = Math.floor(t / 220 + f.fase) % 2;
      px(cx, x - d * 2, y, "#e87a2b"); px(cx, x - d, y, "#e87a2b"); px(cx, x, y, "#ffffff");
      px(cx, x - d * 3, y + rabo, "#c85f1a");
    });
  }
  function desenharComida(t) {
    for (let i = comida.length - 1; i >= 0; i--) {
      const c = comida[i], d = t - c.t0;
      if (c.comida || d > 6000) { comida.splice(i, 1); continue; }
      if (d < 0) continue;
      const y = Math.min(c.yAlvo, c.y + d * 0.03);
      if (y >= c.yAlvo && !c.pouso) { c.pouso = 1; ondas.push({ x: c.x, y: c.yAlvo, t0: t }); }
      px(cx, c.x, Math.round(y), "#d9a35c"); if (!c.pouso) px(cx, c.x, Math.round(y) - 1, "#f0c98a");
    }
    for (let i = ondas.length - 1; i >= 0; i--) {
      const o = ondas[i], k = (t - o.t0) / 700;
      if (k >= 1) { ondas.splice(i, 1); continue; }
      const r = 1 + Math.floor(k * 4);
      cx.globalAlpha = 0.7 * (1 - k);
      for (let a = 0; a < 12; a++) px(cx, Math.round(o.x + Math.cos(a / 12 * 6.283) * r), Math.round(o.y + Math.sin(a / 12 * 6.283) * r / 3), "#e9fbff");
      cx.globalAlpha = 1;
    }
  }

  const alvosJardim = [{ x: 78, y: 50, w: 52, h: 38, titulo: "Casinha de chá", acao: () => ir("sala"),
    texto: "Um cantinho de pausa no meio do jardim. Clique para entrar.",
    desenhar: (t, d) => { if (d) contorno(casaGlow, 78, 50); cx.drawImage(casaSpr, 78, 50); } },
    { x: 132, y: 90, w: 49, h: 13, titulo: "Lago dos peixes", reacao: darComida,
      texto: "Água calma e peixinhos laranja nadando devagar. Clique para jogar um pouco de ração." }];

  const alvosSala = [
    { x: 53, y: 40, w: 14, h: 46, titulo: "Tapete de yoga",
      texto: "Apoiado na parede, pronto para usar. Um alongamento ou uma caminhada curta já ajudam a repor a energia do corpo.",
      desenhar: (t, d) => { if (d) contorno(matGlow, 53, 40); cx.drawImage(matSpr, 53, 40); } },
    { x: 2, y: 58, w: 46, h: 30, titulo: "Cama de descansar",
      texto: "Almofadas fofinhas e cobertor macio. Dormir bem é uma das formas mais simples de cuidar de si.",
      desenhar: (t, d) => { if (d) contorno(camaGlow, 2, 58); cx.drawImage(camaSpr, 2, 58); zzz(t, 20, 59); } },
    { x: 22, y: 61, w: 16, h: 10, titulo: "Gatinho dorminhoco", reacao: fazerCarinho,
      texto: "Dormindo em cima da cama, sem pressa nenhuma. Um bichinho de estimação traz carinho e companhia. Clique para fazer um carinho.",
      desenhar: (t, d) => { const dy = t - gatoT < 450 ? -Math.round(Math.sin((t - gatoT) / 450 * Math.PI) * 2) : 0;
        if (d) contorno(gatoGlow, 22, 61 + dy); cx.drawImage(Math.sin(t / 900) > 0 ? gatoB : gatoA, 22, 61 + dy); } },
    { x: 49, y: 5, w: 27, h: 20, titulo: "Quem cuida de você",
      texto: "Avós, pais, amigos: pessoas de confiança com quem conversar. Pedir apoio também é autocuidado.",
      desenhar: (t, d) => { if (d) contorno(fotosEsqGlow, 49, 5); cx.drawImage(fotosEsqSpr, 49, 5); } },
    { x: 115, y: 6, w: 32, h: 34, titulo: "Fotos de família e amigos",
      texto: "Quem está ao seu lado nos dias bons e nos difíceis. Lembrar da sua rede de apoio ajuda a lembrar que ninguém precisa carregar tudo sozinho.",
      desenhar: (t, d) => { if (d) contorno(fotosDirGlow, 115, 6); cx.drawImage(fotosDirSpr, 115, 6); } },
    { x: 149, y: 3, w: 30, h: 24, titulo: "Celular, bem longe",
      texto: "Tela apagada e guardado lá no alto, longe de você. O ideal é ficar longe das telas: deixe o celular aqui enquanto descansa, medita ou conversa com quem você gosta.",
      desenhar: (t, d) => { if (d) contorno(celGlow, 149, 3); cx.drawImage(celSpr, 149, 3); } },
    { x: 12, y: 44, w: 34, h: 12, titulo: "Plantinhas na janela", reacao: regar, cursor: cursorRegador,
      texto: "Pequenos vasos que pegam a luz da manhã. Cuidar de uma planta também é uma pausa para cuidar de você. Clique para regar.",
      desenhar: (t, d) => { if (d) contorno(janelaGlow, 12, 44); cx.drawImage(janelaSpr, 12, 44); } },
    { x: 115, y: 46, w: 32, h: 40, titulo: "Cantinho de desenho e escrita",
      texto: "Caderno, lápis e tinta para um hobby só seu. Tempo de lazer também é cuidado.",
      desenhar: (t, d) => { if (d) contorno(cantoGlow, 115, 46); cx.drawImage(cantoSpr, 115, 46); } },
    { x: 158, y: 88, w: 26, h: 30, titulo: "Vasos de plantas", reacao: regar, cursor: cursorRegador,
      texto: "Um pouco de verde por perto. O contato com a natureza acalma a mente e melhora o humor. Clique para regar.",
      desenhar: (t, d) => { if (d) contorno(plantaGlow, 158, 88); cx.drawImage(plantaSpr, 158, 88); } },
    { x: 78, y: 14, w: 36, h: 36, titulo: "UniFECAF Clínica de Saúde", acao: abrirCartaz,
      texto: "“Cuidar de pessoas, transformar vidas.” Ensino, saúde e comunidade. Clique para ver o cartaz maior.",
      desenhar: (t, d) => { if (d) contorno(cartazGlow, 78, 14); cx.drawImage(cartazSpr, 78, 14); } },
    { x: 36, y: 94, w: 16, h: 16, titulo: "Incensário",
      texto: "O aroma e a fumaça fina marcam o começo da pausa e ajudam a soltar os pensamentos.",
      desenhar: (t, d) => { if (d) contorno(incGlow, 36, 94); cx.drawImage(incSpr, 36, 94); } },
    { x: 65, y: 76, w: 26, h: 30, titulo: "Pausa para respirar",
      texto: "Uma pessoa sentada em meditação. Aqui ninguém é uma pontuação: só um momento de presença.",
      desenhar: (t, d) => { if (d) contorno(pessoa.glow, 65, 76);
        cx.drawImage(pessoa.base, 65, 76); cx.drawImage(pessoa.topo, 65, 76 + (Math.sin(t / 1300) > 0.35 ? -1 : 0)); } },
    { x: 98, y: 88, w: 40, h: 22, titulo: "Mesinha de chá",
      texto: "Um bule e uma xícara de chá quente. Um convite para desacelerar e se servir de calma.",
      desenhar: (t, d) => { if (d) contorno(mesaGlow, 98, 88); cx.drawImage(mesaSpr, 98, 88); } },
    { x: 148, y: 28, w: 32, h: 56, titulo: "Porta de correr", texto: "Clique para voltar ao jardim.", acao: () => ir("jardim"),
      desenhar: (t, d) => { if (d) { R(cx, 147, 27, 34, 1, "#d9fff0"); R(cx, 147, 84, 34, 1, "#d9fff0"); R(cx, 147, 27, 1, 58, "#d9fff0"); R(cx, 180, 27, 1, 58, "#d9fff0"); } } },
    { x: 3, y: 86, w: 30, h: 30, titulo: "Seu bonsai", proprio: true, oculto: () => !meu,
      get texto() {
        if (!meu) return "";
        const base = `Resposta ${meu.id}: ${meu.p} pontos (${NOME[faixa(meu.p)]}). `;
        return base + (meu.p >= 48 ? "Ele floresceu. Cuidar de si também dá resultado." : "Clique nas coisas da sala para cuidar dele. Cada clique ajuda a se recuperar.");
      },
      desenhar: (t, d) => { if (!meu) return; if (d) contorno(meu.glow, 3, 86); cx.drawImage(meu.spr, 3, 86); } },
  ];

  function desenharJardim(t) {
    cx.drawImage(fundo, 0, 0);
    desenharPeixes(t);
    const itens = arvores.map((a) => ({ y: a.y, f: () => {
      const linhas = a.id === anim.id ? Math.min(S, Math.max(1, 1 + Math.floor((t - anim.t0) / 35))) : S;
      cx.drawImage(a.spr, 0, S - linhas, S, linhas, a.x - S / 2, a.y - linhas, S, linhas);
    } }));
    itens.push({ y: 88, f: () => alvosJardim[0].desenhar(t, hover === alvosJardim[0]) });
    itens.sort((a, b) => a.y - b.y).forEach((i) => i.f());
    desenharComida(t);
    if (anim.id && t - anim.t0 >= 35 * S + 60) anim.id = 0;
  }
  function desenharSala(t) {
    cx.drawImage(salaBG, 0, 0);
    alvosSala.forEach((a) => a.desenhar(t, hover === a));
    [[41, 95], [44, 94], [47, 96]].forEach(([x, y], k) => fumaca(t + k * 300, x, y, 3, 18));
    fumaca(t, 103, 90, 2, 10); fumaca(t + 400, 126, 91, 2, 9); fumaca(t + 700, 132, 91, 2, 9);
    desenharFx(t);
  }

  function atualizarTexto() {
    const sala = cena === "sala";
    slide.classList.toggle("na-sala", sala);
    btnCasa.textContent = sala ? "Voltar ao jardim" : "Entrar na casinha";
    info(sala ? TXT_SALA : DICA);
    cv.setAttribute("aria-label", sala
      ? "Sala da casinha em pixel art, com uma pessoa meditando, uma mesinha de chá, um incensário, um cartaz, um tapete de yoga, uma cama com um gatinho dormindo, vasos de plantas, uma mesinha de desenho e escrita, fotos de família e amigos na parede e um celular guardado bem longe, com a tela apagada"
      : "Jardim zen em pixel art, com um bonsai para cada resposta e uma casinha de madeira");
  }

  function quadro(agora) {
    if (cv.offsetParent !== null) {
      if (cena === "jardim") desenharJardim(agora); else desenharSala(agora);
      if (fade) {
        const d = agora - fade.t0; let alpha;
        if (fade.fase === "sai") {
          alpha = Math.min(1, d / 220);
          if (d >= 220) { cena = fade.para; fade = { t0: agora, fase: "entra" }; atualizarTexto(); }
        } else { alpha = Math.max(0, 1 - d / 220); if (d >= 220) fade = null; }
        if (alpha > 0) { cx.fillStyle = `rgba(7,17,13,${alpha.toFixed(2)})`; cx.fillRect(0, 0, W, H); }
      }
    }
    requestAnimationFrame(quadro);
  }

  function contar() {
    const n = { outono: 0, verde: 0, florida: 0 };
    arvores.forEach((t) => n[faixa(t.p)]++);
    for (const k in n) el("j-" + k).textContent = n[k];
  }
  function plantar(p, animar, resposta) {
    if (arvores.length >= lugares.length) { info(`O jardim está cheio (${lugares.length} bonsais).`); return false; }
    const id = resposta || ++extras, { x, y } = lugares[arvores.length], t = { id, resposta: resposta || 0, p, x, y };
    t.spr = bonsai(t); arvores.push(t);
    if (animar) { anim.id = id; anim.t0 = performance.now(); }
    contar(); return true;
  }

  // Traz do banco as últimas respostas que ainda não estão no jardim
  function puxar(limite) {
    fetch("/api/respostas-recentes?limite=" + limite)
      .then((r) => r.json().then((d) => ({ ok: r.ok, d })))
      .then(({ ok, d }) => {
        if (!ok) { info(d.erro || "Não foi possível carregar as respostas."); return; }
        if (!d.respostas.length) { info("Ainda não há respostas para o jardim."); return; }
        const novas = d.respostas.filter((a) => !arvores.some((t) => t.resposta === a.id));
        if (!novas.length) { info("Essas respostas já estão no jardim."); return; }
        let coube = true;
        novas.forEach((a, i) => { coube = plantar(a.pontos, i === novas.length - 1, a.id) && coube; });
        if (coube) info(DICA);
      })
      .catch(() => info("Não foi possível falar com o servidor."));
  }

  // ---------- Mouse, toque e teclado ----------
  const alvoEm = (e) => {
    const rc = cv.getBoundingClientRect(), x = (e.clientX - rc.left) * W / rc.width, y = (e.clientY - rc.top) * H / rc.height;
    const l = cena === "jardim" ? alvosJardim : alvosSala;
    for (let i = l.length - 1; i >= 0; i--) if (!(l[i].oculto && l[i].oculto()) && x >= l[i].x - 2 && x < l[i].x + l[i].w + 2 && y >= l[i].y - 2 && y < l[i].y + l[i].h + 2) return l[i];
    return null;
  };
  function mostrarDica(a, cxp, cyp) {
    dica.hidden = false;
    dica.querySelector("b").textContent = a.titulo;
    dica.querySelector("span").textContent = a.msgAte && performance.now() < a.msgAte ? a.msg : a.texto;
    const r = wrap.getBoundingClientRect(); let x = cxp - r.left + 14, y = cyp - r.top + 14;
    if (x + dica.offsetWidth > r.width) x = Math.max(0, cxp - r.left - dica.offsetWidth - 14);
    if (y + dica.offsetHeight > r.height) y = Math.max(0, cyp - r.top - dica.offsetHeight - 14);
    dica.style.left = x + "px"; dica.style.top = y + "px";
  }

  cv.addEventListener("mousemove", (e) => {
    if (fade) return;
    hover = alvoEm(e);
    cv.style.cursor = hover && (hover.acao || hover.reacao) ? (hover.cursor || "pointer") : "default";
    if (hover) { mostrarDica(hover, e.clientX, e.clientY); return; }
    dica.hidden = true;
    if (cena !== "jardim") return;
    const rc = cv.getBoundingClientRect(), x = (e.clientX - rc.left) * W / rc.width, y = (e.clientY - rc.top) * H / rc.height;
    const t = [...arvores].sort((a, b) => b.y - a.y).find((t) => x >= t.x - S / 2 && x < t.x + S / 2 && y >= t.y - S && y < t.y);
    mostrar(t ? (t.resposta ? `Resposta ${t.resposta}` : "Exemplo") + `: ${t.p} pontos (${NOME[faixa(t.p)]})` : aviso);
  });
  cv.addEventListener("mouseleave", () => { hover = null; dica.hidden = true; mostrar(aviso); });
  cv.addEventListener("click", (e) => {
    if (fade) return;
    const a = alvoEm(e);
    if (!a) { dica.hidden = true; return; }
    if (a.acao) a.acao();
    else {
      if (a.reacao) a.reacao(a);
      if (cena === "sala") brilhar(a, 5);
      if (cena === "sala" && !a.proprio) {
        const antes = meu && meu.p;
        const m = cuidar(), agora = performance.now();
        if (meu && meu.p !== antes) brilhar({ x: 3, y: 86, w: 30, h: 30 }, 4);
        if (m) { a.msg = (a.msgAte && agora < a.msgAte ? a.msg + " " : "") + m; a.msgAte = agora + 2600; }
      }
      mostrarDica(a, e.clientX, e.clientY);
    }
  });
  btnCasa.addEventListener("click", () => ir(cena === "jardim" ? "sala" : "jardim"));

  const fecharModal = () => { modal.hidden = true; };
  el("jardim-modal-fechar").addEventListener("click", fecharModal);
  modal.addEventListener("click", (e) => { if (e.target === modal) fecharModal(); });
  document.addEventListener("keydown", (e) => { if (e.key === "Escape" && !modal.hidden) fecharModal(); });

  el("j-recomecar").addEventListener("click", () => {
    arvores.length = 0; contar();
    info("Jardim vazio. Use “Puxar 10 últimas respostas” para trazer os bonsais de volta.");
  });
  el("j-aleatorias").addEventListener("click", () => {
    let coube = true;
    for (let i = 0; i < 10 && coube; i++) {
      const p = Math.round(Math.min(60, Math.max(0, 38 + (Math.random() + Math.random() + Math.random() - 1.5) * 34)));
      coube = plantar(p, i === 9);
    }
    if (coube) info(DICA);
  });
  el("j-puxar").addEventListener("click", () => puxar(10));

  window.criarBonsai = bonsai; // usado pela página final (final.js)
  atualizarTexto();
  requestAnimationFrame(quadro);
  puxar(lugares.length);
})();

// A música vai para a barra lateral enquanto o jardim está na tela.
(function () {
  const player = document.querySelector(".player");
  const lateral = document.getElementById("jardim-lateral");
  const palco = document.getElementById("conteudo");
  if (!player || !lateral || !palco) return;
  const acompanhar = () => {
    const noJardim = palco.classList.contains("na-jardim");
    if (noJardim && player.parentNode !== lateral) lateral.appendChild(player);
    if (!noJardim && player.parentNode === lateral) document.body.appendChild(player);
  };
  new MutationObserver(acompanhar).observe(palco, { attributes: true, attributeFilter: ["class"] });
  acompanhar();
})();
