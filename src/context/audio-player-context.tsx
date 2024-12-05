"use client";

import React, { createContext, useState, useEffect, useContext } from "react";
import { AudioObject, AudioObjectType } from "@/utils/audio/audio-object";
import { AudioSource, AudioSourceType } from "@/utils/audio/audio-source";

const MUSIC_DEFAULT_VOLUME = 0.25;
const SFX_DEFAULT_VOLUME = 0.25;

export type AudioPlayerType = {
  sfxContext: AudioContext | null;
  musicContext: AudioContext | null;
  globalVolume: number;
  userSfxEnabled: boolean;
  userMusicEnabled: boolean;
  currentTheme: AudioObjectType | null;
  activeSounds: AudioObjectType[];

  preloadAll: (
    sounds: AudioSourceType[],
    callback: (loaded: number, total: number) => void
  ) => Promise<void[]>;

  playSfx: (
    audioSource: AudioSourceType,
    volume?: number,
    rate?: number
  ) => Promise<AudioObject | undefined>;

  playTheme: (
    audioSource: AudioSourceType,
    volume?: number,
    loops?: boolean,
    timePosition?: number
  ) => Promise<AudioObject | undefined>;

  setGlobalVolume: (volume: number) => void;
  stopTheme: (fade?: number) => void;
  suspendActiveObjects: () => void;
  muteSfx: () => void;
  unmuteSfx: () => void;
  muteMusic: () => void;
  unmuteMusic: () => void;
};

const AudioPlayerContext = createContext<AudioPlayerType | undefined>(undefined);

export const AudioPlayerProvider = ({ children }: { children: React.ReactNode }) => {
  const [sfxContext, setSfxContext] = useState<AudioContext | null>(null);
  const [musicContext, setMusicContext] = useState<AudioContext | null>(null);

  const [userInteracted, setUserInteracted] = useState(false);

  const [globalVolume, setGlobalVolume] = useState(1);
  const [userSfxEnabled, setUserSfxEnabled] = useState(true);
  const [userMusicEnabled, setUserMusicEnabled] = useState(true);

  const [currentTheme, setCurrentTheme] = useState<AudioObjectType | null>(null);
  const [activeSounds, setActiveSounds] = useState<AudioObjectType[]>([]);

  useEffect(() => {
    const handleUserInteraction = () => {
      setUserInteracted(true);
    };

    if (typeof window !== "undefined") {
      window.addEventListener("click", handleUserInteraction, { once: true });
      window.addEventListener("keydown", handleUserInteraction, { once: true });
      window.addEventListener("touchstart", handleUserInteraction, { once: true });
    }
  }, []);

  useEffect(() => {
    if (sfxContext !== null || musicContext !== null) {
      return;
    }

    if (userInteracted && typeof window !== "undefined") {
      const sfxCtx = new AudioContext();
      const musicCtx = new AudioContext();

      setSfxContext(sfxCtx);
      setMusicContext(musicCtx);

      return () => {
        sfxCtx.close();
        musicCtx.close();
      };
    }
  }, [userInteracted]);

  const preloadAll = async (
    sounds: AudioSourceType[],
    callback: (loaded: number, total: number) => void
  ) => {
    if (sfxContext === null || musicContext === null) {
      console.error("Audio preload failed because audiocontext has not yet been loaded.")
      return;
    }

    let totalLoaded = 0;

    let promises = sounds
      .filter((sound) => sound instanceof AudioSource)
      .map((sound) => sound.load());

    if (callback) {
      promises.forEach((promise) => {
        promise.then(() => {
          totalLoaded++;
          callback(totalLoaded, promises.length);
        });
      });
      callback(totalLoaded, promises.length);
    }

    return Promise.all(promises);
  };

  const play = (audioObject: AudioObject, timePosition = 0) => {
    audioObject.played.listen(() => {
      setActiveSounds((prev) => [...prev, audioObject]);
    });

    audioObject.stopped.listen(() => {
      setActiveSounds((prev) =>
        prev.filter((sound) => sound !== audioObject)
      );
    });

    audioObject.play(timePosition);
  };

  const playSfx = async (
    audioSource: AudioSourceType,
    volume: number = SFX_DEFAULT_VOLUME,
    rate: number = 1
  ) => {
    if (!(audioSource instanceof AudioSource)) {
      console.error("Invalid sound effect provided to playSfx()");
      return;
    }

    if (sfxContext === null) {
      console.error("SFX did not play because AudioContext() has not yet loaded!");
      return;
    }

    const soundEffect = new AudioObject(audioSource, sfxContext);
    const sfxAreMuted = !userSfxEnabled;

    if (sfxAreMuted) {
      soundEffect.mute();
    }

    soundEffect.setVolume(volume * globalVolume);
    soundEffect.setPlaybackRate(rate);
    play(soundEffect);

    return soundEffect;
  };

  const playTheme = async (
    audioSource: AudioSourceType,
    volume: number = MUSIC_DEFAULT_VOLUME,
    loops: boolean = true,
    timePosition: number = 0
  ) => {
    if (currentTheme && currentTheme.getAudioSource() === audioSource) {
      // the theme is already playing
      return;
    }

    if (!(audioSource instanceof AudioSource)) {
      console.error("Invalid theme provided to playTheme()");
      return;
    }

    if (musicContext === null) {
      console.error("Music did not play because AudioContext() has not yet loaded!");
      return;
    }

    if (currentTheme !== null) {
      currentTheme.pause();
    }

    let newTheme = new AudioObject(audioSource, musicContext);
    const themesAreMuted = !userMusicEnabled;

    if (themesAreMuted) {
      newTheme.mute();
    }

    setCurrentTheme(newTheme);
    newTheme.setVolume(volume * globalVolume);
    newTheme.setLoop(loops);
    play(newTheme, timePosition);

    return newTheme;
  };

  const stopTheme = (fade: number = 0) => {
    if (currentTheme) {
      currentTheme.pause();
      setCurrentTheme(null);
    }
  };

  const suspendActiveObjects = () => {
    setCurrentTheme(null);
    activeSounds.forEach((sound) => sound.pause());
  };

  const muteSfx = () => {
    setUserSfxEnabled(false);
  };

  const unmuteSfx = () => {
    setUserSfxEnabled(true);
  };

  const muteMusic = () => {
    setUserMusicEnabled(false);
  };

  const unmuteMusic = () => {
    setUserMusicEnabled(true);
  };

  return (
    <AudioPlayerContext.Provider
      value={{
        sfxContext,
        musicContext,
        globalVolume,
        userSfxEnabled,
        userMusicEnabled,
        currentTheme,
        activeSounds,

        preloadAll,
        setGlobalVolume,
        playSfx,
        playTheme,
        stopTheme,
        suspendActiveObjects,
        muteSfx,
        unmuteSfx,
        muteMusic,
        unmuteMusic,
      }}
    >
      {children}
    </AudioPlayerContext.Provider>
  );
};

export const useAudioPlayer = (): AudioPlayerType => {
  const context = useContext(AudioPlayerContext);
  if (!context) {
    throw new Error("useAudioPlayer must be used within a AudioPlayerProvider");
  }
  return context;
};
