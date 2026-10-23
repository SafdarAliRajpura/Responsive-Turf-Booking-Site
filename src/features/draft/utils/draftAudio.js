/**
 * Web Audio API Synthesizer for Turf Draft Room
 * Synthesizes stadium sound effects purely in code:
 * - Coin Flip spin & clink
 * - Referee Matchday Whistle
 * - 15-Second Draft Clock Tick
 * - Draft Pick Confirmed Buzzer
 * - Stadium Horn Fanfare
 * Zero external audio files required, 100% reliable across browsers.
 */

class DraftAudioManager {
    constructor() {
        this.ctx = null;
        this.isMuted = false;
    }

    _init() {
        if (!this.ctx && typeof window !== 'undefined') {
            const AudioContext = window.AudioContext || window.webkitAudioContext;
            if (AudioContext) {
                this.ctx = new AudioContext();
            }
        }
        if (this.ctx && this.ctx.state === 'suspended') {
            this.ctx.resume();
        }
    }

    toggleMute() {
        this.isMuted = !this.isMuted;
        return this.isMuted;
    }

    // 1. Realistic Metallic Coin Flip Sound
    playCoinFlip() {
        if (this.isMuted) return;
        this._init();
        if (!this.ctx) return;

        const now = this.ctx.currentTime;
        const count = 7;
        for (let i = 0; i < count; i++) {
            const osc = this.ctx.createOscillator();
            const gain = this.ctx.createGain();

            osc.type = 'triangle';
            osc.frequency.setValueAtTime(1400 + (i * 120), now + (i * 0.08));

            gain.gain.setValueAtTime(0.2, now + (i * 0.08));
            gain.gain.exponentialRampToValueAtTime(0.001, now + (i * 0.08) + 0.07);

            osc.connect(gain);
            gain.connect(this.ctx.destination);

            osc.start(now + (i * 0.08));
            osc.stop(now + (i * 0.08) + 0.07);
        }

        // Final metallic landing clink
        setTimeout(() => {
            if (this.ctx) {
                const landingOsc = this.ctx.createOscillator();
                const landingGain = this.ctx.createGain();
                landingOsc.type = 'sine';
                landingOsc.frequency.setValueAtTime(2200, this.ctx.currentTime);
                landingGain.gain.setValueAtTime(0.35, this.ctx.currentTime);
                landingGain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.25);
                landingOsc.connect(landingGain);
                landingGain.connect(this.ctx.destination);
                landingOsc.start();
                landingOsc.stop(this.ctx.currentTime + 0.25);
            }
        }, 650);
    }

    // 2. Referee Matchday Whistle
    playWhistle() {
        if (this.isMuted) return;
        this._init();
        if (!this.ctx) return;

        const now = this.ctx.currentTime;
        const osc1 = this.ctx.createOscillator();
        const osc2 = this.ctx.createOscillator();
        const gain = this.ctx.createGain();

        osc1.type = 'triangle';
        osc2.type = 'sine';
        osc1.frequency.setValueAtTime(2600, now);
        osc2.frequency.setValueAtTime(2650, now);

        gain.gain.setValueAtTime(0.01, now);
        gain.gain.linearRampToValueAtTime(0.3, now + 0.05);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.45);

        osc1.connect(gain);
        osc2.connect(gain);
        gain.connect(this.ctx.destination);

        osc1.start(now);
        osc2.start(now);
        osc1.stop(now + 0.45);
        osc2.stop(now + 0.45);
    }

    // 3. Draft Clock Tick (Heartbeat/Countdown effect)
    playClockTick(isUrgent = false) {
        if (this.isMuted) return;
        this._init();
        if (!this.ctx) return;

        const now = this.ctx.currentTime;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();

        osc.type = 'sine';
        osc.frequency.setValueAtTime(isUrgent ? 950 : 600, now);

        gain.gain.setValueAtTime(isUrgent ? 0.25 : 0.12, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.06);

        osc.connect(gain);
        gain.connect(this.ctx.destination);

        osc.start(now);
        osc.stop(now + 0.06);
    }

    // 4. IPL/NBA Style Draft Pick Confirmed Buzzer
    playPickBuzzer() {
        if (this.isMuted) return;
        this._init();
        if (!this.ctx) return;

        const now = this.ctx.currentTime;
        const notes = [440, 554.37, 659.25]; // A Major chime
        notes.forEach((freq, idx) => {
            const osc = this.ctx.createOscillator();
            const gain = this.ctx.createGain();

            osc.type = 'triangle';
            osc.frequency.setValueAtTime(freq, now + (idx * 0.07));

            gain.gain.setValueAtTime(0.25, now + (idx * 0.07));
            gain.gain.exponentialRampToValueAtTime(0.001, now + (idx * 0.07) + 0.35);

            osc.connect(gain);
            gain.connect(this.ctx.destination);

            osc.start(now + (idx * 0.07));
            osc.stop(now + (idx * 0.07) + 0.35);
        });
    }

    // 5. Stadium Horn & Victory Fanfare
    playFanfare() {
        if (this.isMuted) return;
        this._init();
        if (!this.ctx) return;

        const now = this.ctx.currentTime;
        const chords = [523.25, 659.25, 783.99, 1046.50]; // C Major Fanfare
        chords.forEach((freq) => {
            const osc = this.ctx.createOscillator();
            const gain = this.ctx.createGain();

            osc.type = 'sawtooth';
            osc.frequency.setValueAtTime(freq, now);

            gain.gain.setValueAtTime(0.12, now);
            gain.gain.linearRampToValueAtTime(0.2, now + 0.2);
            gain.gain.exponentialRampToValueAtTime(0.001, now + 1.2);

            osc.connect(gain);
            gain.connect(this.ctx.destination);

            osc.start(now);
            osc.stop(now + 1.2);
        });
    }
}

export const draftAudio = new DraftAudioManager();
