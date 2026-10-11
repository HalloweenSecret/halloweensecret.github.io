(() => {
  'use strict';

  const ids = ['intro', 'enigma-1', 'enigma-2', 'enigma-3', 'enigma-4', 'enigma-5', 'finale'];
  const screens = ids.map(id => document.getElementById(id)).filter(Boolean);
  const normalize = value => String(value ?? '').trim().toUpperCase().replace(/\s+/g, '');
  const solved = new Set();
  let current = 0;
  let advanceTimer = null;

  const feedback = (screen, message, success = false) => {
    const element = screen?.querySelector('.feedback');
    if (!element) return;
    element.textContent = message;
    element.classList.toggle('success', success);
    element.setAttribute('role', 'status');
  };

  const show = id => {
    const targetIndex = ids.indexOf(id);
    if (targetIndex < 0) return;
    current = targetIndex;
    screens.forEach(screen => screen.classList.toggle('active', screen.id === id));
    document.querySelectorAll('.back-button').forEach(button => {
      button.hidden = current <= 1 || current === ids.length - 1;
    });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const advance = () => {
    if (current >= 1 && current <= 5) solved.add(current);
    if (current < ids.length - 1) show(ids[current + 1]);
  };

  const advanceSoon = () => {
    window.clearTimeout(advanceTimer);
    advanceTimer = window.setTimeout(advance, 550);
  };

  // Navigation back keeps typed answers and already completed choices intact.
  screens.forEach(screen => {
    if (screen.id === 'intro' || screen.id === 'finale') return;
    if (screen.querySelector('.back-button')) return;
    const button = document.createElement('button');
    button.className = 'back-button secondary';
    button.type = 'button';
    button.textContent = '← TORNA INDIETRO';
    button.addEventListener('click', () => {
      const index = ids.indexOf(screen.id);
      if (index > 1) show(ids[index - 1]);
    });
    screen.prepend(button);
  });

  document.getElementById('enterButton')?.addEventListener('click', () => show('enigma-1'));

  // Validate by screen ID, not by form position (the previous version broke here).
  const expectedByScreen = {
    'enigma-1': 'M',
    'enigma-2': '7',
    'enigma-4': 'M7V'
  };
  document.querySelectorAll('.answer-form').forEach(form => {
    form.addEventListener('submit', event => {
      event.preventDefault();
      const screen = form.closest('.screen');
      const expected = expectedByScreen[screen?.id];
      const input = form.querySelector('input');
      const submit = form.querySelector('button[type="submit"], button:not([type])');
      if (!expected || !input) {
        feedback(screen, 'Questa risposta non è configurata. Riprova tra poco.');
        return;
      }
      if (normalize(input.value) === normalize(expected)) {
        feedback(screen, '✓ Il sigillo ha riconosciuto la risposta.', true);
        input.disabled = true;
        if (submit) submit.disabled = true;
        advanceSoon();
      } else {
        feedback(screen, '✕ Non è la chiave. Riprova.');
        input.focus();
        input.select?.();
      }
    });
  });

  const selectChoice = (button, selector) => {
    const screen = button.closest('.screen');
    if (!screen || button.disabled) return;
    screen.querySelectorAll(`${selector}.selected`).forEach(item => item.classList.remove('selected'));
    button.classList.add('selected');
    if (button.dataset.answer === 'YES') {
      feedback(screen, '✓ Il sigillo ha riconosciuto il segno.', true);
      screen.querySelectorAll(selector).forEach(item => { item.disabled = true; });
      advanceSoon();
    } else {
      feedback(screen, '✕ Questo non è il segno corretto. Riprova.');
    }
  };

  document.querySelectorAll('.symbol-choice').forEach(button => {
    button.addEventListener('click', () => selectChoice(button, '.symbol-choice'));
  });
  document.querySelectorAll('.door-choice').forEach(button => {
    button.addEventListener('click', () => selectChoice(button, '.door-choice'));
  });

  // The candle works with tap, keyboard, mouse and touch.
  const candle = document.getElementById('hiddenCandle');
  const inscription = document.getElementById('hiddenInscription');
  const revealInscription = () => {
    candle?.classList.add('moved');
    inscription?.classList.add('revealed');
    candle?.closest('.screen')?.classList.add('candle-unlocked');
  };
  if (candle && inscription) {
    candle.addEventListener('click', revealInscription);
    candle.addEventListener('keydown', event => {
      if (event.key === 'Enter' || event.key === ' ') {
        event.preventDefault();
        revealInscription();
      }
    });
  }

  // If an audio file has not been copied into /audio, hide only that player's controls.
  document.querySelectorAll('audio').forEach(player => {
    player.addEventListener('error', () => { player.hidden = true; });
    const source = player.querySelector('source');
    if (source) {
      player.addEventListener('loadedmetadata', () => { player.hidden = false; }, { once: true });
    }
  });

  const address = 'Via Cadolino 6, Nettuno';
  const mapButton = document.getElementById('mapButton');
  if (mapButton) {
    mapButton.href = `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(address)}`;
  }
  document.getElementById('copyAddress')?.addEventListener('click', async () => {
    const status = document.getElementById('copyStatus');
    const text = `${address} — ore 22:00`;
    try {
      await navigator.clipboard.writeText(text);
      if (status) status.textContent = '✓ INDIRIZZO COPIATO';
    } catch (_) {
      if (status) status.textContent = `Seleziona e copia: ${text}`;
    }
  });
})();
