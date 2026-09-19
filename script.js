/* ==========================================================================
   HAC.FOOTBALL - MOTEUR DU PRANK OFFICIEL (PAUL POGBA x HÉRISSON MEME)
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
  // 1. Mise à jour du bandeau de date officiel (ex: SAM. 19 SEPTEMBRE 2026)
  const dateKicker = document.getElementById('current-date-kicker');
  if (dateKicker) {
    const options = { weekday: 'short', day: 'numeric', month: 'long', year: 'numeric' };
    const today = new Date().toLocaleDateString('fr-FR', options);
    dateKicker.textContent = today.toUpperCase();
  }

  // 2. Gestion des paramètres d'URL (?nom=Sarah&de=Pierre)
  const urlParams = new URLSearchParams(window.location.search);
  const friendName = urlParams.get('nom') || urlParams.get('name') || '';
  const authorName = urlParams.get('de') || urlParams.get('from') || 'Pierre';

  // 3. Éléments DOM
  const startBtn = document.getElementById('start-rickroll-btn');
  const fakePlayer = document.getElementById('official-fake-player');
  const rickrollPlayer = document.getElementById('official-rickroll-player');
  const lyricsDisplay = document.getElementById('lyrics-display');
  const audioToggleBtn = document.getElementById('audio-toggle-btn');
  const audioIcon = document.getElementById('audio-icon');
  const audioLabel = document.getElementById('audio-label');
  const officialLoader = document.getElementById('official-loader');
  const loaderProgressFill = document.getElementById('loader-progress-fill');
  const loaderStatusText = document.getElementById('loader-status-text');
  const videoModule = document.getElementById('video-module');

  let prankStarted = false;
  let audioMuted = false;
  let memeAudio = null;
  let audioCtx = null;
  let gainNode = null;

  // Pré-chargement de l'audio hérisson
  try {
    memeAudio = new Audio('herisson-meme-song.mp3');
    memeAudio.loop = true;
    memeAudio.volume = 1.0;
  } catch (e) {
    console.warn('Audio preload error', e);
  }

  // Séquence de déclenchement avec chargement de 3 secondes
  function triggerPrankSequence() {
    if (prankStarted) return;
    prankStarted = true;

    // A. Demande de plein écran automatique pour un choc immersif
    try {
      if (videoModule) {
        if (videoModule.requestFullscreen) {
          videoModule.requestFullscreen().catch(() => {});
        } else if (videoModule.webkitRequestFullscreen) {
          videoModule.webkitRequestFullscreen();
        }
      }
    } catch (e) {}

    // B. Masquer le lecteur initial et afficher l'écran de chargement
    fakePlayer.classList.add('hidden');
    if (officialLoader) officialLoader.classList.remove('hidden');

    // C. Progression du chargement calibrée exactement sur 3 SECONDES (3000ms)
    const totalDuration = 3000;
    const startTime = Date.now();

    const loaderInterval = setInterval(() => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(100, Math.floor((elapsed / totalDuration) * 100));

      if (loaderProgressFill) {
        loaderProgressFill.style.width = `${progress}%`;
      }

      if (loaderStatusText) {
        if (progress < 30) {
          loaderStatusText.textContent = `Connexion au flux satellite du Stade Océane (${progress}%)...`;
        } else if (progress < 65) {
          loaderStatusText.textContent = `Établissement du flux média sécurisé HD 1080p (${progress}%)...`;
        } else if (progress < 95) {
          loaderStatusText.textContent = `Synchronisation du direct HAC TV (${progress}%)...`;
        } else {
          loaderStatusText.textContent = `Flux satellite établi • Lancement du direct !`;
        }
      }

      if (progress >= 100) {
        clearInterval(loaderInterval);
        setTimeout(launchRickroll, 200);
      }
    }, 40);
  }

  // Dénouement du Prank : Lancement du Hérisson Meme Song + Rickroll
  function launchRickroll() {
    // 1. Masquer le loader et afficher le Rickroll
    if (officialLoader) officialLoader.classList.add('hidden');
    if (rickrollPlayer) rickrollPlayer.classList.remove('hidden');

    // 2. Lecture du sons Hérisson avec volume boosté (un minimum fort !)
    playHerissonMemeSong();

    // 3. Démarrer les paroles de karaoké synchronisées
    startKaraokeLyrics();

    // 4. Explosion de confettis aux couleurs officielles Ciel & Marine
    fireHACConfetti();

    // 5. Cadrage fluide de l'écran
    setTimeout(() => {
      if (rickrollPlayer) {
        rickrollPlayer.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    }, 150);
  }

  // Moteur Audio : Lecture et amplification du son herisson-meme-song.mp3
  function playHerissonMemeSong() {
    try {
      if (!memeAudio) {
        memeAudio = new Audio('herisson-meme-song.mp3');
        memeAudio.loop = true;
      }

      // Initialiser Web Audio pour booster le gain (son bien fort)
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (AudioCtx && !audioCtx) {
        audioCtx = new AudioCtx();
        const source = audioCtx.createMediaElementSource(memeAudio);
        gainNode = audioCtx.createGain();
        // Gain boosté à 1.8x pour un volume percutant
        gainNode.gain.setValueAtTime(1.8, audioCtx.currentTime);
        source.connect(gainNode);
        gainNode.connect(audioCtx.destination);
      }

      if (audioCtx && audioCtx.state === 'suspended') {
        audioCtx.resume();
      }

      memeAudio.volume = 1.0;
      memeAudio.play().catch(err => {
        console.warn('Lecture audio bloquée ou erreur:', err);
      });

    } catch (err) {
      console.warn('Audio amplification fallback', err);
      if (memeAudio) {
        memeAudio.volume = 1.0;
        memeAudio.play().catch(() => {});
      }
    }
  }

  if (startBtn) {
    startBtn.addEventListener('click', triggerPrankSequence);
  }
  if (fakePlayer) {
    fakePlayer.addEventListener('click', triggerPrankSequence);
  }

  // Contrôle Audio (Couper / Remettre le son)
  if (audioToggleBtn) {
    audioToggleBtn.addEventListener('click', () => {
      audioMuted = !audioMuted;
      if (memeAudio) {
        memeAudio.muted = audioMuted;
      }
      if (audioMuted) {
        audioIcon.textContent = '🔇';
        audioLabel.textContent = 'Son coupé';
        audioToggleBtn.style.opacity = '0.6';
      } else {
        audioIcon.textContent = '🔊';
        audioLabel.textContent = 'Son actif';
        audioToggleBtn.style.opacity = '1';
      }
    });
  }

  // ------------------------------------------------------------------------
  // Animation des paroles Karaoké (Adaptées Hérisson x Pogba)
  // ------------------------------------------------------------------------
  function startKaraokeLyrics() {
    if (!lyricsDisplay) return;

    const lyricsSequence = [
      { text: "🦔🎵 HÉRISSON MEME ACTIVÉ 🎵🦔", duration: 2500 },
      { text: "😂 T'AS CRU QUE PAUL POGBA SIGNAIT AU HAVRE ??? 😂", duration: 3200 },
      { text: "💙🩵 LA PIOCHE AU HAVRE C'ÉTAIT TROP BEAU ! 🩵💙", duration: 3000 },
      { text: "🦔 JE SUIS UN HÉRISSON ! 🦔", duration: 2800 },
      { text: "🕺 RICKROLLED ET HÉRISSONED PAR PIERRE ! 🕺", duration: 3200 },
      { text: "💙🩵 ALLEZ LE HAC QUAND MÊME ! 🩵💙", duration: 3000 }
    ];

    let currentIdx = 0;
    function showNext() {
      const item = lyricsSequence[currentIdx];
      lyricsDisplay.textContent = item.text;
      lyricsDisplay.style.opacity = '0';
      setTimeout(() => {
        lyricsDisplay.style.opacity = '1';
      }, 50);

      currentIdx = (currentIdx + 1) % lyricsSequence.length;
      setTimeout(showNext, item.duration);
    }

    showNext();
  }

  // ------------------------------------------------------------------------
  // Moteur de Confettis Ciel & Marine
  // ------------------------------------------------------------------------
  function fireHACConfetti() {
    const canvas = document.getElementById('confetti-canvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    window.addEventListener('resize', () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    });

    const colors = ['#5a98cb', '#74c4fb', '#0a152e', '#ffffff', '#c0946a'];
    const particles = [];
    const count = 130;

    for (let i = 0; i < count; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * -canvas.height,
        size: Math.random() * 8 + 5,
        color: colors[Math.floor(Math.random() * colors.length)],
        speedY: Math.random() * 5 + 3,
        speedX: Math.random() * 4 - 2,
        rotation: Math.random() * 360,
        rotSpeed: Math.random() * 8 - 4,
        opacity: 1
      });
    }

    let elapsed = 0;
    function render() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      elapsed++;

      particles.forEach((p) => {
        p.y += p.speedY;
        p.x += p.speedX;
        p.rotation += p.rotSpeed;

        if (p.y > canvas.height) {
          p.y = -10;
          p.x = Math.random() * canvas.width;
        }

        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate((p.rotation * Math.PI) / 180);
        ctx.fillStyle = p.color;
        ctx.globalAlpha = p.opacity;
        ctx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size * 0.6);
        ctx.restore();
      });

      if (elapsed < 350) {
        requestAnimationFrame(render);
      } else {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
      }
    }

    render();
  }
});
