'use strict';

module.exports = function (grunt) {

  // Load grunt tasks automatically
  require('load-grunt-tasks')(grunt);

  // Time how long tasks take. Can help when optimizing build times
  require('time-grunt')(grunt);

  // Define the configuration for all the tasks
  grunt.initConfig({

    // Project settings
    yeoman: {
      // configurable paths
      app: 'www',
      dist: 'dist'
    },

    watch: {
      options: {
        livereload: true,
      },
      scripts: {
        files: [
          '<%= yeoman.app %>/js/{,*/}*.js'
        ]
      },
      html: {
        files: [
          '<%= yeoman.app %>/index.html'
        ]
      }
    }

  });

  // Used for delaying livereload until after server has restarted
  grunt.registerTask('wait', function () {
    grunt.log.ok('Waiting for server reload...');

    var done = this.async();

    setTimeout(function () {
      grunt.log.writeln('Done waiting!');
      done();
    }, 500);
  });

  grunt.registerTask('express-keepalive', 'Keep grunt running', function() {
    this.async();
  });

  grunt.registerTask('dev', [
    //TODO: corregir
    'watch'
  ]);

};
