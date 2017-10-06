/**
 - A symbol can start matching counts only from beginning of line or from anywhere
 - The direction can be from left to right or from right to left
 - There can be some multiplier symbols
 - Bonus symbols can be scatter, line-scatter or just regular match symbols
 */

export default {
  base: {
    type: 'lines',
    rowCount: 3,
    reels: [
      [ 'lv1', 'lv2', 'lv3', 'lv4', 'lv5', 'hv1', 'hv2', 'hv3', 'hv4', 'hv5',
        'lv1', 'lv2', 'lv3', 'lv4', 'lv5', 'hv1', 'hv2', 'hv3', 'hv4', 'hv5',
        'lv1', 'lv2', 'lv3', 'lv4', 'lv5', 'hv1', 'hv2', 'hv3', 'hv4', 'hv5',
        'lv1', 'lv2', 'lv3', 'lv4', 'lv5', 'hv1', 'hv2', 'hv3', 'hv4', 'hv5',
        'lv1', 'lv2', 'lv3', 'lv4', 'lv5' ],
      [ 'lv1', 'lv2', 'lv3', 'lv4', 'lv5', 'hv1', 'hv2', 'hv3', 'hv4', 'hv5',
        'lv1', 'lv2', 'lv3', 'lv4', 'lv5', 'hv1', 'hv2', 'hv3', 'hv4', 'hv5',
        'lv1', 'lv2', 'lv3', 'lv4', 'lv5', 'hv1', 'hv2', 'hv3', 'hv4', 'hv5',
        'lv1', 'lv2', 'lv3', 'lv4', 'lv5', 'hv1', 'hv2', 'hv3', 'hv4', 'hv5',
        'lv1', 'lv2', 'lv3', 'lv4', 'lv5' ],
      [ 'lv1', 'lv2', 'lv3', 'lv4', 'lv5', 'hv1', 'hv2', 'hv3', 'hv4', 'hv5',
        'lv1', 'lv2', 'lv3', 'lv4', 'lv5', 'hv1', 'hv2', 'hv3', 'hv4', 'hv5',
        'lv1', 'lv2', 'lv3', 'lv4', 'lv5', 'hv1', 'hv2', 'hv3', 'hv4', 'hv5',
        'lv1', 'lv2', 'lv3', 'lv4', 'lv5', 'hv1', 'hv2', 'hv3', 'hv4', 'hv5',
        'lv1', 'lv2', 'lv3', 'lv4', 'lv5' ],
      [ 'lv1', 'lv2', 'lv3', 'lv4', 'lv5', 'hv1', 'hv2', 'hv3', 'hv4', 'hv5',
        'lv1', 'lv2', 'lv3', 'lv4', 'lv5', 'hv1', 'hv2', 'hv3', 'hv4', 'hv5',
        'lv1', 'lv2', 'lv3', 'lv4', 'lv5', 'hv1', 'hv2', 'hv3', 'hv4', 'hv5',
        'lv1', 'lv2', 'lv3', 'lv4', 'lv5', 'hv1', 'hv2', 'hv3', 'hv4', 'hv5',
        'lv1', 'lv2', 'lv3', 'lv4', 'lv5' ],
      [ 'lv1', 'lv2', 'lv3', 'lv4', 'lv5', 'hv1', 'hv2', 'hv3', 'hv4', 'hv5',
        'lv1', 'lv2', 'lv3', 'lv4', 'lv5', 'hv1', 'hv2', 'hv3', 'hv4', 'hv5',
        'lv1', 'lv2', 'lv3', 'lv4', 'lv5', 'hv1', 'hv2', 'hv3', 'hv4', 'hv5',
        'lv1', 'lv2', 'lv3', 'lv4', 'lv5', 'hv1', 'hv2', 'hv3', 'hv4', 'hv5',
        'lv1', 'lv2', 'lv3', 'lv4', 'lv5' ]
    ],
    paytable: {
      'lv1': [
        [3, 5],
        [4, 10],
        [5, 20]
      ],
      'lv2': [
        [3, 5],
        [4, 15],
        [5, 25]
      ],
      'lv3': [
        [3, 10],
        [4, 20],
        [5, 30]
      ],
      'lv4': [
        [3, 10],
        [4, 25],
        [5, 35]
      ],
      'lv5': [
        [3, 15],
        [4, 30],
        [5, 40]
      ],
      'hv1': [
        [3, 20],
        [4, 50],
        [5, 100]
      ],
      'hv2': [
        [3, 30],
        [4, 60],
        [5, 120]
      ],
      'hv3': [
        [3, 40],
        [4, 70],
        [5, 150]
      ],
      'hv4': [
        [3, 50],
        [4, 80],
        [5, 200]
      ],
      'hv5': [
        [3, 60],
        [4, 100],
        [5, 500]
      ]
    },
    lines: [
      [0, 0, 0, 0, 0],
      [1, 1, 1, 1, 1],
      [2, 2, 2, 2, 2],
      [0, 0, 1, 2, 2],
      [2, 2, 1, 0, 0],
      [0, 1, 2, 1, 0],
      [2, 1, 0, 1, 2],
      [0, 1, 0, 1, 0],
      [1, 0, 1, 0, 1],
      [1, 2, 1, 2, 1],
      [2, 1, 2, 1, 2]
    ],
    wild: {
      'wi': {
        expanding: false,
        sticky: false
      }
    },
    scatter: {
      'sc': [
        [3, 0, ['bonus', 2]],
        [4, 0, ['bonus', 3]],
        [5, 0, ['bonus', 4]]
      ],
      'fs': [
        [3, 0, ['freespin', 10]],
        [4, 0, ['freespin', 15]],
        [5, 0, ['freespin', 20]]
      ]
    },
    lineScatter: {
      'x2': [
        [1, 0, ['multiply', 2]],
        [2, 0, ['multiply', 4]],
        [3, 0, ['multiply', 8]],
        [4, 0, ['multiply', 16]],
        [5, 0, ['multiply', 32]]
      ]
    }
  }
};
