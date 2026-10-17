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
    title: 'The town that made radios',
    image: '/assets/backgrounds/scene-factory.svg',
    alt: 'A pixel-art factory with lit windows and tall chimneys at dusk.',
    marker: 'Archive tape 1 · the busy years',
    passages: [
      'Lowtide Hollow once made radios.',
      'Every house had one. Every window hummed. The factory whistle told the whole town what time it was.',
    ],
  },
  {
    id: 'scene-empty',
    title: 'The quiet years',
    image: '/assets/backgrounds/scene-empty.svg',
    alt: 'An empty pixel-art street under a pale moon, fog gathering at the kerb.',
    marker: 'Archive tape 2 · the leaving',
    passages: [
      'Then the orders thinned, and the factories closed.',
      'Families left, one lit window at a time. The stations went silent, one frequency after another.',
    ],
  },
  {
    id: 'scene-station',
    title: 'The last of its kind',
    image: '/assets/backgrounds/scene-station.svg',
    alt: 'A dim radio station room with a window, a console and a glowing dial.',
    marker: 'Archive tape 3 · the last shift',
    passages: [
      'Squelch was one of the last radios made in the Hollow.',
      'It woke in an empty station, warm from the final shift. Its operator stayed the longest. Then they left too.',
    ],
  },
  {
    id: 'scene-lamp',
    title: 'The recording',
    image: '/assets/backgrounds/scene-lamp.svg',
    alt: 'A single amber lamp glowing in the fog on an empty street.',
    marker: 'Archive tape 4 · the message',
    passages: [
      'Before leaving, the operator recorded one last message.',
      'Squelch plays it every night. It knows it is only a recording. It hopes anyway.',
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
