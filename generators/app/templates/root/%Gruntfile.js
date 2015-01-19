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
    bowerDir: JSON.parse(fs.readFileSync('./.bowerrc')).directory,
    serverSrcDir:    '<%= serverSrcDir %>',
    clientSrcDir:    '<%= clientSrcDir %>',
    // targets
    developDir: '<%= developDir %>',
    distDir:    '<%= distDir %>',
    tgtDir:     '<%%= process.env.TGT_DIR || config.developDir %>',
    serverTgtDir: '<%%= config.tgtDir %>/server',
    clientTgtDir: '<%%= config.tgtDir %>/client',
    // options
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

      // copy tasks (client)
      clientStyles: {
        files: ['<%%= config.clientSrcDir %>/styles/{,*/}*.css'],
        tasks: ['newer:copy:clientStyles', 'autoprefixer']
      },
      clientScripts: {
        files: ['<%%= config.clientSrcDir %>/scripts/{,*/}*.js'],
        tasks: ['jshint', 'newer:copy:clientScripts']
      },
      clientImages: {
        files: ['<%%= config.clientSrcDir %>/images/{,*/}*'],
        tasks: ['newer:copy:clientImages']
      },
      clientPages: {
        files: ['<%%= config.clientSrcDir %>/pages/{,*/}*'],
        tasks: ['newer:copy:clientPages']
      },
      // transform tasks (client)
      clientSass: {
        files: ['<%%= config.clientSrcDir %>/styles/{,*/}*.{scss,sass}'],
        tasks: ['sass:client', 'autoprefixer']
      },
      clientJade: {
        files: ['<%%= config.clientSrcDir %>/templates/{,*/}*.jade'],
        tasks: ['jade:client']
      },
      // copy tasks (server)
      serverScripts: {
        files: ['<%%= config.serverSrcDir %>/scripts/{,*/}*.js'],
        tasks: ['jshint', 'newer:copy:serverScripts']
      },
      serverViews: {
        files: ['<%%= config.serverSrcDir %>/views/{,*/}*.{jade,html}'],
        tasks: ['jshint', 'newer:copy:serverViews']
      },
      // transform tasks (server)
      // reload (client)
      livereload: {
        files: [
          '<%%= config.clientTgtDir %>/styles/{,*/}*.css',
          '<%%= config.clientTgtDir %>/scripts/{,*/}*.js',
          '<%%= config.clientTgtDir %>/images/{,*/}*'
        ],
        options: {
          livereload: config.livereload
        }
      },
      // reload (server)
      express: {
        files: [
          '<%%= config.serverTgtDir %>/scripts/{,*/}*.js',
          '<%%= config.serverTgtDir %>/views/{,*/}*.{jade,html}',
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
          script: './<%%= config.serverTgtDir %>/scripts/startapp.js',
          args: [
            '--vendorDir',  '<%%= config.bowerDir %>', 
            '--clientDir',  '<%%= config.clientTgtDir %>',
            '--port',       9999,
            '--livereload', config.livereload 
          ]
        }
      }
    },

    // Empties folders to start fresh
    clean: {
      target: [
        '<%%= config.clientTgtDir %>/*',
        '<%%= config.serverTgtDir %>/*',
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
        '<%%= config.clientSrcDir %>/scripts/{,*/}*.js',
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
          cwd: '<%%= config.clientSrcDir %>/styles',
          src: ['*.scss'],
          dest: '<%%= config.clientTgtDir %>/styles',
          ext: '.css'
        }]
      },
      client: {
        files: [{
          expand: true,
          cwd: '<%%= config.clientSrcDir %>/styles',
          src: ['*.scss'],
          dest: '<%%= config.clientTgtDir %>/styles',
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
            filename = path.relative( path.join(config.clientSrcDir, 'templates'), filename);
            filename = filename.substr(0, filename.lastIndexOf('.'));
            return filename;
          }
        },
        files: [{
          src: ['<%%= config.clientSrcDir %>/templates/{,*/}*.jade'],
          dest: '<%%= config.clientTgtDir %>/scripts/templates.js'
        }]
      }
    },

    // Automatically inject Bower components into the app
    wiredep: {
      // app: {
      //   ignorePath:  /\.\.\//
      // },
      sass: {
        src: ['<%%= config.clientSrcDir %>/styles/{,*/}*.{scss,sass}'],
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
          cwd: '<%%= config.clientTgtDir %>/styles/',
          src: '{,*/}*.css',
          dest: '<%%= config.clientTgtDir %>/styles/'
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
      html: '<%%= config.serverSrcDir %>/index.html'
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
          cwd: '<%%= config.clientSrcDir %>/images',
          src: '{,*/}*.{gif,jpeg,jpg,png}',
          dest: '<%%= config.distDir %>/images'
        }]
      }
    },

    svgmin: {
      dist: {
        files: [{
          expand: true,
          cwd: '<%%= config.clientSrcDir %>/images',
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

    // Copies remaining files to places other tasks can use
    copy: {
      clientImages: {
        expand: true,
        dot: true,
        cwd: '<%%= config.clientSrcDir %>/images',
        dest: '<%%= config.clientTgtDir %>/images/',
        src: '{,*/}*'
      },
      clientPages: {
        expand: true,
        dot: true,
        cwd: '<%%= config.clientSrcDir %>/pages',
        dest: '<%%= config.clientTgtDir %>/pages/',
        src: '{,*/}*'
      },
      clientStyles: {
        expand: true,
        dot: true,
        cwd: '<%%= config.clientSrcDir %>/styles',
        dest: '<%%= config.clientTgtDir %>/styles/',
        src: '{,*/}*.css'
      },
      clientScripts: {
        expand: true,
        dot: true,
        cwd: '<%%= config.clientSrcDir %>/scripts',
        dest: '<%%= config.clientTgtDir %>/scripts/',
        src: '{,*/}*.js'
      },
      serverScripts: {
        expand: true,
        dot: true,
        cwd: '<%%= config.serverSrcDir %>/scripts',
        dest: '<%%= config.serverTgtDir %>/scripts/',
        src: '{,*/}*.js'
      },
      serverViews: {
        expand: true,
        dot: true,
        cwd: '<%%= config.serverSrcDir %>/views',
        dest: '<%%= config.serverTgtDir %>/views/',
        src: '{,*/}*.{html,jade}'
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
      makeTarget: [<% if (includeSass) { %>
        'sass:client',<% } %>
        'jade:client',
        'copy:clientImages',
        'copy:clientPages',
        'copy:clientStyles',
        'copy:clientScripts',
        'copy:serverScripts',
        'copy:serverViews'
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
      return grunt.task.run(['build', 'express:dist:keepalive']);
    }

    grunt.task.run([
      'clean:target',
      'wiredep',
      'concurrent:makeTarget',
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

  grunt.registerTask('showConfig', function() {
    console.log('config=', grunt.config('config'));
  });

  grunt.registerTask('switchTarget', function(name) {
    var tgtDir;
    if (name === 'dist') {
      tgtDir = grunt.config('config.distDir');
    } else {
      tgtDir = grunt.config('config.developDir');
    }
    process.env.TGT_DIR = tgtDir;
  });

  grunt.registerTask('build', function() {
    grunt.task.run([
      'switchTarget:dist',
      'clean:target',
      'wiredep',
      'concurrent:makeTarget',
    ]);
  });

  grunt.registerTask('default', [
    'newer:jshint',
    'test',
    'build'
  ]);
};
