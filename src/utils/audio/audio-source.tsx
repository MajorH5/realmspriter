export type AudioSourceType = InstanceType<typeof AudioSource>;

export type AudioType = "Music" | "SoundEffect";

export const AudioSource = (function () {
    return class AudioSource {
        private src: string;
        private audioType: AudioType;
        private buffer: AudioBuffer | null;
        private loaded: boolean;
        private loading: boolean;

        // class for managing audio data
        constructor(src: string, audioType: AudioType) {
            this.src = src;
            this.audioType = audioType;
            this.buffer = null;
            this.loaded = false;
            this.loading = false;
        }

        // loads in the audio data
        // from the given source
        async load() {
            if (this.loaded || this.loading) return;

            this.loading = true;
            this.buffer = await fetch(this.src)
                .then(response => response.arrayBuffer())
                .then(buffer => {
                    this.loaded = true;
                    const context = new AudioContext();
                    return context.decodeAudioData(buffer)
                })
                .catch(e => {
                    console.error(`There was an error loading sound ${this.src}\n\t${e}`);
                    return null;
                });
        }

        // returns the type of this audio
        getAudioType() {
            return this.audioType;
        }

        // returns true if the audio
        // data has been loaded
        isLoaded() {
            return this.buffer !== null && this.loaded;
        }

        // returns true if the audio
        // data is currently loading
        isLoading() {
            return this.loading;
        }

        // returns the audio data
        getBuffer() {
            return this.buffer;
        }

        // returns the audio source
        getAudioSource() {
            return this.src;
        }
    }
})();