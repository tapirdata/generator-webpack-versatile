// Generated on 2014-06-28 using generator-webapp 0.4.9
'use strict';

// # Globbing
// for performance reasons we're only matching one level down:
// 'test/spec/{,*/}*.js'
// use this if you want to recursively match all subfolders:
// 'test/spec/**/*.js'

var fs = require('fs');
var path = require('path');

module.exports = function(grunt) {

  // Load grunt tasks automatically
  require('load-grunt-tasks')(grunt);

  // Time how long tasks take. Can help when optimizing build times
  require('time-grunt')(grunt);

  // Configurable paths
  var config = {
    appDir: '<%= appDir %>',
    clientDir: '<%= clientDir %>',
    templatesDir: '<%= templatesDir %>',
    staticDir: '<%= staticDir %>',
    bowerDir: JSON.parse(fs.readFileSync('./.bowerrc')).directory,
    distDir: '<%= distDir %>',
    livereload: true  // use default port 35729
  };

  // Define the configuration for all the tasks
  grunt.initConfig({

    // Project settings
    config: config,

    // Watches files for changes and runs tasks based on the changed files
    watch: {
      bower: {
        files: ['bower.json'],
        tasks: ['wiredep']
      },
      jstest: {
        files: ['test/spec/{,*/}*.js'],
        tasks: ['test:watch']
      },
      gruntfile: {
        files: ['Gruntfile.js']
      },
      // copy tasks
      styles: {
        files: ['<%%= config.clientDir %>/styles/{,*/}*.css'],
        tasks: ['newer:copy:styles', 'autoprefixer']
      },
      scripts: {
        files: ['<%%= config.clientDir %>/scripts/{,*/}*.js'],
        tasks: ['jshint', 'newer:copy:scripts']
      },
      images: {
        files: ['<%%= config.clientDir %>/images/{,*/}*'],
        tasks: ['newer:copy:images']
      },
      pages: {
        files: ['<%%= config.clientDir %>/pages/{,*/}*'],
        tasks: ['newer:copy:pages']
      },
      // transform tasks
      sass: {
        files: ['<%%= config.clientDir %>/styles/{,*/}*.{scss,sass}'],
        tasks: ['sass:client', 'autoprefixer']
      },
      jade: {
        files: ['<%%= config.templatesDir %>/{,*/}*.jade'],
        tasks: ['jade:client']
      },
      livereload: {
        files: [
          '<%%= config.staticDir %>/styles/{,*/}*.css',
          '<%%= config.staticDir %>/scripts/{,*/}*.js',
          '<%%= config.staticDir %>/images/{,*/}*'
        ],
        options: {
          livereload: config.livereload
        }
      },
      // server files
      express: {
        files: [
          '<%%= config.appDir %>/{,*/}*.js',
          '<%%= config.appDir %>/views/{,*/}*.html',
          '<%%= config.appDir %>/views/{,*/}*.jade',
        ],
        tasks: ['express:develop:start'],
        options: {
          spawn: false,
          livereload: config.livereload
        }
      }
    },

    express: {
      develop: {
        options: {
          script: './<%%= config.appDir %>/startapp.js',
          args: [
            '--vendorDir',  '<%%= config.bowerDir %>', 
            '--staticDir',  '<%%= config.staticDir %>',
            '--port',       9999,
            '--livereload', config.livereload 
          ]
        }
      }
    },

    // Empties folders to start fresh
    clean: {
      dist: {
        files: [{
          dot: true,
          src: [
            '<%%= config.distDir %>/*',
            '!<%%= config.distDir %>/.git*'
          ]
        }]
      },
      server: [
        '<%%= config.staticDir %>/images/*',
        '<%%= config.staticDir %>/styles/*',
        '<%%= config.staticDir %>/scripts/*'
      ]
    },

    // Make sure code styles are up to par and there are no obvious mistakes
    jshint: {
      options: {
        jshintrc: '.jshintrc',
        reporter: require('jshint-stylish')
      },
      all: [
        // 'Gruntfile.js',
        '<%%= config.clientDir %>/scripts/{,*/}*.js',
        'test/spec/{,*/}*.js'
      ]
    },

    // Mocha testing framework configuration options
    mocha: {
      all: {
        options: {
          run: true,
          // urls: ['http://<%%= connect.test.options.hostname %>:<%%= connect.test.options.port %>/index.html']
        }
      }
    },

    // Compiles Sass to CSS and generates necessary files if requested
    sass: {
      options: {
        loadPath: [
          '<%%= config.bowerDir %>'
        ]
      },
      dist: {
        files: [{
          expand: true,
          cwd: '<%%= config.clientDir %>/styles',
          src: ['*.scss'],
          dest: '<%%= config.staticDir %>/styles',
          ext: '.css'
        }]
      },
      client: {
        files: [{
          expand: true,
          cwd: '<%%= config.clientDir %>/styles',
          src: ['*.scss'],
          dest: '<%%= config.staticDir %>/styles',
          ext: '.css'
        }]
      }
    },
    
    jade: {
      client: {
        options: {
          client: true,
          amd: true,
          processName: function(filename) {
            filename = path.relative(config.templatesDir, filename);
            filename = filename.substr(0, filename.lastIndexOf('.'));
            return filename;
          }
        },
        files: [{
          src: ['<%%= config.templatesDir %>/{,*/}*.jade'],
          dest: '<%%= config.staticDir %>/scripts/templates.js'
        }]
      }
    },

    // Automatically inject Bower components into the app
    wiredep: {
      // app: {
      //   src: ['<%= yeoman.app %>/index.html'],
      //   ignorePath:  /\.\.\//
      // },
      sass: {
        src: ['<%%= config.clientDir %>/styles/{,*/}*.{scss,sass}'],
        ignorePath: /(\.\.\/){1,3}<%%= config.bowerDir %>\//
      }
    },

    // Add vendor prefixed styles
    autoprefixer: {
      options: {
        browsers: ['last 1 version']
      },
      dist: {
        files: [{
          expand: true,
          cwd: '<%%= config.staticDir %>/styles/',
          src: '{,*/}*.css',
          dest: '<%%= config.staticDir %>/styles/'
        }]
      }
    },

    // Renames files for browser caching purposes
    rev: {
      dist: {
        files: {
          src: [
            '<%%= config.distDir %>/scripts/{,*/}*.js',
            '<%%= config.distDir %>/styles/{,*/}*.css',
            '<%%= config.distDir %>/images/{,*/}*.*',
            '<%%= config.distDir %>/styles/fonts/{,*/}*.*',
            '<%%= config.distDir %>/*.{ico,png}'
          ]
        }
      }
    },

    // Reads HTML for usemin blocks to enable smart builds that automatically
    // concat, minify and revision files. Creates configurations in memory so
    // additional tasks can operate on them
    useminPrepare: {
      options: {
        dest: '<%%= config.distDir %>'
      },
      html: '<%%= config.appDir %>/index.html'
    },

    // Performs rewrites based on rev and the useminPrepare configuration
    usemin: {
      options: {
        assetsDirs: ['<%%= config.distDir %>', '<%%= config.distDir %>/images']
      },
      html: ['<%%= config.distDir %>/{,*/}*.html'],
      css: ['<%%= config.distDir %>/styles/{,*/}*.css']
    },

    // The following *-min tasks produce minified files in the dist folder
    imagemin: {
      dist: {
        files: [{
          expand: true,
          cwd: '<%%= config.clientDir %>/images',
          src: '{,*/}*.{gif,jpeg,jpg,png}',
          dest: '<%%= config.distDir %>/images'
        }]
      }
    },

    svgmin: {
      dist: {
        files: [{
          expand: true,
          cwd: '<%%= config.clientDir %>/images',
          src: '{,*/}*.svg',
          dest: '<%%= config.distDir %>/images'
        }]
      }
    },

    htmlmin: {
      dist: {
        options: {
          collapseBooleanAttributes: true,
          collapseWhitespace: true,
          removeAttributeQuotes: true,
          removeCommentsFromCDATA: true,
          removeEmptyAttributes: true,
          removeOptionalTags: true,
          removeRedundantAttributes: true,
          useShortDoctype: true
        },
        files: [{
          expand: true,
          cwd: '<%%= config.distDir %>',
          src: '{,*/}*.html',
          dest: '<%%= config.distDir %>'
        }]
      }
    },

    // By default, your `index.html`'s <!-- Usemin block --> will take care of
    // minification. These next options are pre-configured if you do not wish
    // to use the Usemin blocks.
    // cssmin: {
    //     dist: {
    //         files: {
    //             '<%%= config.distDir %>/styles/main.css': [
    //                 '.tmp/styles/{,*/}*.css',
    //                 '<%%= config.clientDir %>/styles/{,*/}*.css'
    //             ]
    //         }
    //     }
    // },
    // uglify: {
    //     dist: {
    //         files: {
    //             '<%%= config.distDir %>/scripts/scripts.js': [
    //                 '<%%= config.distDir %>/scripts/scripts.js'
    //             ]
    //         }
    //     }
    // },
    // concat: {
    //     dist: {}
    // },

    // Copies remaining files to places other tasks can use
    copy: {
      dist: {
        files: [{
          expand: true,
          dot: true,
          cwd: '<%%= config.clientDir %>',
          dest: '<%%= config.distDir %>',
          src: [
            '*.{ico,png,txt}',
            '.htaccess',
            'images/{,*/}*.webp',
            '{,*/}*.html',
            'styles/fonts/{,*/}*.*'
          ]
        }, {
          expand: true,
          dot: true,
          cwd: '.',
          src: ['<%%= config.bowerDir %>/bootstrap-sass-official/vendor/assets/fonts/bootstrap/*.*'],
          dest: '<%%= config.distDir %>'
        }]
      },
      images: {
        expand: true,
        dot: true,
        cwd: '<%%= config.clientDir %>/images',
        dest: '<%%= config.staticDir %>/images/',
        src: '{,*/}*'
      },
      pages: {
        expand: true,
        dot: true,
        cwd: '<%%= config.clientDir %>/pages',
        dest: '<%%= config.staticDir %>/pages/',
        src: '{,*/}*'
      },
      styles: {
        expand: true,
        dot: true,
        cwd: '<%%= config.clientDir %>/styles',
        dest: '<%%= config.staticDir %>/styles/',
        src: '{,*/}*.css'
      },
      scripts: {
        expand: true,
        dot: true,
        cwd: '<%%= config.clientDir %>/scripts',
        dest: '<%%= config.staticDir %>/scripts/',
        src: '{,*/}*.js'
      }
    },

    // Generates a custom Modernizr build that includes only the tests you
    // reference in your app
    modernizr: {
      dist: {
        devFile: '<%%= config.bowerDir %>/modernizr/modernizr.js',
        outputFile: '<%%= config.distDir %>/scripts/vendor/modernizr.js',
        files: {
          src: [
            '<%%= config.distDir %>/scripts/{,*/}*.js',
            '<%%= config.distDir %>/styles/{,*/}*.css',
            '!<%%= config.distDir %>/scripts/vendor/*'
          ]
        },
        uglify: true
      }
    },

    // Run some tasks in parallel to speed up build process
    concurrent: {
      server: [<% if (includeSass) { %>
        'sass:client',<% } %>
        'jade:client',
        'copy:images',
        'copy:pages',
        'copy:styles',
        'copy:scripts'
      ],
      test: [
        'copy:styles'
      ],
      dist: [<% if (includeSass) { %>
        'sass',<% } %>
        'copy:styles',
        'imagemin',
        'svgmin'
      ]
    }
  });


  grunt.registerTask('serve', function(target) {
    if (target === 'dist') {
      return grunt.task.run(['build', 'connect:dist:keepalive']);
    }

    grunt.task.run([
      'clean:server',
      'wiredep',
      'concurrent:server',
      'autoprefixer',
      'express:develop:start',
      'watch'
    ]);
  });

  grunt.registerTask('test', function(target) {
    if (target !== 'watch') {
      grunt.task.run([
        'clean:server',
        'concurrent:test',
        'autoprefixer'
      ]);
    }

    grunt.task.run([
      'connect:test',
      'mocha'
    ]);
  });

  grunt.registerTask('build', [
    'clean:dist',
    'useminPrepare',
    'concurrent:dist',
    'autoprefixer',
    'concat',
    'cssmin',
    'uglify',
    'copy:dist',
    'modernizr',
    'rev',
    'usemin',
    'htmlmin'
  ]);

  grunt.registerTask('default', [
    'newer:jshint',
    'test',
    'build'
  ]);
};
