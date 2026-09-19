/* ==========================================================================
   HAC MÉDIA - MERCATO PRANK ENGINE
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
  // 1. Mise à jour de la date dynamique
  const dateElement = document.getElementById('current-date');
  if (dateElement) {
    const options = { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' };
    const today = new Date().toLocaleDateString('fr-FR', options);
    dateElement.textContent = today.charAt(0).toUpperCase() + today.slice(1);
  }

  // 2. Gestion des paramètres d'URL (?nom=Sarah&de=Pierre)
  const urlParams = new URLSearchParams(window.location.search);
  const friendName = urlParams.get('nom') || urlParams.get('name') || '';
  const authorName = urlParams.get('de') || urlParams.get('from') || 'Pierre';

  const authorElement = document.getElementById('prank-author');
  if (authorElement && authorName) {
    authorElement.textContent = authorName;
  }

  // 3. Bouton WhatsApp avec message pré-rempli hilarant
  const whatsappBtn = document.getElementById('whatsapp-btn');
  if (whatsappBtn) {
    let waText = `J'ai cliqué sur ton faux mercato du Havre AC ${authorName}... J'ai trop le seum, tu m'as bien eue avec le Rickroll ! 😂😭`;
    if (friendName) {
      waText = `C'est ${friendName} ! J'ai cliqué sur ton lien du HAC... T'es un grand malade ${authorName}, j'ai trop le seum 😂😭`;
    }
    whatsappBtn.href = `https://api.whatsapp.com/send?text=${encodeURIComponent(waText)}`;
  }

  // 4. Déclenchement du Prank au clic sur le bouton "Play"
  const startBtn = document.getElementById('start-prank-btn');
  const fakePlayer = document.getElementById('fake-player');
  const rickrollPlayer = document.getElementById('rickroll-player');
  const videoEmbedBox = document.getElementById('video-embed-box');
  const trollReveal = document.getElementById('troll-reveal');

  let prankStarted = false;

  function launchRickroll() {
    if (prankStarted) return;
    prankStarted = true;

    // A. Bruitage d'alerte immédiat via Web Audio API (aucun lag réseau)
    playHypeFanfare();

    // B. Masquer le faux lecteur et afficher le Rickroll
    fakePlayer.classList.add('hidden');
    rickrollPlayer.classList.remove('hidden');
    trollReveal.classList.remove('hidden');

    // C. Injecter l'Iframe YouTube officielle avec autoplay actif
    // L'interaction de clic autorise l'autoplay avec le son à 100%
    videoEmbedBox.innerHTML = `
      <iframe 
        src="https://www.youtube-nocookie.com/embed/dQw4w9WgXcQ?autoplay=1&mute=0&controls=1&rel=0&playsinline=1" 
        title="Rick Astley - Never Gonna Give You Up" 
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
        allowfullscreen>
      </iframe>
    `;

    // D. Explosion de confettis aux couleurs Ciel et Marine
    fireHACConfetti();

    // E. Faire défiler légèrement la page pour bien cadrer le Rickroll
    setTimeout(() => {
      rickrollPlayer.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }, 200);
  }

  if (startBtn) {
    startBtn.addEventListener('click', launchRickroll);
  }

  if (fakePlayer) {
    fakePlayer.addEventListener('click', launchRickroll);
  }

  // 5. Bouton copier le lien pour piéger d'autres personnes
  const shareBtn = document.getElementById('share-link-btn');
  if (shareBtn) {
    shareBtn.addEventListener('click', () => {
      navigator.clipboard.writeText(window.location.href).then(() => {
        const originalText = shareBtn.textContent;
        shareBtn.textContent = '✅ Lien copié ! Envoie-le sur WhatsApp';
        shareBtn.style.background = 'rgba(92, 198, 246, 0.3)';
        shareBtn.style.borderColor = '#5cc6f6';
        setTimeout(() => {
          shareBtn.textContent = originalText;
          shareBtn.style.background = '';
          shareBtn.style.borderColor = '';
        }, 3000);
      }).catch(() => {
        alert('Lien : ' + window.location.href);
      });
    });
  }

  // ------------------------------------------------------------------------
  // Effet Audio Synthétisé (Fanfare 80s punchy instantanée)
  // ------------------------------------------------------------------------
  function playHypeFanfare() {
    try {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      if (!AudioContext) return;
      const ctx = new AudioContext();

      // Fréquences des notes d'ouverture (Never Gonna Give You Up intro vibe)
      const notes = [293.66, 329.63, 392.00, 329.63, 493.88, 440.00];
      const durations = [0.12, 0.12, 0.15, 0.12, 0.25, 0.35];
      let startTime = ctx.currentTime + 0.05;

      notes.forEach((freq, idx) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(freq, startTime);

        gain.gain.setValueAtTime(0.18, startTime);
        gain.gain.exponentialRampToValueAtTime(0.001, startTime + durations[idx]);

        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.start(startTime);
        osc.stop(startTime + durations[idx]);
        startTime += durations[idx] + 0.04;
      });
    } catch (e) {
      console.log('Audio init skipped', e);
    }
  }

  // ------------------------------------------------------------------------
  // Moteur de Confettis Ciel & Marine (Canvas pur, zéro librairie)
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

    const colors = ['#5cc6f6', '#38bdf8', '#081b33', '#ffffff', '#facc15'];
    const particles = [];
    const count = 120;

    for (let i = 0; i < count; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * -canvas.height,
        size: Math.random() * 9 + 5,
        color: colors[Math.floor(Math.random() * colors.length)],
        speedY: Math.random() * 5 + 3,
        speedX: Math.random() * 4 - 2,
        rotation: Math.random() * 360,
        rotSpeed: Math.random() * 8 - 4,
        opacity: 1
      });
    }

    let animationFrame;
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
        animationFrame = requestAnimationFrame(render);
      } else {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
      }
    }

    render();
  }
});
