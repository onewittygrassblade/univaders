export default [
  {
    hint: 'They are coming!',
    world: {
      unicorns: {
        type: 'grid',
        class: 'UnicornGridManager',
        texture: 'unicorn',
        data: [
          [1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
          [1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
          [1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
          [1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
          [1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
          [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
          [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        ],
        emitterOffsets: [
          { x: 0, y: 30 },
        ],
        emitterFireInterval: 1500,
      },
    },
  },
  {
    hint: 'The who',
    world: {
      unicorns: {
        type: 'grid',
        class: 'UnicornGridManager',
        texture: 'unicorn',
        data: [
          [1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
          [1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
          [0, 0, 0, 0, 1, 1, 0, 0, 0, 0],
          [0, 0, 0, 0, 1, 1, 0, 0, 0, 0],
          [0, 0, 0, 0, 1, 1, 0, 0, 0, 0],
          [1, 1, 1, 1, 1, 1, 0, 0, 0, 0],
          [1, 1, 1, 1, 1, 1, 0, 0, 0, 0],
        ],
        emitterOffsets: [
          { x: 0, y: 30 },
        ],
        emitterFireInterval: 1500,
      },
    },
  },
  {
    hint: 'The what',
    world: {
      unicorns: {
        type: 'grid',
        class: 'UnicornGridManager',
        texture: 'unicorn',
        data: [
          [0, 1, 1, 1, 0, 0, 1, 1, 1, 0],
          [0, 1, 1, 1, 1, 1, 1, 1, 1, 0],
          [0, 1, 1, 1, 1, 1, 1, 1, 1, 0],
          [0, 0, 1, 1, 1, 1, 1, 1, 0, 0],
          [0, 0, 0, 1, 1, 1, 1, 0, 0, 0],
          [0, 0, 0, 0, 1, 1, 0, 0, 0, 0],
          [0, 0, 0, 0, 1, 1, 0, 0, 0, 0],
        ],
        emitterOffsets: [
          { x: 0, y: 30 },
        ],
        emitterFireInterval: 1500,
      },
    },
  },
  {
    hint: 'The whom',
    world: {
      unicorns: {
        type: 'grid',
        class: 'UnicornGridManager',
        texture: 'unicorn',
        data: [
          [1, 1, 0, 0, 0, 0, 0, 0, 1, 1],
          [1, 1, 1, 0, 0, 0, 0, 1, 1, 1],
          [1, 1, 1, 1, 0, 0, 1, 1, 1, 1],
          [1, 1, 0, 1, 1, 1, 1, 0, 1, 1],
          [1, 1, 0, 0, 1, 1, 0, 0, 1, 1],
          [1, 1, 0, 0, 0, 0, 0, 0, 1, 1],
          [1, 1, 0, 0, 0, 0, 0, 0, 1, 1],
        ],
        emitterOffsets: [
          { x: 0, y: 30 },
        ],
        emitterFireInterval: 1500,
      },
    },
  },
  {
    hint: 'Don\'t panic',
    world: {
      unicorns: {
        type: 'fluid',
        class: 'UnicornFluidManager',
        texture: 'unicorn',
        data: null,
        emitterOffsets: [
          { x: 0, y: 30 },
        ],
        emitterFireInterval: 1500,
      },
    },
  },
  {
    hint: 'Uh oh...',
    world: {
      unicorns: {
        type: 'boss',
        class: 'UnicornBossManager',
        texture: 'unicorn_big',
        data: null,
        emitterOffsets: [
          { x: -60, y: 120 },
          { x: 0, y: 120 },
          { x: 60, y: 120 },
        ],
        emitterFireInterval: 500,
      },
    },
  },
];
