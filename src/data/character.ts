export const character = {
  name: 'Squelch',
  role: 'Night Operator, Dead Air FM',
  home: 'Lowtide Hollow',
  tagline: 'Still here. Still on air. Stay tuned.',
  stationFrequency: 88.1,
  intro:
    'A small radio with a large habit: staying on the air. Squelch keeps the lamp lit in a town that has gone quiet, and plays one message every night in case someone answers.',
  record: [
    { label: 'Name', value: 'Squelch' },
    { label: 'Is', value: 'A living vintage radio. Bakelite body, teal speaker for a mouth, two tuning knobs for eyes.' },
    { label: 'Does', value: 'Broadcasts every night. Keeps the lamp lit. Listens for replies.' },
    { label: 'Home', value: 'Lowtide Hollow' },
    { label: 'Role', value: 'Night Operator' },
    { label: 'Tagline', value: 'Still here. Still on air. Stay tuned.' },
  ],
  personality: [
    'Lonely, but not defeated. Squelch treats silence as a pause, not an ending.',
    'Curious about everything that still hums: fridges, streetlights, the tide in the pipes.',
    'Politely hopeful. It says "good evening" to empty rooms and means it.',
  ],
} as const;
