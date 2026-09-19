/* ==========================================================================
   HAC.FOOTBALL - MOTEUR DU PRANK OFFICIEL
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

  // 2. Déclenchement du Prank au clic sur le bouton Play
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
  let synthAudioController = null;

  function triggerPrankSequence() {
    if (prankStarted) return;
    prankStarted = true;

    // 1. Demande de plein écran automatique pour un choc immersif total
    try {
      if (videoModule) {
        if (videoModule.requestFullscreen) {
          videoModule.requestFullscreen().catch(() => {});
        } else if (videoModule.webkitRequestFullscreen) {
          videoModule.webkitRequestFullscreen();
        }
      }
    } catch (e) {}

    // 2. Masquer le player initial et afficher le suspense loader
    fakePlayer.classList.add('hidden');
    if (officialLoader) officialLoader.classList.remove('hidden');

    // 3. Animation du chargement réaliste (1,4 seconde de faux suspense)
    let percent = 20;
    const progressInterval = setInterval(() => {
      percent += Math.floor(Math.random() * 22) + 14;
      if (percent >= 100) {
        percent = 100;
        clearInterval(progressInterval);
        if (loaderProgressFill) loaderProgressFill.style.width = '100%';
        if (loaderStatusText) loaderStatusText.textContent = 'Connexion satellite réussie • Lancement du direct...';
        
        // BOOM : Lancement du Rickroll à 100%
        setTimeout(launchRickroll, 250);
      } else {
        if (loaderProgressFill) loaderProgressFill.style.width = `${percent}%`;
        if (loaderStatusText) loaderStatusText.textContent = `Établissement du flux HD 1080p (${percent}%)...`;
      }
    }, 180);
  }

  function launchRickroll() {
    // A. Masquer le loader et afficher le Rickroll
    if (officialLoader) officialLoader.classList.add('hidden');
    rickrollPlayer.classList.remove('hidden');

    // B. Lancer la musique synthétisée 80s "Never Gonna Give You Up"
    synthAudioController = startRickrollSynthMusic();

    // C. Démarrer les paroles de karaoké synchronisées
    startKaraokeLyrics();

    // D. Explosion de confettis aux couleurs officielles Ciel & Marine
    fireHACConfetti();

    // E. Cadrage fluide de l'écran
    setTimeout(() => {
      rickrollPlayer.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }, 150);
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
      if (!synthAudioController) return;
      audioMuted = !audioMuted;
      synthAudioController.setMuted(audioMuted);
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
  // Animation des paroles Karaoké du Rickroll
  // ------------------------------------------------------------------------
  function startKaraokeLyrics() {
    if (!lyricsDisplay) return;

    const lyricsSequence = [
      { text: "🎵 Never gonna give you up...", duration: 2500 },
      { text: "🎵 Never gonna let you down...", duration: 2500 },
      { text: "🎵 Never gonna run around and desert you...", duration: 3200 },
      { text: "🎵 Never gonna make you cry...", duration: 2400 },
      { text: "🎵 Never gonna say goodbye...", duration: 2400 },
      { text: "🎵 Never gonna tell a lie and hurt you...", duration: 3200 },
      { text: "😂 ALORS ÇA A CRU AU RETOUR DE LA PIOCHE AU HAC ??? 😂", duration: 3500 },
      { text: "💙🩵 POGBA EN NORMANDIE C'ÉTAIT TROP BEAU HEIN ? 🩵💙", duration: 3200 },
      { text: "🕺 RICKROLLED ! N'OUBLIE PAS DE RESPIRER ! 🕺", duration: 3000 }
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
  // Moteur Audio Web Audio API : Rickroll 80s Synth & Bassline
  // ------------------------------------------------------------------------
  function startRickrollSynthMusic() {
    try {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (!AudioCtx) return null;
      const ctx = new AudioCtx();

      const masterGain = ctx.createGain();
      masterGain.gain.setValueAtTime(0.2, ctx.currentTime);
      masterGain.connect(ctx.destination);

      let isMuted = false;
      let isPlaying = true;

      // Table des fréquences réelles de Never Gonna Give You Up
      const C4 = 261.63, D4 = 293.66, E4 = 329.63, F4 = 349.23, Fs4 = 369.99,
            G4 = 392.00, A4 = 440.00, B4 = 493.88, C5 = 523.25, D5 = 587.33,
            E5 = 659.25;

      // Séquence Mélodie (Refrain mythique)
      const melody = [
        // "Never gonna give you up"
        [D4, 0.4], [E4, 0.4], [G4, 0.4], [E4, 0.4], [B4, 0.6], [B4, 0.6], [A4, 1.2],
        // "Never gonna let you down"
        [D4, 0.4], [E4, 0.4], [G4, 0.4], [E4, 0.4], [A4, 0.6], [A4, 0.6], [G4, 0.5], [Fs4, 0.5], [E4, 1.0],
        // "Never gonna run around and desert you"
        [D4, 0.4], [E4, 0.4], [G4, 0.4], [E4, 0.4], [G4, 0.6], [A4, 0.6], [Fs4, 0.5], [E4, 0.5], [D4, 0.6], [D4, 0.4], [D4, 0.4], [A4, 0.6], [G4, 1.4],
        // "Never gonna make you cry"
        [D4, 0.4], [E4, 0.4], [G4, 0.4], [E4, 0.4], [B4, 0.6], [B4, 0.6], [A4, 1.2],
        // "Never gonna say goodbye"
        [D4, 0.4], [E4, 0.4], [G4, 0.4], [E4, 0.4], [D5, 0.7], [B4, 0.6], [G4, 0.6], [G4, 0.5], [Fs4, 0.5], [E4, 1.0],
        // "Never gonna tell a lie and hurt you"
        [D4, 0.4], [E4, 0.4], [G4, 0.4], [E4, 0.4], [G4, 0.6], [A4, 0.6], [Fs4, 0.5], [E4, 0.5], [D4, 0.6], [D4, 0.4], [D4, 0.4], [A4, 0.6], [G4, 1.4]
      ];

      const beatDuration = 0.32;

      function schedulePattern(startAt) {
        if (!isPlaying) return;
        let time = startAt;

        melody.forEach(([freq, beats]) => {
          const noteDuration = beats * beatDuration;
          
          // Lead Synth
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          const filter = ctx.createBiquadFilter();

          osc.type = 'sawtooth';
          osc.frequency.setValueAtTime(freq, time);

          filter.type = 'lowpass';
          filter.frequency.setValueAtTime(2400, time);

          gain.gain.setValueAtTime(0.18, time);
          gain.gain.exponentialRampToValueAtTime(0.001, time + noteDuration * 0.95);

          osc.connect(filter);
          filter.connect(gain);
          gain.connect(masterGain);

          osc.start(time);
          osc.stop(time + noteDuration);

          // Ligne de Basse punchy
          const bassOsc = ctx.createOscillator();
          const bassGain = ctx.createGain();
          bassOsc.type = 'square';
          bassOsc.frequency.setValueAtTime(freq / 2, time);

          bassGain.gain.setValueAtTime(0.09, time);
          bassGain.gain.exponentialRampToValueAtTime(0.001, time + noteDuration * 0.8);

          bassOsc.connect(bassGain);
          bassGain.connect(masterGain);

          bassOsc.start(time);
          bassOsc.stop(time + noteDuration);

          time += noteDuration;
        });

        const totalDuration = time - startAt;
        setTimeout(() => {
          if (isPlaying) {
            schedulePattern(ctx.currentTime + 0.05);
          }
        }, (totalDuration - 0.2) * 1000);
      }

      schedulePattern(ctx.currentTime + 0.05);

      return {
        setMuted: (muted) => {
          isMuted = muted;
          masterGain.gain.setValueAtTime(isMuted ? 0 : 0.2, ctx.currentTime);
        },
        stop: () => {
          isPlaying = false;
          masterGain.gain.setValueAtTime(0, ctx.currentTime);
        }
      };

    } catch (err) {
      console.warn('Audio Web API skipped', err);
      return null;
    }
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
