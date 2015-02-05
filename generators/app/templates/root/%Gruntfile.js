// Generated on 2014-06-28 using generator-webapp 0.4.9
'use strict';

// # Globbing
// for performance reasons we're only matching one level down:
// 'test/spec/{,*/}*.js'
// use this if you want to recursively match all subfolders:
// 'test/spec/**/*.js'

var fs = require('fs');
var path = require('path');
var _ = require('lodash');

module.exports = function(grunt) {

  process.env.TARGET = process.env.TARGET || 'develop';

  // Load grunt tasks automatically
  require('load-grunt-tasks')(grunt);

  // Time how long tasks take. Can help when optimizing build times
  require('time-grunt')(grunt);

  // Configurable paths
  var _config = {
    dirs: {
      bower: JSON.parse(fs.readFileSync('./.bowerrc')).directory,
      serverSrc: '<%= dirs.serverSrc %>',
      clientSrc: '<%= dirs.clientSrc %>',
      test:      '<%= dirs.test %>',
      // targets
      tmpDev :   '<%= dirs.tmpDev  %>',
      tmpTest:   '<%= dirs.tmpTest %>',
      dist:      '<%= dirs.dist %>',
      tgt:       '<%%= process.env.TARGET === "dist" ? config.dirs.dist : (process.env.TARGET === "test" ? config.dirs.tmpTest : config.dirs.tmpDev) %>',
      serverTgt: '<%%= config.dirs.tgt %>/server',
      clientTgt: '<%%= config.dirs.tgt %>/client',
    },  
    // options
    serverPort:   '<%%= process.env.TARGET === "dist" ? 8000 : (process.env.TARGET === "test" ? 8001 : 8002) %>',
    livereload: true  // use default port 35729
  };

  // Define the configuration for all the tasks
  grunt.initConfig({

    // Project settings
    config: _config,

    // Empties folders to start fresh
    clean: {
      target: [
        '<%%= config.dirs.clientTgt %>/*',
        '<%%= config.dirs.serverTgt %>/*',
      ]
    },

    // Make sure code styles are up to par and there are no obvious mistakes
    jshint: {
      options: {
        jshintrc: 'jshint.json',
        reporter: require('jshint-stylish')
      },
      root: {
        files: {
          src: ['Gruntfile.js']
        }
      },
      server: {
        files: {
          src: ['<%%= config.dirs.serverSrc %>/scripts/{,*/}*.js']
        }
      },
      client: {
        files: {
          src: ['<%%= config.dirs.clientSrc %>/scripts/{,*/}*.js']
        }
      },
      test: {
        files: {
          src: ['<%%= config.dirs.test %>/client/scripts/{,*/}*.js']
        }
      }
    },

    <% if (use.coffee) { %>coffeelint: {
      options: {
        configFile: 'coffeelint.json'
      },
      server: {
        files: {
          src: ['<%%= config.dirs.serverSrc %>/scripts/{,*/}*.coffee']
        }
      },
      client: {
        files: {
          src: ['<%%= config.dirs.clientSrc %>/scripts/{,*/}*.coffee']
        }
      },
      test: {
        files: {
          src: ['<%%= config.dirs.test %>/client/scripts/{,*/}*.coffee']
        }
      }
    },<% } %>

    // Automatically inject Bower components into the app
    wiredep: {
      sass: {
        src: ['<%%= config.dirs.clientSrc %>/styles/{,*/}*.{scss,sass}'],
        ignorePath: /(\.\.\/){1,3}<%%= config.dirs.bower %>\//
      }
    },

    <% if (use.coffee) { %>coffee: {
      client: {
        files: [{
          expand: true,
          cwd: '<%%= config.dirs.clientSrc %>/scripts',
          src: ['{,*/}*.coffee'],
          dest: '<%%= config.dirs.clientTgt %>/scripts',
          extDot: 'last',
          ext: '.js'
        }]
      },
      server: {
        files: [{
          expand: true,
          cwd: '<%%= config.dirs.serverSrc %>/scripts',
          src: ['{,*/}*.coffee'],
          dest: '<%%= config.dirs.serverTgt %>/scripts',
          extDot: 'last',
          ext: '.js'
        }]
      },
      test: {
        files: [{
          expand: true,
          cwd: '<%%= config.dirs.test %>/client/scripts',
          src: ['{,*/}*.coffee'],
          dest: '<%%= config.dirs.clientTgt %>/test/scripts/',
          extDot: 'last',
          ext: '.js'
        }]
      }   
    },<% } %>

    // Compiles Sass to CSS and generates necessary files if requested
    sass: {
      options: {
        loadPath: [
          '<%%= config.dirs.bower %>'
        ]
      },
      dist: {
        files: [{
          expand: true,
          cwd: '<%%= config.dirs.clientSrc %>/styles',
          src: ['*.scss'],
          dest: '<%%= config.dirs.clientTgt %>/styles',
          ext: '.css'
        }]
      },
      client: {
        files: [{
          expand: true,
          cwd: '<%%= config.dirs.clientSrc %>/styles',
          src: ['*.scss'],
          dest: '<%%= config.dirs.clientTgt %>/styles',
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
            filename = path.relative(path.join(grunt.config('config.dirs.clientSrc'), 'templates'), filename);
            filename = filename.substr(0, filename.lastIndexOf('.'));
            return filename;
          }
        },
        files: [{
          src: ['<%%= config.dirs.clientSrc %>/templates/{,*/}*.jade'],
          dest: '<%%= config.dirs.clientTgt %>/scripts/templates.js'
        }]
      }
    },


    // Generates a custom Modernizr build that includes only the tests you
    // reference in your app
    modernizr: {
      dist: {
        devFile: '<%%= config.dirs.bower %>/modernizr/modernizr.js',
        outputFile: '<%%= config.dirs.clientTgt %>/scripts/modernizr-custom.js',
        files: {
          src: [
            '<%%= config.dirs.clientTgt %>/scripts/{,*/}*.js',
            '<%%= config.dirs.clientTgt %>/styles/{,*/}*.css',
          ]
        },
        uglify: true
      }
    },

    // Copies remaining files to places other tasks can use
    copy: {
      client: {
        files: [
          {
            expand: true,
            dot: true,
            cwd: '<%%= config.dirs.clientSrc %>/images',
            dest: '<%%= config.dirs.clientTgt %>/images/',
            src: '{,*/}*'
          },
          {
            expand: true,
            dot: true,
            cwd: '<%%= config.dirs.clientSrc %>/pages',
            dest: '<%%= config.dirs.clientTgt %>/pages/',
            src: '{,*/}*'
          },
          {
            expand: true,
            dot: true,
            cwd: '<%%= config.dirs.clientSrc %>/styles',
            dest: '<%%= config.dirs.clientTgt %>/styles/',
            src: '{,*/}*.css'
          },
          {
            expand: true,
            dot: true,
            cwd: '<%%= config.dirs.clientSrc %>/scripts',
            dest: '<%%= config.dirs.clientTgt %>/scripts/',
            src: ['{,*/}*.js', '!{,*/}*.tpl.js']
          },
        ]
      },
      server: {
        files: [
          {
            expand: true,
            dot: true,
            cwd: '<%%= config.dirs.serverSrc %>/scripts',
            dest: '<%%= config.dirs.serverTgt %>/scripts/',
            src: '{,*/}*.js'
          },
          {
            expand: true,
            dot: true,
            cwd: '<%%= config.dirs.serverSrc %>/views',
            dest: '<%%= config.dirs.serverTgt %>/views/',
            src: '{,*/}*.{html,jade}'
          }
        ]
      },
      test: {
        files: [
          {
            expand: true,
            dot: true,
            cwd: '<%%= config.dirs.test %>/client/scripts',
            dest: '<%%= config.dirs.clientTgt %>/test/scripts/',
            src: ['{,*/}*.js', '!{,*/}*.tpl.js']
          }
        ]  
      },
    },

    template: {
      client: {
        options: {
          data: {
            appBaseUrl: '/app',
            vendorBaseUrl: '/vendor'
          }
        },
        files: [
          { 
            expand: true,
            dot: true,
            cwd: '<%%= config.dirs.clientSrc %>/scripts',
            dest: '<%%= config.dirs.clientTgt %>/scripts/',
            src: ['{,*/}*.tpl.js'],
            ext: '.js'
          }
        ]
      },
      test: {
        options: {
          data: {
            testBaseUrl: '/base/<%%= config.dirs.clientTgt %>/test',
            appBaseUrl: 'http://localhost:<%%= config.serverPort %>/app',
            vendorBaseUrl: 'http://localhost:<%%= config.serverPort %>/vendor'
          }
        },
        files: [
          { 
            expand: true,
            dot: true,
            cwd: '<%%= config.dirs.test %>/client/scripts',
            dest: '<%%= config.dirs.clientTgt %>/test/scripts/',
            src: ['{,*/}*.tpl.js'],
            ext: '.js'
          }
        ]
      }
    },

    express: {
      develop: {
        options: {
          script: './<%%= config.dirs.serverTgt %>/scripts/startapp.js',
          args: [
            '--vendorDir',  '<%%= config.dirs.bower %>', 
            '--clientDir',  '<%%= config.dirs.clientTgt %>',
            '--port',       '<%%= config.serverPort %>',
            '--livereload', '<%%= config.livereload %>'
          ]
        }
      },
      test: {
        options: {
          script: './<%%= config.dirs.serverTgt %>/scripts/startapp.js',
          args: [
            '--vendorDir',  '<%%= config.dirs.bower %>', 
            '--clientDir',  '<%%= config.dirs.clientTgt %>',
            '--port',       '<%%= config.serverPort %>',
          ]
        }
      },
      dist: {
        options: {
          script: './<%%= config.dirs.serverTgt %>/scripts/startapp.js',
          args: [
            '--vendorDir',  '<%%= config.dirs.bower %>', 
            '--clientDir',  '<%%= config.dirs.clientTgt %>',
            '--port',       '<%%= config.serverPort %>',
          ]
        }
      }
    },

    setupKarma: {
      all: {
        files: [
          {
            cwd: '<%%= config.dirs.clientTgt %>/test/scripts',
            src: '**/*.test.js',
          }
        ]
      }   
    },

    karma: {
      all: {
        files: [
          { 
            src: '<%%= config.dirs.clientTgt %>/test/scripts/main.js',
          },
          {
            src: '<%%= config.dirs.clientTgt %>/test/scripts/{,*/}*.js',
            included: false
          },
        ],
        frameworks: [
          'mocha'<% if (use.amd === 'requirejs') { %>,
          'requirejs'<% } %><% if (use.amd === 'curl') { %>,
          'curl-amd'<% } %>
        ],
        browsers: [
          'PhantomJS', 
          'Chrome'
        ],
        // background: true,
        // singleRun: true,
        // browserNoActivityTimeout: 100000,
        // captureTimeout: 5000,
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
          cwd: '<%%= config.dirs.clientTgt %>/styles/',
          src: '{,*/}*.css',
          dest: '<%%= config.dirs.clientTgt %>/styles/'
        }]
      }
    },

    // Run some tasks in parallel to speed up build process
    concurrent: {
      makeTarget: [<% if (use.sass) { %>
        'sass:client',<% } %>
        'jade:client',
        'copy:client',<% if (use.coffee) { %>
        'coffee:client',<% } %>
        'template:client',
        'copy:server',<% if (use.coffee) { %>
        'coffee:server',<% } %>
      ],
    },

    watch: {},

    // Watches files for changes and runs tasks based on the changed files
    setupWatch: {
      all: {
        tasks: {
          bower: {
            files: ['bower.json'],
            tasks: ['wiredep']
          },
          gruntfile: {
            files: ['Gruntfile.js'],
            tasks: ['jshint:root']
          },

          // copy tasks (client)
          clientScripts: {
            files: ['<%%= config.dirs.clientSrc %>/scripts/{,*/}*.js'],
            tasks: ['newer:jshint:client', 'newer:copy:client', 'newer:template:client']
          },
          clientStyles: {
            files: ['<%%= config.dirs.clientSrc %>/styles/{,*/}*.css'],
            tasks: ['newer:copy:client', 'autoprefixer']
          },
          clientImages: {
            files: ['<%%= config.dirs.clientSrc %>/images/{,*/}*'],
            tasks: ['newer:copy:client']
          },
          clientPages: {
            files: ['<%%= config.dirs.clientSrc %>/pages/{,*/}*'],
            tasks: ['newer:copy:client']
          },
          // transform tasks (client)
          <% if (use.coffee) { %>clientCoffee: {
            files: ['<%%= config.dirs.clientSrc %>/scripts/{,*/}*.coffee'],
            tasks: ['newer:coffeelint:client', 'newer:coffee:client']
          },
          <% } %>clientSass: {
            files: ['<%%= config.dirs.clientSrc %>/styles/{,*/}*.{scss,sass}'],
            tasks: ['sass:client', 'autoprefixer']
          },
          clientJade: {
            files: ['<%%= config.dirs.clientSrc %>/templates/{,*/}*.jade'],
            tasks: ['jade:client']
          },
          // copy tasks (server)
          serverScripts: {
            files: ['<%%= config.dirs.serverSrc %>/scripts/{,*/}*.js'],
            tasks: ['newer:jshint:server', 'newer:copy:server']
          },
          serverViews: {
            files: ['<%%= config.dirs.serverSrc %>/views/{,*/}*.{jade,html}'],
            tasks: ['newer:copy:server']
          },
          // transform tasks (server)
          <% if (use.coffee) { %>serverCoffee: {
            files: ['<%%= config.dirs.serverSrc %>/scripts/{,*/}*.coffee'],
            tasks: ['newer:coffeelint:server', 'newer:coffee:server']
          },
          <% } %>// copy tasks (test)
          testScripts: {
            scope: 'test',
            files: ['<%%= config.dirs.test %>/client/scripts/{,*/}*.js'],
            tasks: ['newer:jshint:server', 'newer:copy:test']
          },
          // transform tasks (test)
          <% if (use.coffee) { %>testCoffee: {
            scope: 'test',
            files: [
              '<%%= config.dirs.test %>/client/scripts/{,*/}*.coffee',
              '<%%= config.dirs.test %>/server/scripts/{,*/}*.coffee'
            ],
            tasks: ['newer:coffeelint:test', 'newer:coffee:test']
          },
          <% } %>// reload (client)
          livereload: {
            scope: 'develop',
            files: [
              '<%%= config.dirs.clientTgt %>/styles/{,*/}*.css',
              '<%%= config.dirs.clientTgt %>/scripts/{,*/}*.js',
              '<%%= config.dirs.clientTgt %>/images/{,*/}*'
            ],
            options: {
              livereload: '<%%= config.livereload %>'
            }
          },
          // reload (server)
          express: {
            files: [
              '<%%= config.dirs.serverTgt %>/scripts/{,*/}*.js',
              '<%%= config.dirs.serverTgt %>/views/{,*/}*.{jade,html}',
            ],
            tasks: ['express:develop:start'],
            options: {
              spawn: false,
              livereload: '<%%= config.livereload %>'
            }
          },
          // reload (karma)
          karma: {
            scope: 'test',
            files: [
              // '<%%= config.dirs.clientTgt %>/styles/{,*/}*.css',
              '<%%= config.dirs.clientTgt %>/scripts/{,*/}*.js',
              '<%%= config.dirs.clientTgt %>/test/scripts/{,*/}*.js'
            ],
            tasks: ['karma:all:run']
          }
        }
      }         
    },
  });


  grunt.registerTask('serve', function(target) {
    if (target === 'dist') {
      return grunt.task.run([
        'build', 
        'express:dist', 
        'keepalive'
      ]);
    }

    grunt.task.run([
      'clean:target',
      'wiredep',
      'jshint',<% if (use.coffee) { %>
      'coffeelint',<% } %>
      'concurrent:makeTarget',
      'express:develop:start',
      'setupWatch',
      'watch'
    ]);
  });

  grunt.registerMultiTask('setupWatch', function() {
    var tasks = this.data.tasks;
    var targetScope = process.env.TARGET;
    // console.log('tasks=', tasks);
    tasks = _.transform(tasks, function(tasks, task, name) {
      var ok;
      var scope = task.scope;
      if (!scope) {
        ok = true;
      } else {
        if (_.isString(scope)) {
          scope = scope.split(',').map(_.trim);
        }
        if (_.isArray(scope)) {
          if (_.indexOf(scope, targetScope) >= 0) {
            ok = true;
          }
        }
      }
      if (ok) {
        tasks[name] = _.omit(task, 'scope');
      }
    });
    // console.log('..tasks=', tasks);
    grunt.config.set('watch', tasks);
  });


  grunt.registerMultiTask('setupKarma', function() {
    var configBase = 'karma.' + this.target;
    for (var i=0; i<arguments.length; ++i) {
      var arg = arguments[i];
      switch (arg) {
        case 'files':
          var testFiles = this.filesSrc;
          console.log('target=%s testFiles=', this.target, testFiles);
          grunt.config.set(configBase + '.client.testFiles', testFiles);
          break;
        case 'single':
          grunt.config.set(configBase + '.background', false);
          grunt.config.set(configBase + '.singleRun', true);
          break;
        case 'back':
          grunt.config.set(configBase + '.background', true);
          grunt.config.set(configBase + '.singleRun', false);
          break;
        default:
          console.log('setupKarma: unexpected arg %s', arg);
      }
    }

  });

  grunt.registerTask('test', function() {
    var targets = _.object(_.map(arguments, function(arg) {return [arg, true]; }));
    if (!targets.watch && !targets.single) {
      targets.single = true;
    }
    grunt.task.run([
      'switchTarget:test',
      'jshint',<% if (use.coffee) { %>
      'coffeelint',<% } %>
    ]);
    if (!targets.fast) {
      grunt.task.run([
        'clean:target',
        'concurrent:makeTarget',
      ]);
    }  
    grunt.task.run([
      'copy:test',
      'template:test',<% if (use.coffee) { %>
      'coffee:test',<% } %>
      'express:test:start',
    ]);
    if (targets.single) {
      grunt.task.run([
        'setupKarma:all:files:single',
        'karma:all',
      ]);
    }
    if (targets.watch) {
      grunt.task.run([
        'setupKarma:all:files:back',
        'karma:all',
        'setupWatch',
        'watch'
      ]);
    }
  });

  grunt.registerTask('switchTarget', function(name) {
    process.env.TARGET = name;
  });

  grunt.registerTask('showConfig', function(name) {
    name = name || 'config';
    console.log('config("%s")=', name, grunt.config(name));
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
    'test',
    'build'
  ]);
};
