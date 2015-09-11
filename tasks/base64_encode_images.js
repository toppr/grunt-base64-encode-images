/*
 * grunt-base64-encode-images
 * https://github.com/toppr/grunt-base64-encode-images
 *
 * Copyright (c) 2015 Gautam Chaudhary
 * Licensed under the MIT license.
 */

'use strict';

module.exports = function(grunt) {

  grunt.registerMultiTask('base64EncodeImages', 'A simple grunt task for base64 encoding a list of images into JSON', function() {
    // Merge task-specific and/or target-specific options with these defaults.
    var options = this.options({
      prefix: ''
    });

    // Iterate over all specified file groups.
    this.files.forEach(function(f) {

      var source_files = f.src.filter(function(filepath) {
        if (!grunt.file.exists(filepath)) {
          return false;
        } else {
          return true;
        }
      });

      var images_map = {};  // Mapping of image name and file path

      if (source_files.length) {
        for (var i=0;i<source_files.length;i++) {
          var file_path = source_files[i];

          var contents = grunt.file.read(file_path);
          var object = JSON.parse(contents);

          for (var image_name in object) {
            if(!object.hasOwnProperty(image_name)) {
              continue;
            }

            var image_file_path = object[image_name];
            var extension = image_file_path.split('.').pop();

            if (grunt.file.exists(image_file_path)) {
              var base64 = grunt.file.read(image_file_path, {encoding: 'base64'});
              var data_uri = 'data:image/' + (extension === 'jpg' ? 'jpeg' : extension) + ';base64,' + base64;
              images_map[options.prefix + image_name] = data_uri;
            } else {
              grunt.log.writeln("File doesn't exist: "+image_file_path);
            }
          }
        }
      }
      
      grunt.file.write(f.dest, JSON.stringify(images_map));
      grunt.log.writeln('File "' + f.dest + '" created.');
    });
  });

};