/**
 * Web Audio API synthesizer for friendly, non-intrusive cognitive test feedback
 */

class SoundSystem {
  private ctx: AudioContext | null = null;
  public muted: boolean = false;

  private initCtx() {
    if (!this.ctx && typeof window !== 'undefined') {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  public playTone(freq: number, duration: number = 0.12, type: OscillatorType = 'sine', volume: number = 0.15) {
    if (this.muted) return;
    try {
      this.initCtx();
      if (!this.ctx) return;

      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = type;
      osc.frequency.setValueAtTime(freq, this.ctx.currentTime);

      gain.gain.setValueAtTime(volume, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.0001, this.ctx.currentTime + duration);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start();
      osc.stop(this.ctx.currentTime + duration);
    } catch {
      // Audio autoplay policy fallback
    }
  }

  public playSuccess() {
    this.playTone(523.25, 0.1, 'sine', 0.15); // C5
    setTimeout(() => this.playTone(659.25, 0.18, 'sine', 0.12), 100); // E5
  }

  public playSoftError() {
    this.playTone(220, 0.15, 'triangle', 0.1);
  }

  public playBlockTone(index: number) {
    const freqs = [329.63, 392.00, 440.00, 493.88, 523.25, 587.33, 659.25, 698.46, 783.99];
    const freq = freqs[index % freqs.length] || 440;
    this.playTone(freq, 0.15, 'sine', 0.18);
  }

  public playFanfare() {
    if (this.muted) return;
    const notes = [440, 554.37, 659.25, 880];
    notes.forEach((freq, idx) => {
      setTimeout(() => this.playTone(freq, 0.18, 'sine', 0.15), idx * 110);
    });
  }
}

export const sound = new SoundSystem();
