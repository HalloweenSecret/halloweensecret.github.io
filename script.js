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

  const feedback = (screen, message, ok = false) => {
    const box = screen.querySelector('.feedback');
    if (!box) return;
    box.textContent = message;
    box.className = `feedback${ok ? ' success' : ''}`;
  };

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
  });

  document.querySelectorAll('.answer-form').forEach(form => {
    form.addEventListener('submit', e => {
      e.preventDefault();
      const screen = form.closest('.screen');
      const value = normalize(form.querySelector('input').value);
      const expected = normalize(form.dataset.answer);
      if (value === expected) {
        feedback(screen, '✓ Il sigillo ha riconosciuto la risposta.', true);
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
      button.textContent = hint.classList.contains('hidden') ? 'MOSTRA INDIZIO' : 'NASCONDI INDIZIO';
    });
  });

  const choiceHandler = selector => {
    document.querySelectorAll(selector).forEach(button => {
      button.addEventListener('click', () => {
        const screen = button.closest('.screen');
        document.querySelectorAll(`${selector}.selected`).forEach(x => x.classList.remove('selected'));
        button.classList.add('selected');
        const correct = button.dataset.answer === 'YES';
        if (correct) {
          feedback(screen, '✓ Il sigillo ha riconosciuto il frammento.', true);
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
  mapButton.href = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(address)}`;

  document.getElementById('copyAddress').addEventListener('click', async () => {
    const status = document.getElementById('copyStatus');
    try {
      await navigator.clipboard.writeText(`${address} — ore 22:00`);
      status.textContent = '✓ INDIRIZZO COPIATO';
    } catch {
      status.textContent = address + ' — ore 22:00';
    }
  });
})();
