let audioContext;

export const primeChatAudio = () => {
  const AudioContextClass = window.AudioContext || window.webkitAudioContext;
  if (!AudioContextClass) return;
  audioContext ??= new AudioContextClass();
  if (audioContext.state === 'suspended') void audioContext.resume();
};

export const playChatSound = (kind) => {
  const AudioContextClass = window.AudioContext || window.webkitAudioContext;
  if (!AudioContextClass) return;
  audioContext ??= new AudioContextClass();
  if (audioContext.state === 'suspended') void audioContext.resume();

  const notes = {
    login: [523.25, 783.99],
    logout: [783.99, 523.25],
    send: [659.25],
    receive: [880, 1174.66],
  };
  const frequencies = notes[kind] || notes.send;
  frequencies.forEach((frequency, index) => {
    const oscillator = audioContext.createOscillator();
    const volume = audioContext.createGain();
    const startAt = audioContext.currentTime + index * 0.075;
    oscillator.type = 'sine';
    oscillator.frequency.setValueAtTime(frequency, startAt);
    volume.gain.setValueAtTime(0.0001, startAt);
    volume.gain.exponentialRampToValueAtTime(0.045, startAt + 0.015);
    volume.gain.exponentialRampToValueAtTime(0.0001, startAt + 0.16);
    oscillator.connect(volume);
    volume.connect(audioContext.destination);
    oscillator.start(startAt);
    oscillator.stop(startAt + 0.17);
  });
};
