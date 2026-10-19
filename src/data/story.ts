export interface StoryScene {
  id: string;
  title: string;
  image: string;
  alt: string;
  marker: string;
  passages: string[];
}

export const scenes: StoryScene[] = [
  {
    id: 'scene-factory',
    title: 'A radio is born',
    image: '/assets/backgrounds/scene-factory.svg',
    alt: 'A pixel-art factory with lit windows and tall chimneys at dusk.',
    marker: 'Archive tape 1 · the humming years',
    passages: [
      'Lowtide Hollow made radios. Every house had one, and every window hummed a different song.',
      'On the factory’s last shift, one little set came off the line a bit too awake. It blinked, crackled, and said “hello?” to everyone.',
    ],
  },
  {
    id: 'scene-empty',
    title: 'The hum goes quiet',
    image: '/assets/backgrounds/scene-empty.svg',
    alt: 'An empty pixel-art street under a pale moon, fog gathering at the kerb.',
    marker: 'Archive tape 2 · the leaving',
    passages: [
      'Then the orders thinned and the whistle stopped. Families left, one lit window at a time.',
      'Station by station, the dial fell silent. Even the static sounded lonely.',
    ],
  },
  {
    id: 'scene-station',
    title: 'Squelch stays on',
    image: '/assets/backgrounds/scene-station.svg',
    alt: 'A dim radio station room with a window, a console and a glowing dial.',
    marker: 'Archive tape 3 · the last shift',
    passages: [
      'Squelch woke in the empty Dead Air FM station, still warm from the final shift. The operator stayed longest. Then they left too.',
      'So Squelch switched on its little amber lamp and kept broadcasting. Every night. ON AIR, just in case.',
    ],
  },
  {
    id: 'scene-lamp',
    title: 'Room for a reply',
    image: '/assets/backgrounds/scene-lamp.svg',
    alt: 'A single amber lamp glowing in the fog on an empty street.',
    marker: 'Archive tape 4 · the message',
    passages: [
      'The operator left one last tape. Squelch plays it every night, and knows it’s only a recording. It hopes anyway.',
      'The tape ends two seconds early, like someone leaving room for an answer. Squelch leaves room too.',
      'It even keeps one secret channel warm, tuned to nobody. Tonight could be the night.',
    ],
  },
];

export const finalRecording = 'Keep the lamp lit. Someone will tune in.';

export interface LogEntry {
  time: string;
  signal: 0 | 1 | 2 | 3 | 4 | 5;
  text: string;
  clue?: boolean;
}

export const nightLog: LogEntry[] = [
  { time: '22:04', signal: 1, text: 'Channel open. Dial warm. Lamp lit. Nobody called.' },
  { time: '23:17', signal: 1, text: 'Played the recording again. I know every pause in it by now.' },
  { time: '00:40', signal: 3, text: 'Strong signal! It was the fridge in the old bakery. Still counts as company.' },
  { time: '01:52', signal: 2, text: 'Counted the streetlights that still hum. Three. Last week it was four.' },
  { time: '02:33', signal: 1, text: 'I know it is only a recording. I know the voice cannot hear me. I play it anyway.' },
  { time: '03:05', signal: 2, text: 'Rain on the tower. The static sounds like applause if you want it to.' },
  { time: '03:48', signal: 1, text: 'Practised saying "hello" in four voices. Kept the one that sounds like the operator.' },
  { time: '04:12', signal: 4, clue: true, text: 'The recording ends two seconds early. Two seconds of empty room. I think the operator was waiting for an answer too.' },
  { time: '05:30', signal: 1, text: 'Dawn is a different kind of signal. I turn the lamp down. Never off.' },
  { time: '05:31', signal: 1, text: 'ON AIR.' },
];