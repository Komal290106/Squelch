export type StationId = 'lost-found' | 'beacon' | 'weather';
export type Weather = 'fog' | 'rain' | 'clear';
export type Mood = 'idle' | 'listening' | 'signal' | 'surprised' | 'sleepy' | 'happy';

export interface Station {
  id: StationId;
  frequency: number;
  title: string;
  blurb: string;
  goal: string;
}

export const stations: Station[] = [
  { id: 'lost-found', frequency: 92.1, title: 'The Lost & Found Hour', blurb: 'Things the town left behind, and what they remember.', goal: 'Open 3 objects to stabilise the signal.' },
  { id: 'beacon', frequency: 96.4, title: 'The Beacon', blurb: 'The old transmitter is down. Someone has to fix it.', goal: 'Repair the transmitter in the right order.' },
  { id: 'weather', frequency: 101.8, title: 'Weather for Nowhere', blurb: 'Forecasts for a town with no one left to check them.', goal: 'Listen to all three kinds of weather.' },
];

export const SECRET_FREQUENCY = 1717;
export const LOST_FOUND_GOAL = 3;

export interface LostItem {
  id: string;
  name: string;
  icon: 'Key' | 'Umbrella' | 'Glasses' | 'Mail' | 'Watch' | 'Lamp';
  tag: string;
  story: string;
}

export const lostItems: LostItem[] = [
  { id: 'key', name: 'Brass key', icon: 'Key', tag: 'Found: factory gate', story: 'No lock in town fits it anymore. Squelch keeps it anyway, in case a lock comes back.' },
  { id: 'umbrella', name: 'One-rib umbrella', icon: 'Umbrella', tag: 'Found: bus shelter', story: 'Left behind on a Tuesday that never quite ended. It still drips when nobody is looking.' },
  { id: 'glasses', name: 'Reading glasses', icon: 'Glasses', tag: 'Found: on a stack of letters', story: 'Squelch tried them once. Everything got bigger. Still lonely, but bigger.' },
  { id: 'postcard', name: 'Unsent postcard', icon: 'Mail', tag: 'Found: post office floor', story: '"Wish you were here," it says, above an address that is now a field.' },
  { id: 'watch', name: 'Pocket watch', icon: 'Watch', tag: 'Found: the station steps', story: 'Stopped at 4:12. Both hands point toward the transmitter, as if it knew.' },
  { id: 'lamp', name: 'Porch lamp', icon: 'Lamp', tag: 'Returned, not lost', story: 'It was on the doorstep this morning, warm to the touch. Nobody admits to lighting it.' },
];

export interface BeaconPart {
  id: string;
  name: string;
  icon: 'Zap' | 'Lightbulb' | 'RadioTower' | 'Disc3' | 'Speaker';
}

export const beaconParts: BeaconPart[] = [
  { id: 'coil', name: 'Antenna coil', icon: 'RadioTower' },
  { id: 'fuse', name: 'Power fuse', icon: 'Zap' },
  { id: 'cone', name: 'Speaker cone', icon: 'Speaker' },
  { id: 'tube', name: 'Glass tube', icon: 'Lightbulb' },
  { id: 'cord', name: 'Dial cord', icon: 'Disc3' },
];

export const beaconSolution = ['fuse', 'tube', 'coil'] as const;
export const beaconClue = 'The repair card is water-stained. It reads: "Power first. Warm the glass. Then reach for the sky."';

export interface WeatherMode {
  id: Weather;
  label: string;
  mood: Mood;
  message: string;
}

export const weatherModes: WeatherMode[] = [
  { id: 'fog', label: 'Fog', mood: 'listening', message: 'Fog on the harbour road. Everything sounds closer than it is. I keep the lamp lit so lost things can find it.' },
  { id: 'rain', label: 'Rain', mood: 'sleepy', message: 'Rain on the roof tiles. The static sounds like applause if you let it. Thank you, everyone.' },
  { id: 'clear', label: 'Clear', mood: 'happy', message: 'Clear sky tonight. Good weather for being heard. Say something, if you like.' },
];

/** Which frequency each page section sits on (used by the live readout). */
export const sectionFrequencies: Record<string, number> = {
  hero: 88.1,
  'station-id': 88.7,
  story: 90.3,
  archive: 92.1,
  'night-log': 98.9,
  'am-1717': SECRET_FREQUENCY,
  footer: 88.1,
};
