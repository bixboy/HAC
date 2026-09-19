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
  let rotsAudio = null;
  let rotsPlayCount = 0;
  const MAX_ROTS_PLAYS = 2; // Joue 1 à 2 fois au lancement comme demandé
  let audioCtx = null;
  let rotsSource = null;
  let rotsGain = null;
  let memeSource = null;
  let memeGain = null;

  // Pré-chargement des fichiers audios
  try {
    memeAudio = new Audio('herisson-meme-song.mp3');
    memeAudio.loop = true;
    memeAudio.volume = 1.0;
  } catch (e) {
    console.warn('Audio preload error', e);
  }

  try {
    rotsAudio = new Audio('Rots.mp3');
    rotsAudio.volume = 1.0;
  } catch (e) {
    console.warn('Rots audio preload error', e);
  }

  // Initialisation et déverrouillage de l'AudioContext dès le premier geste utilisateur
  function initAudioNodes() {
    try {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (AudioCtx && !audioCtx) {
        audioCtx = new AudioCtx();
      }
      if (audioCtx && audioCtx.state === 'suspended') {
        audioCtx.resume();
      }

      // 1. Branchement de Rots.mp3 avec volume BOOSTÉ à 3.0x (bien fort !)
      if (audioCtx && !rotsSource && rotsAudio) {
        rotsSource = audioCtx.createMediaElementSource(rotsAudio);
        rotsGain = audioCtx.createGain();
        rotsGain.gain.setValueAtTime(3.0, audioCtx.currentTime);
        rotsSource.connect(rotsGain);
        rotsGain.connect(audioCtx.destination);
      }

      // 2. Branchement de herisson-meme-song.mp3 avec gain à 1.7x
      if (audioCtx && !memeSource && memeAudio) {
        memeSource = audioCtx.createMediaElementSource(memeAudio);
        memeGain = audioCtx.createGain();
        memeGain.gain.setValueAtTime(1.7, audioCtx.currentTime);
        memeSource.connect(memeGain);
        memeGain.connect(audioCtx.destination);
      }
    } catch (err) {
      console.warn('Erreur init Web Audio:', err);
    }
  }

  // Séquence de déclenchement avec chargement de 3 secondes
  let loaderInterval = null;
  function triggerPrankSequence() {
    if (prankStarted) return;
    prankStarted = true;

    // Déverrouiller le moteur audio dès le clic
    initAudioNodes();

    // A. Masquer le lecteur initial et afficher l'écran de chargement
    fakePlayer.classList.add('hidden');
    if (officialLoader) officialLoader.classList.remove('hidden');

    // B. Progression du chargement calibrée exactement sur 3 SECONDES (3000ms)
    const totalDuration = 3000;
    const startTime = Date.now();

    loaderInterval = setInterval(() => {
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
        setTimeout(launchRickroll, 150);
      }
    }, 35);
  }

  // Clic sur le loader pour accélérer / passer directement si souhaité
  if (officialLoader) {
    officialLoader.addEventListener('click', () => {
      if (loaderInterval) clearInterval(loaderInterval);
      launchRickroll();
    });
  }

  // Dénouement du Prank : Lancement du Rot en premier puis de la musique du hérisson
  function launchRickroll() {
    // 1. Masquer le loader et afficher le Rickroll
    if (officialLoader) officialLoader.classList.add('hidden');
    if (rickrollPlayer) rickrollPlayer.classList.remove('hidden');

    // 2. Assurer l'activation du Web Audio
    initAudioNodes();

    // 3. Explosion immédiate de confettis sur tout l'écran
    fireHACConfetti();

    // 4. LE ROT COMMENCE EN PREMIER ET TRÈS FORT !
    playRotsSound();

    // 5. La musique du hérisson démarre juste après que le rot ait retenti (1,2 seconde de décalage)
    setTimeout(() => {
      playHerissonMemeSong();
      startKaraokeLyrics();
    }, 1200);

    // 6. Cadrage fluide de l'écran
    setTimeout(() => {
      if (rickrollPlayer) {
        rickrollPlayer.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    }, 150);
  }

  // Moteur Audio : Lecture du son herisson-meme-song.mp3
  function playHerissonMemeSong() {
    try {
      if (!memeAudio) {
        memeAudio = new Audio('herisson-meme-song.mp3');
        memeAudio.loop = true;
      }
      initAudioNodes();

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

  // Lecture de Rots.mp3 (très fort, 1 ou 2 fois seulement)
  function playRotsSound() {
    try {
      if (!rotsAudio) {
        rotsAudio = new Audio('Rots.mp3');
      }
      initAudioNodes();

      rotsAudio.volume = 1.0;
      rotsPlayCount = 0;

      // Quand le son se termine, on le relance une 2ème fois (2 fois max), puis il s'arrête
      rotsAudio.onended = () => {
        rotsPlayCount++;
        if (rotsPlayCount < MAX_ROTS_PLAYS) {
          setTimeout(() => {
            if (rotsAudio && !audioMuted) {
              rotsAudio.currentTime = 0;
              rotsAudio.play().catch(() => {});
            }
          }, 250);
        }
      };

      rotsAudio.currentTime = 0;
      rotsAudio.play().catch(err => {
        console.warn('Lecture Rots.mp3 bloquée ou erreur:', err);
      });
    } catch (err) {
      console.warn('Erreur sonore Rots:', err);
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
      if (rotsAudio) {
        rotsAudio.muted = audioMuted;
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
  // Moteur de Confettis Massif "Partout sur l'Écran & la Vidéo"
  // ------------------------------------------------------------------------
  let confettiEngineActive = false;

  function fireHACConfetti() {
    if (confettiEngineActive) return;
    confettiEngineActive = true;

    const canvasMain = document.getElementById('confetti-canvas');
    const canvasPlayer = document.getElementById('player-confetti-canvas');
    const canvases = [canvasMain, canvasPlayer].filter(c => c !== null);

    if (canvases.length === 0) return;

    function resizeAll() {
      if (canvasMain) {
        canvasMain.width = window.innerWidth;
        canvasMain.height = window.innerHeight;
      }
      if (canvasPlayer && canvasPlayer.parentElement) {
        canvasPlayer.width = canvasPlayer.parentElement.clientWidth || 800;
        canvasPlayer.height = canvasPlayer.parentElement.clientHeight || 450;
      }
    }

    resizeAll();
    window.addEventListener('resize', resizeAll);

    // Couleurs officielles Le Havre AC Ciel & Marine + Or + Palette festive
    const colors = [
      '#5a98cb', '#74c4fb', '#38bdf8', '#00b4d8', // Bleu Ciel HAC
      '#0a152e', '#1e3a8a', '#1d4ed8',           // Bleu Marine HAC
      '#ffd700', '#f59e0b', '#fbbf24', '#facc15', // Or Champion
      '#ffffff',                                   // Blanc
      '#ff2a6d', '#ec4899', '#f43f5e',           // Rose Fête
      '#10b981', '#059669',                       // Vert
      '#8b5cf6', '#a855f7'                        // Violet
    ];

    const shapes = ['rect', 'rect', 'circle', 'star', 'streamer'];

    function createParticle(canvas, x, y, vx, vy, isRespawn = false) {
      const shape = shapes[Math.floor(Math.random() * shapes.length)];
      return {
        x: x !== undefined ? x : Math.random() * canvas.width,
        y: y !== undefined ? y : Math.random() * (canvas.height * 0.85),
        vx: vx !== undefined ? vx : (Math.random() * 5 - 2.5),
        vy: vy !== undefined ? vy : (Math.random() * 4 + 2),
        size: Math.random() * 11 + 6,
        color: colors[Math.floor(Math.random() * colors.length)],
        gravity: 0.28 + Math.random() * 0.16,
        drag: isRespawn ? 0.995 : 0.975,
        wobble: Math.random() * Math.PI * 2,
        wobbleSpeed: Math.random() * 0.12 + 0.05,
        rotation: Math.random() * 360,
        rotSpeed: Math.random() * 12 - 6,
        shape: shape,
        opacity: 1
      };
    }

    // Initialisation des systèmes de particules
    const systems = canvases.map(canvas => {
      const particles = [];
      const isMain = canvas === canvasMain;
      const w = canvas.width;
      const h = canvas.height;

      // 1. Inondation immédiate de tout l'écran (particules dès la première seconde !)
      const initialCount = isMain ? 320 : 120;
      for (let i = 0; i < initialCount; i++) {
        particles.push(createParticle(canvas, Math.random() * w, Math.random() * (h * 0.85)));
      }

      // 2. Canon Bas-Gauche (Tire vers le haut-droite à travers tout l'écran)
      const leftCannonCount = isMain ? 180 : 50;
      for (let i = 0; i < leftCannonCount; i++) {
        const angle = (-50 - Math.random() * 30) * Math.PI / 180;
        const speed = Math.random() * 16 + 14;
        particles.push(createParticle(
          canvas,
          0,
          h * 0.9,
          Math.cos(angle) * speed,
          Math.sin(angle) * speed
        ));
      }

      // 3. Canon Bas-Droite (Tire vers le haut-gauche à travers tout l'écran)
      const rightCannonCount = isMain ? 180 : 50;
      for (let i = 0; i < rightCannonCount; i++) {
        const angle = (-130 + Math.random() * 30) * Math.PI / 180;
        const speed = Math.random() * 16 + 14;
        particles.push(createParticle(
          canvas,
          w,
          h * 0.9,
          Math.cos(angle) * speed,
          Math.sin(angle) * speed
        ));
      }

      // 4. Explosion Radiale Centrale (depuis le cœur de la vidéo)
      const centerCount = isMain ? 140 : 40;
      for (let i = 0; i < centerCount; i++) {
        const angle = Math.random() * Math.PI * 2;
        const speed = Math.random() * 15 + 6;
        particles.push(createParticle(
          canvas,
          w * 0.5,
          h * 0.5,
          Math.cos(angle) * speed,
          Math.sin(angle) * speed
        ));
      }

      return {
        canvas,
        ctx: canvas.getContext('2d'),
        particles
      };
    });

    // Dessin d'une étoile à 5 branches
    function drawStar(ctx, r) {
      ctx.beginPath();
      for (let i = 0; i < 5; i++) {
        ctx.lineTo(Math.cos((18 + i * 72) * Math.PI / 180) * r, -Math.sin((18 + i * 72) * Math.PI / 180) * r);
        ctx.lineTo(Math.cos((54 + i * 72) * Math.PI / 180) * (r * 0.5), -Math.sin((54 + i * 72) * Math.PI / 180) * (r * 0.5));
      }
      ctx.closePath();
      ctx.fill();
    }

    // Salves périodiques de canons pour relancer l'explosion en continu
    let salvoToggle = false;
    setInterval(() => {
      const mainSys = systems.find(s => s.canvas === canvasMain);
      if (!mainSys) return;

      const w = mainSys.canvas.width;
      const h = mainSys.canvas.height;
      const count = 70;

      salvoToggle = !salvoToggle;
      const startX = salvoToggle ? 0 : w;
      const baseAngle = salvoToggle ? -60 : -120;

      for (let i = 0; i < count; i++) {
        const angle = (baseAngle + (Math.random() * 40 - 20)) * Math.PI / 180;
        const speed = Math.random() * 18 + 12;
        mainSys.particles.push(createParticle(
          mainSys.canvas,
          startX,
          h * 0.88,
          Math.cos(angle) * speed,
          Math.sin(angle) * speed
        ));
      }
    }, 2400);

    // Salve interactive au clic n'importe où sur la page
    window.addEventListener('click', (e) => {
      const mainSys = systems.find(s => s.canvas === canvasMain);
      if (!mainSys) return;
      const count = 45;
      for (let i = 0; i < count; i++) {
        const angle = Math.random() * Math.PI * 2;
        const speed = Math.random() * 14 + 5;
        mainSys.particles.push(createParticle(
          mainSys.canvas,
          e.clientX,
          e.clientY,
          Math.cos(angle) * speed,
          Math.sin(angle) * speed
        ));
      }
    });

    // Boucle d'animation principale (60 FPS ultra fluide)
    function render() {
      systems.forEach(sys => {
        const { canvas, ctx, particles } = sys;
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        for (let i = 0; i < particles.length; i++) {
          const p = particles[i];
          p.x += p.vx;
          p.y += p.vy;
          p.vy += p.gravity;
          p.vx *= p.drag;
          p.vy *= p.drag;
          p.rotation += p.rotSpeed;
          p.wobble += p.wobbleSpeed;

          // Recyclage continu : Dès qu'un confetti sort par le bas, il retombe du haut !
          if (p.y > canvas.height + 25) {
            p.y = -15 - Math.random() * 25;
            p.x = Math.random() * canvas.width;
            p.vy = Math.random() * 4 + 2.5;
            p.vx = Math.random() * 4 - 2;
            p.drag = 0.995;
          }

          ctx.save();
          // Effet de vent horizontal naturel (wobble)
          ctx.translate(p.x + Math.sin(p.wobble) * 2.5, p.y);
          ctx.rotate((p.rotation * Math.PI) / 180);
          ctx.fillStyle = p.color;
          ctx.globalAlpha = p.opacity;

          if (p.shape === 'rect') {
            // Effet 3D de ruban qui tourne sur lui-même
            const w = p.size;
            const h = p.size * 0.6 * Math.abs(Math.cos(p.wobble));
            ctx.fillRect(-w / 2, -h / 2, w, h);
          } else if (p.shape === 'circle') {
            ctx.beginPath();
            ctx.arc(0, 0, p.size / 2, 0, Math.PI * 2);
            ctx.fill();
          } else if (p.shape === 'star') {
            drawStar(ctx, p.size * 0.6);
          } else if (p.shape === 'streamer') {
            const len = p.size * 2.2;
            const w = p.size * 0.45;
            ctx.fillRect(-w / 2, -len / 2, w, len * Math.abs(Math.sin(p.wobble)));
          }

          ctx.restore();
        }

        // Limiter le nombre max de particules pour maintenir 60 FPS
        if (particles.length > 900) {
          particles.splice(0, particles.length - 850);
        }
      });

      requestAnimationFrame(render);
    }

    render();
  }
});
