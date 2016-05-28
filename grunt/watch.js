'use strict';

module.exports = {
  ts: {
    files: [
      'src/**/*.ts',
      'test/**/*.ts'
    ],
    tasks: ['clean:default', 'tslint', 'ts:default']
  },
  test: {
    files: [
      'out/**/*.js'
    ],
    tasks: []
  }
};
