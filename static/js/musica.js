(function () {
  const audio = document.getElementById("musica");
  const btnPlay = document.getElementById("mus-play");
  const btnReiniciar = document.getElementById("mus-reiniciar");
  const volume = document.getElementById("mus-volume");
  if (!audio || !btnPlay || !btnReiniciar || !volume) return;

  // Estado lembrado ao trocar de página
  let pausadoPeloUsuario = sessionStorage.getItem("musicaPausada") === "1";
  const volSalvo = parseFloat(sessionStorage.getItem("musicaVolume"));
  audio.volume = isNaN(volSalvo) ? 0.3 : volSalvo;
  volume.value = audio.volume;
  audio.currentTime = parseFloat(sessionStorage.getItem("musicaTempo")) || 0;

  function atualizar() {
    btnPlay.textContent = audio.paused ? "▶" : "⏸";
  }

  function tocar() {
    audio.play().then(atualizar).catch(() => {});
  }

  btnPlay.addEventListener("click", () => {
    if (audio.paused) {
      pausadoPeloUsuario = false;
      tocar();
    } else {
      pausadoPeloUsuario = true;
      audio.pause();
    }
    sessionStorage.setItem("musicaPausada", pausadoPeloUsuario ? "1" : "0");
    atualizar();
  });

  btnReiniciar.addEventListener("click", () => {
    audio.currentTime = 0;
    pausadoPeloUsuario = false;
    sessionStorage.setItem("musicaPausada", "0");
    tocar();
  });

  volume.addEventListener("input", () => {
    audio.volume = parseFloat(volume.value);
    sessionStorage.setItem("musicaVolume", audio.volume);
  });

  // Navegadores bloqueiam som automático: tenta agora e, se não deixar, toca no primeiro toque do usuário
  if (!pausadoPeloUsuario) tocar();
  ["pointerdown", "click", "keydown", "touchstart"].forEach((ev) =>
    document.addEventListener(ev, function iniciar(e) {
      document.removeEventListener(ev, iniciar);
      if (e.target.closest && e.target.closest(".player")) return;
      if (audio.paused && !pausadoPeloUsuario) tocar();
    })
  );

  // Guarda o ponto da música para continuar ao trocar de página
  window.addEventListener("pagehide", () =>
    sessionStorage.setItem("musicaTempo", audio.currentTime)
  );
  audio.addEventListener("play", atualizar);
  audio.addEventListener("pause", atualizar);
  atualizar();
})();
