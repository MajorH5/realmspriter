import { AudioSource } from "@/utils/audio/audio-source";

const ButtonClickSfx = new AudioSource("/audio/button_click.mp3", "SoundEffect");
const ErrorSfx = new AudioSource("/audio/error.mp3", "SoundEffect");
const SorcMsc = new AudioSource("/audio/sorc.mp3", "Music");

export {
    ButtonClickSfx,
    ErrorSfx,
    SorcMsc,
};