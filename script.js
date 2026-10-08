(() => {
  const screens = [...document.querySelectorAll('.screen')];
  const normalize = v => String(v ?? '').trim().toUpperCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
  let current = 1;

  const show = id => {
    screens.forEach(s => s.classList.remove('active'));
    const next = document.getElementById(id);
    if (next) next.classList.add('active');
    window.scrollTo({top: 0, behavior: 'smooth'});
  };

  const stopAllAudio = () => {
    document.querySelectorAll('audio').forEach(audio => {
      audio.pause();
      audio.currentTime = 0;
    });
  };

  const playAudioFor = id => {
    const screen = document.getElementById(id);
    if (!screen) return;
    const audio = screen.querySelector('audio');
    if (!audio) return;

    stopAllAudio();
    audio.volume = 1;
    audio.currentTime = 0;

    const promise = audio.play();
    if (promise && typeof promise.catch === 'function') {
      promise.catch(() => {});
    }
  };

  const feedback = (screen, message, ok = false) => {
    const box = screen.querySelector('.feedback');
    if (!box) return;
    box.textContent = message;
    box.className = `feedback${ok ? ' success' : ''}`;
  };

  const nextScreenId = () => current < 5 ? `enigma-${current + 1}` : 'finale';

  const advance = () => {
    if (current < 5) {
      current += 1;
      show(`enigma-${current}`);
    } else {
      show('finale');
    }
  };

  document.getElementById('enterButton').addEventListener('click', () => {
    current = 1;
    show('enigma-1');
    playAudioFor('enigma-1');
  });

  document.querySelectorAll('.answer-form').forEach(form => {
    form.addEventListener('submit', e => {
      e.preventDefault();
      const screen = form.closest('.screen');
      const value = normalize(form.querySelector('input').value);
      const expected = normalize(form.dataset.answer);

      if (value === expected) {
        feedback(screen, '✓ Il sigillo ha riconosciuto la risposta.', true);
        playAudioFor(nextScreenId());
        setTimeout(advance, 650);
      } else {
        feedback(screen, '✕ Non è la chiave. Riprova.');
      }
    });
  });

  document.querySelectorAll('.hint-button').forEach(button => {
    button.addEventListener('click', () => {
      const hint = document.getElementById(button.dataset.hint);
      if (!hint) return;
      hint.classList.toggle('hidden');
      button.textContent = hint.classList.contains('hidden')
        ? 'MOSTRA INDIZIO' : 'NASCONDI INDIZIO';
    });
  });

  const choiceHandler = selector => {
    document.querySelectorAll(selector).forEach(button => {
      button.addEventListener('click', () => {
        const screen = button.closest('.screen');
        document.querySelectorAll(`${selector}.selected`)
          .forEach(x => x.classList.remove('selected'));
        button.classList.add('selected');

        if (button.dataset.answer === 'YES') {
          feedback(screen, '✓ Il sigillo ha riconosciuto il frammento.', true);
          playAudioFor(nextScreenId());
          setTimeout(advance, 650);
        } else {
          feedback(screen, '✕ Questo simbolo non appartiene alla verità.');
        }
      });
    });
  };

  choiceHandler('.symbol-choice');
  choiceHandler('.fragment-choice');
  choiceHandler('.shadow-choice');
  choiceHandler('.candle-choice');

  const address = 'Via Cadolino 6, Nettuno';
  const mapButton = document.getElementById('mapButton');
  if (mapButton) {
    mapButton.href =
      `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(address)}`;
  }

  const copyButton = document.getElementById('copyAddress');
  if (copyButton) {
    copyButton.addEventListener('click', async () => {
      const status = document.getElementById('copyStatus');
      try {
        await navigator.clipboard.writeText(`${address} — ore 22:00`);
        status.textContent = '✓ INDIRIZZO COPIATO';
      } catch {
        status.textContent = address + ' — ore 22:00';
      }
    });
  }
})();
