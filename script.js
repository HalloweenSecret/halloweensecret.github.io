(() => {
  const screens = [...document.querySelectorAll('.screen')];
  const normalize = value => String(value ?? '').trim().toUpperCase().replace(/\s+/g, '').normalize('NFD').replace(/[\u0300-\u036f]/g, '');
  let current = 0;

  const show = id => {
    screens.forEach(screen => screen.classList.remove('active'));
    const next = document.getElementById(id);
    if (next) next.classList.add('active');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const stopAudio = () => document.querySelectorAll('audio').forEach(audio => {
    audio.pause();
    audio.currentTime = 0;
  });

  const playAudioFor = id => {
    const screen = document.getElementById(id);
    const audio = screen?.querySelector('audio');
    if (!audio) return;
    stopAudio();
    const attempt = audio.play();
    if (attempt && attempt.catch) attempt.catch(() => {});
  };

  const feedback = (screen, message, ok = false) => {
    const box = screen.querySelector('.feedback');
    if (!box) return;
    box.textContent = message;
    box.className = `feedback${ok ? ' success' : ''}`;
  };

  const advance = () => {
    current += 1;
    if (current <= 5) show(`enigma-${current}`);
    else show('finale');
  };

  document.getElementById('enterButton')?.addEventListener('click', () => {
    current = 1;
    show('enigma-1');
    playAudioFor('enigma-1');
  });

  document.querySelectorAll('.back-button').forEach(button => {
    button.addEventListener('click', () => {
      const target = Number(button.dataset.back);
      if (target <= 0) {
        current = 0;
        show('intro');
      } else {
        current = target;
        show(`enigma-${target}`);
      }
    });
  });

  document.querySelectorAll('.answer-form').forEach(form => {
    form.addEventListener('submit', event => {
      event.preventDefault();
      const screen = form.closest('.screen');
      const value = normalize(form.querySelector('input')?.value);
      const expected = normalize(form.dataset.answer);
      if (value === expected) {
        feedback(screen, '✓ Il sigillo ha riconosciuto la risposta.', true);
        setTimeout(() => {
          advance();
          if (current <= 5) playAudioFor(`enigma-${current}`);
          else playAudioFor('finale');
        }, 650);
      } else {
        feedback(screen, '✕ Non è la chiave. Riprova.');
      }
    });
  });

  const choiceHandler = selector => {
    document.querySelectorAll(selector).forEach(button => {
      button.addEventListener('click', () => {
        const screen = button.closest('.screen');
        if (screen.dataset.completed === 'true') return;
        document.querySelectorAll(`${selector}.selected`).forEach(item => item.classList.remove('selected'));
        button.classList.add('selected');
        if (button.dataset.answer === 'YES') {
          screen.dataset.completed = 'true';
          feedback(screen, '✓ Il sigillo ha riconosciuto la risposta.', true);
          setTimeout(() => {
            advance();
            if (current <= 5) playAudioFor(`enigma-${current}`);
            else playAudioFor('finale');
          }, 650);
        } else {
          feedback(screen, '✕ Questa non è la risposta.');
        }
      });
    });
  };

  choiceHandler('.symbol-choice');

  // Interactive five-door finale puzzle.
  document.querySelectorAll('.door-choice').forEach(button => {
    button.addEventListener('click', () => {
      const screen = button.closest('.screen');
      if (screen.dataset.completed === 'true') return;
      if (button.dataset.answer === 'YES') {
        screen.dataset.completed = 'true';
        button.classList.add('door-open');
        feedback(screen, 'LA PORTA SI APRE.', true);
        playAudioFor('finale');
        setTimeout(() => {
          current = 6;
          show('finale');
        }, 1000);
      } else {
        button.classList.remove('door-wrong');
        void button.offsetWidth;
        button.classList.add('door-wrong');
        feedback(screen, 'La porta resta chiusa.');
        setTimeout(() => button.classList.remove('door-wrong'), 500);
      }
    });
  });

  const address = 'Via Cadolino 6, Nettuno';
  const mapButton = document.getElementById('mapButton');
  if (mapButton) {
    mapButton.href = `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(address)}`;
  }

  document.getElementById('copyAddress')?.addEventListener('click', async () => {
    const status = document.getElementById('copyStatus');
    try {
      await navigator.clipboard.writeText(`${address} — ore 22:00`);
      if (status) status.textContent = '✓ INDIRIZZO COPIATO';
    } catch {
      if (status) status.textContent = `${address} — ore 22:00`;
    }
  });
})();
