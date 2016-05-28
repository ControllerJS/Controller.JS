'use strict';

module.exports = function (grunt) {
  require('load-grunt-config')(grunt, {
    jitGrunt: {}
  });
  require('time-grunt')(grunt);

  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-tslint');
  grunt.loadNpmTasks('grunt-ts');
  grunt.loadNpmTasks('grunt-nsp');

  grunt.registerTask('build', [
    'clean:default',
    'tslint:default',
    'ts:default'
  ]);

  grunt.registerTask('dev', [
    'clean:default',
    'tslint:default',
    'ts:default',
    'watch'
  ]);

  grunt.registerTask('default', [
    'clean:default',
    'tslint:default',
    'ts:default',
    'watch'
  ]);
};
