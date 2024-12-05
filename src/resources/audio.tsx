import { AudioSource } from "@/utils/audio/audio-source";

const ButtonClickSfx = new AudioSource("/assets/audio/button_click.mp3", "SoundEffect");
const ErrorSfx = new AudioSource("/assets/audio/error.mp3", "SoundEffect");
const SorcMsc = new AudioSource("/assets/audio/sorc.mp3", "Music");

export {
    ButtonClickSfx,
    ErrorSfx,
    SorcMsc,
};