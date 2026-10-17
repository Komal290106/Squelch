import { createContext, useContext, useMemo, useReducer, useRef } from 'react';
import { character } from '../data/character';
import { beaconSolution, LOST_FOUND_GOAL } from '../data/stations';
import type { Mood, StationId, Weather } from '../data/stations';
import { setSoundEnabled } from '../lib/audio';

export interface RadioState {
  introActive: boolean;
  transmissionStarted: boolean;
  tunedIn: boolean;
  frequency: number;
  discovered: StationId[];
  mood: Mood;
  soundEnabled: boolean;
  weather: Weather;
  weatherSeen: Weather[];
  lostOpened: string[];
  beaconProgress: string[];
  beaconMessage: string;
  secretForced: boolean;
  replySubmitted: boolean;
  replyText: string;
}

const initial: RadioState = {
  introActive: true,
  transmissionStarted: false,
  tunedIn: false,
  frequency: character.stationFrequency,
  discovered: [],
  mood: 'idle',
  soundEnabled: false,
  weather: 'clear',
  weatherSeen: [],
  lostOpened: [],
  beaconProgress: [],
  beaconMessage: 'Transmitter offline. Three parts need to be touched in the right order.',
  secretForced: false,
  replySubmitted: false,
  replyText: '',
};

type Action =
  | { type: 'START_TRANSMISSION' }
  | { type: 'TUNE_IN' }
  | { type: 'END_INTRO' }
  | { type: 'SET_FREQUENCY'; value: number }
  | { type: 'SET_MOOD'; value: Mood }
  | { type: 'TOGGLE_SOUND' }
  | { type: 'OPEN_LOST_ITEM'; id: string }
  | { type: 'BEACON_PRESS'; id: string }
  | { type: 'BEACON_RESET' }
  | { type: 'SET_WEATHER'; value: Weather }
  | { type: 'FORCE_SECRET' }
  | { type: 'SUBMIT_REPLY'; text: string };

const addUnique = <T,>(list: T[], item: T): T[] => (list.includes(item) ? list : [...list, item]);

function reducer(state: RadioState, action: Action): RadioState {
  switch (action.type) {
    case 'START_TRANSMISSION':
      return state.transmissionStarted ? state : { ...state, transmissionStarted: true };
    case 'TUNE_IN':
      return { ...state, tunedIn: true, frequency: character.stationFrequency };
    case 'END_INTRO':
      return { ...state, introActive: false };
    case 'SET_FREQUENCY':
      return state.frequency === action.value ? state : { ...state, frequency: action.value };
    case 'SET_MOOD':
      return state.mood === action.value ? state : { ...state, mood: action.value };
    case 'TOGGLE_SOUND':
      return { ...state, soundEnabled: !state.soundEnabled };
    case 'OPEN_LOST_ITEM': {
      const lostOpened = addUnique(state.lostOpened, action.id);
      const discovered = lostOpened.length >= LOST_FOUND_GOAL ? addUnique(state.discovered, 'lost-found' as StationId) : state.discovered;
      return { ...state, lostOpened, discovered };
    }
    case 'BEACON_PRESS': {
      if (state.discovered.includes('beacon')) return state;
      const expected = beaconSolution[state.beaconProgress.length];
      if (action.id !== expected) {
        return { ...state, beaconProgress: [], beaconMessage: 'Static. Wrong order. The board resets with a sigh. Try again.' };
      }
      const beaconProgress = [...state.beaconProgress, action.id];
      if (beaconProgress.length === beaconSolution.length) {
        return { ...state, beaconProgress, beaconMessage: 'BEACON ONLINE. A steady tone leaves the tower and travels out over the water.', discovered: addUnique(state.discovered, 'beacon' as StationId) };
      }
      return { ...state, beaconProgress, beaconMessage: `Good. Step ${beaconProgress.length} of ${beaconSolution.length} holds. The signal is climbing.` };
    }
    case 'BEACON_RESET':
      return { ...state, beaconProgress: [], beaconMessage: 'Board reset. Three parts, right order.', discovered: state.discovered.filter((s) => s !== 'beacon') };
    case 'SET_WEATHER': {
      const weatherSeen = addUnique(state.weatherSeen, action.value);
      const discovered = weatherSeen.length >= 3 ? addUnique(state.discovered, 'weather' as StationId) : state.discovered;
      return { ...state, weather: action.value, weatherSeen, discovered };
    }
    case 'FORCE_SECRET':
      return { ...state, secretForced: true };
    case 'SUBMIT_REPLY':
      return { ...state, replySubmitted: true, replyText: action.text, mood: 'happy' };
    default:
      return state;
  }
}

export interface RadioApi extends RadioState {
  secretUnlocked: boolean;
  startTransmission: () => void;
  tuneIn: () => void;
  endIntro: () => void;
  setFrequency: (f: number) => void;
  setMood: (m: Mood) => void;
  toggleSound: () => void;
  openLostItem: (id: string) => void;
  pressBeaconPart: (id: string) => void;
  resetBeacon: () => void;
  setWeather: (w: Weather) => void;
  forceSecret: () => void;
  submitReply: (text: string) => void;
}

export const RadioContext = createContext<RadioApi | null>(null);

export function useRadioProvider(): RadioApi {
  const [state, dispatch] = useReducer(reducer, initial);

  // Keep the latest sound flag in a ref so toggleSound itself never has to change.
  const soundRef = useRef(state.soundEnabled);
  soundRef.current = state.soundEnabled;

  // IMPORTANT: these action functions are created ONCE and never change identity.
  // Components put them in useEffect/useCallback dependency lists. If they changed on every
  // state update, effects would re-run (and clear their timers) every time anything dispatched.
  const actions = useMemo(
    () => ({
      startTransmission: () => dispatch({ type: 'START_TRANSMISSION' }),
      tuneIn: () => dispatch({ type: 'TUNE_IN' }),
      endIntro: () => dispatch({ type: 'END_INTRO' }),
      setFrequency: (value: number) => dispatch({ type: 'SET_FREQUENCY', value }),
      setMood: (value: Mood) => dispatch({ type: 'SET_MOOD', value }),
      toggleSound: () => {
        // Update the audio module inside the click gesture so playback is allowed.
        setSoundEnabled(!soundRef.current);
        dispatch({ type: 'TOGGLE_SOUND' });
      },
      openLostItem: (id: string) => dispatch({ type: 'OPEN_LOST_ITEM', id }),
      pressBeaconPart: (id: string) => dispatch({ type: 'BEACON_PRESS', id }),
      resetBeacon: () => dispatch({ type: 'BEACON_RESET' }),
      setWeather: (value: Weather) => dispatch({ type: 'SET_WEATHER', value }),
      forceSecret: () => dispatch({ type: 'FORCE_SECRET' }),
      submitReply: (text: string) => dispatch({ type: 'SUBMIT_REPLY', text }),
    }),
    [],
  );

  const secretUnlocked = state.secretForced || state.discovered.length >= 3;

  return useMemo<RadioApi>(() => ({ ...state, secretUnlocked, ...actions }), [state, secretUnlocked, actions]);
}

export function useRadio(): RadioApi {
  const ctx = useContext(RadioContext);
  if (!ctx) throw new Error('useRadio must be used inside <RadioContext.Provider>');
  return ctx;
}
