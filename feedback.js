
(() => {
  let audioContext = null;
  let lastFeedbackAt = 0;

  function getAudioContext() {
    const AudioContextClass = window.AudioContext || window.webkitAudioContext;

    if (!AudioContextClass) {
      return null;
    }

    if (!audioContext) {
      audioContext = new AudioContextClass();
    }

    if (audioContext.state === "suspended") {
      audioContext.resume().catch(() => { });
    }

    return audioContext;
  }

  function playClickTone({
    frequency = 520,
    duration = 0.035,
    volume = 0.025,
    type = "triangle"
  } = {}) {
    const context = getAudioContext();

    if (!context) {
      return;
    }

    const now = context.currentTime;
    const oscillator = context.createOscillator();
    const gainNode = context.createGain();

    oscillator.type = type;
    oscillator.frequency.setValueAtTime(frequency, now);
    oscillator.frequency.exponentialRampToValueAtTime(Math.max(frequency * 0.82, 120), now + duration);

    gainNode.gain.setValueAtTime(0.001, now);
    gainNode.gain.exponentialRampToValueAtTime(volume, now + 0.01);
    gainNode.gain.exponentialRampToValueAtTime(0.001, now + duration);

    oscillator.connect(gainNode);
    gainNode.connect(context.destination);
    oscillator.start(now);
    oscillator.stop(now + duration + 0.01);
  }

  function vibrate(pattern) {
    if (typeof navigator.vibrate === "function") {
      navigator.vibrate(pattern);
    }
  }

  function triggerFeedback(options = {}) {
    const now = Date.now();

    if (now - lastFeedbackAt < 45) {
      return;
    }

    lastFeedbackAt = now;
    playClickTone(options.sound);
    vibrate(options.vibration || 10);
  }

  document.addEventListener(
    "click",
    (event) => {
      const interactiveTarget = event.target.closest(
        'a, button, [role="button"], input[type="submit"], input[type="button"], input[type="reset"], select'
      );

      if (!interactiveTarget || interactiveTarget.disabled) {
        return;
      }

      triggerFeedback();
    },
    true
  );

  window.triggerUiFeedback = triggerFeedback;
})();
