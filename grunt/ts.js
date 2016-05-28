'use strict';

module.exports = {
  default: {
    files: [
      { src: 'src/**.ts'  , dest: 'lib/src'  },
      { src: 'test/**.ts' , dest: 'lib/test' }
    ],

    options: {
      fast: 'never',
      module: 'commonjs',
      target: 'es6'
    }
  }
};
