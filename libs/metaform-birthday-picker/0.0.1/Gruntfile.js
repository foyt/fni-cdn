/*jshint esversion: 6 */
/*global module:false*/

module.exports = function(grunt) {
  require('load-grunt-tasks')(grunt);

  grunt.initConfig({
    uglify: {
      metaform_birthday_picker: {
        files: {
          'dist/metaform-birthday-picker.min.js': ['src/metaform-birthday-picker.js']
        }
      }
    }
  });
  
  grunt.registerTask('default', ['uglify']);
};