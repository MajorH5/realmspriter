import { AudioSourceType } from "./audio-source";

import Event from "../event";

export type AudioObjectType = InstanceType<typeof AudioObject>;

export class AudioObject {
    private audioSource: AudioSourceType
    private audioContext: AudioContext;
    private buffer: AudioBuffer | null;
    private playbackRate: number;
    private volume: number;
    private loop: boolean;
    private isMuted: boolean;
    private source: AudioBufferSourceNode;
    private gainNode: GainNode;
    private playing: boolean;
    private completed: boolean;
    public played: Event;
    public stopped: Event;

    constructor(audioSource: AudioSourceType, audioContext: AudioContext) {
        this.audioSource = audioSource;
        this.audioContext = audioContext;
        this.buffer = audioSource.getBuffer();

        this.playbackRate = 1;
        this.volume = 1;
        this.loop = false;
        this.isMuted = false;

        // source -> gain -> audioContext -> destination
        this.source = this.audioContext.createBufferSource();
        this.source.loop = this.loop;
        this.source.buffer = this.buffer;
        this.source.playbackRate.value = this.playbackRate;
        this.gainNode = this.audioContext.createGain();
        this.gainNode.gain.value = this.volume;

        this.source.connect(this.gainNode);
        this.gainNode.connect(this.audioContext.destination);

        this.playing = false;
        this.completed = false;

        this.played = new Event();
        this.stopped = new Event();

        this.source.addEventListener('ended', () => {
            this.completed = true;
            this.stopped.trigger();
        });
    }

    // plays the audio from the beginning
    async play(timePosition: number) {
        if (this.playing || this.completed) return;

        if (!this.audioSource.isLoaded() && !this.audioSource.isLoading()) {
            // it was never preloaded, but we'll just go ahead and do that now
            await this.audioSource.load();

            if (this.audioSource.isLoaded()) {
                this.buffer = this.audioSource.getBuffer();
                this.source.buffer = this.buffer;
            }
        }

        this.source.start(0, timePosition);
        this.playing = true;
        this.played.trigger();
    }

    // pauses the audio at the current position
    pause() {
        if (!this.playing || this.completed) return;

        this.source.stop();
        this.playing = false;
        this.stopped.trigger();
    }

    // resumes the audio from the current position
    resume() {
        if (this.playing || this.completed) return;

        this.audioContext.resume();
        this.playing = true;
        this.played.trigger();
    }

    // temporarily mutes the audio object
    mute() {
        this.gainNode.gain.value = 0;
        this.isMuted = true;
    }

    // unmutes the audio object
    unmute() {
        this.gainNode.gain.value = this.volume;
        this.isMuted = false;
    }

    // returns true if the audio is a sound effect
    isSfx() {
        return this.audioSource.getAudioType() === "SoundEffect";
    }

    // returns true if the audio is currently playing
    isPlaying() {
        return this.playing;
    }

    // sets the loop property of the audio
    setLoop(loop: boolean) {
        this.loop = loop;
        this.source.loop = loop;
    }

    // returns the actual volume of the audio
    getVolume() {
        return this.isMuted ? 0 : this.volume;
    }

    // sets the volume of the audio
    setVolume(volume: number) {
        this.volume = volume;

        if (!this.isMuted) {
            this.gainNode.gain.value = volume;
        }
    }

    // sets the playback rate of the audio
    setPlaybackRate(playbackRate: number) {
        this.playbackRate = playbackRate;
        this.source.playbackRate.value = playbackRate;
    }

    // returns the audio source for this audio object
    getAudioSource () {
        return this.audioSource;
    }
};