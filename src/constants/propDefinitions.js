
export const entryPosition = {
  alternate: {
    id: 'alternate',
  },
  left: {
    id: 'left',
    offsetProperty: 'right',
  },
  right: {
    id: 'right',
    offsetProperty: 'left',
  },
  top: {
    id: 'top',
    offsetProperty: 'bottom',
  },
  bottom: {
    id: 'bottom',
    offsetProperty: 'top',
  },
};

export const orientation = {
  horizontal: {
    id: 'horizontal',
    className: 'horizontal',
    barProperties: {
      length: 'width',
      startPosition: 'left',
      alignSide1: 'top',
      alignSide2: 'bottom',
    },
    entryPositions: [
      entryPosition.top,
      entryPosition.bottom,
    ],
  },
  'horizontal-reversed': {
    id: 'horizontal-reversed',
    className: 'horizontal reversed',
    barProperties: {
      length: 'width',
      startPosition: 'right',
      alignSide1: 'top',
      alignSide2: 'bottom',
    },
    entryPositions: [
      entryPosition.top,
      entryPosition.bottom,
    ],
  },
  vertical: {
    id: 'vertical',
    className: 'vertical',
    barProperties: {
      length: 'height',
      startPosition: 'bottom',
      alignSide1: 'left',
      alignSide2: 'right',
    },
    entryPositions: [
      entryPosition.left,
      entryPosition.right,
    ],
  },
  'vertical-reversed': {
    id: 'vertical-reversed',
    className: 'vertical reversed',
    barProperties: {
      length: 'height',
      startPosition: 'top',
      alignSide1: 'left',
      alignSide2: 'right',
    },
    entryPositions: [
      entryPosition.left,
      entryPosition.right,
    ],
  },
};

export const scaleType = {
  linear: 'linear',
  logarithmic: 'logarithmic',
};

export const defaultColorCycle = [
  '#ffadad',
  '#ffd6a5',
  '#ffdffb6',
  '#caffbf',
  '#9bf6ff',
  'a0c4ff',
  'bdb2ff',
  'ffc6ff',
  'fffffc',
];
