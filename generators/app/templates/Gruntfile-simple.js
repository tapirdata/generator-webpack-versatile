// Generated on 2014-06-28 using generator-webapp 0.4.9
'use strict';

// # Globbing
// for performance reasons we're only matching one level down:
// 'test/spec/{,*/}*.js'
// use this if you want to recursively match all subfolders:
// 'test/spec/**/*.js'

module.exports = function (grunt) {

    // Load grunt tasks automatically
    require('load-grunt-tasks')(grunt);

    // Time how long tasks take. Can help when optimizing build times
    require('time-grunt')(grunt);

    // Configurable paths
    var config = {
        appDir:    'app',
        staticDir: 'static',
        distDir:   'dist'
    };

    // Define the configuration for all the tasks
    grunt.initConfig({

        // Project settings
        config: config,

        // Watches files for changes and runs tasks based on the changed files
        watch: {
            bower: {
                files: ['bower.json'],
                tasks: ['bowerInstall']
            },
            js: {
                files: ['<%= config.appDir %>/scripts/{,*/}*.js'],
                tasks: ['jshint'],
                options: {
                    livereload: true
                }
            },
            jstest: {
                files: ['test/spec/{,*/}*.js'],
                tasks: ['test:watch']
            },
            gruntfile: {
                files: ['Gruntfile.js']
            },
            sass: {
                files: ['<%= config.appDir %>/styles/{,*/}*.{scss,sass}'],
                tasks: ['sass:server', 'autoprefixer']
            },
            styles: {
                files: ['<%= config.appDir %>/styles/{,*/}*.css'],
                tasks: ['newer:copy:styles', 'autoprefixer']
            },
            livereloado: {
                options: {
                    livereload: true
                },
                files: [
                    '<%= config.appDir %>/{,*/}*.js',
                    '<%= config.appDir %>/views/{,*/}*.html',
                    '<%= config.appDir %>/views/{,*/}*.jade',
                    '<%= config.staticDir %>/styles/{,*/}*.css',
                    '<%= config.appDir %>/images/{,*/}*'
                ]
            }
        },

        // The actual grunt server settings
        // connect: {
        //     options: {
        //         port: 9000,
        //         open: true,
        //         livereload: 35729,
        //         // Change this to '0.0.0.0' to access the server from outside
        //         hostname: 'localhost'
        //     },
        //     livereload: {
        //         options: {
        //             middleware: function(connect) {
        //                 // console.log('connect=', connect);
        //                 return [
        //                     connect.static('.tmp'),
        //                     connect().use('/bower_components', connect.static('./bower_components')),
        //                     connect.static(config.appDir)
        //                 ];
        //             }
        //         }
        //     },
        //     test: {
        //         options: {
        //             open: false,
        //             port: 9001,
        //             middleware: function(connect) {
        //                 return [
        //                     connect.static('.tmp'),
        //                     connect.static('test'),
        //                     connect().use('/bower_components', connect.static('./bower_components')),
        //                     connect.static(config.appDir)
        //                 ];
        //             }
        //         }
        //     },
        //     dist: {
        //         options: {
        //             base: '<%= config.distDir %>',
        //             livereload: false
        //         }
        //     }
        // },

        develop: {
            server: {
                file: './<%= config.appDir %>/startapp.js',
                args: ['--port', '9999', '--develop']
            }
        },

        // Empties folders to start fresh
        clean: {
            dist: {
                files: [{
                    dot: true,
                    src: [
                        '<%= config.staticDir %>',
                        '<%= config.distDir %>/*',
                        '!<%= config.distDir %>/.git*'
                    ]
                }]
            },
            server: '<%= config.staticDir %>/styles'
        },

        // Make sure code styles are up to par and there are no obvious mistakes
        jshint: {
            options: {
                jshintrc: '.jshintrc',
                reporter: require('jshint-stylish')
            },
            all: [
                'Gruntfile.js',
                '<%= config.appDir %>/scripts/{,*/}*.js',
                '!<%= config.appDir %>/scripts/vendor/*',
                'test/spec/{,*/}*.js'
            ]
        },

        // Mocha testing framework configuration options
        mocha: {
            all: {
                options: {
                    run: true,
                    urls: ['http://<%= connect.test.options.hostname %>:<%= connect.test.options.port %>/index.html']
                }
            }
        },

        // Compiles Sass to CSS and generates necessary files if requested
        sass: {
            options: {
                includePaths: [
                    'bower_components'
                ]
            },
            dist: {
                files: [{
                    expand: true,
                    cwd: '<%= config.appDir %>/styles',
                    src: ['*.scss'],
                    dest: '<%= config.staticDir %>/styles',
                    ext: '.css'
                }]
            },
            server: {
                files: [{
                    expand: true,
                    cwd: '<%= config.appDir %>/styles',
                    src: ['*.scss'],
                    dest: '<%= config.staticDir %>/styles',
                    ext: '.css'
                }]
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
                    cwd: '<%= config.staticDir %>/styles/',
                    src: '{,*/}*.css',
                    dest: '<%= config.staticDir %>/styles/'
                }]
            }
        },

        // Automatically inject Bower components into the HTML file
        bowerInstall: {
            app: {
                src: ['<%= config.appDir %>/index.html'],
                exclude: ['bower_components/bootstrap-sass-official/vendor/assets/javascripts/bootstrap.js']
            },
            sass: {
                src: ['<%= config.appDir %>/styles/{,*/}*.{scss,sass}']
            }
        },

        // Renames files for browser caching purposes
        rev: {
            dist: {
                files: {
                    src: [
                        '<%= config.distDir %>/scripts/{,*/}*.js',
                        '<%= config.distDir %>/styles/{,*/}*.css',
                        '<%= config.distDir %>/images/{,*/}*.*',
                        '<%= config.distDir %>/styles/fonts/{,*/}*.*',
                        '<%= config.distDir %>/*.{ico,png}'
                    ]
                }
            }
        },

        // Reads HTML for usemin blocks to enable smart builds that automatically
        // concat, minify and revision files. Creates configurations in memory so
        // additional tasks can operate on them
        useminPrepare: {
            options: {
                dest: '<%= config.distDir %>'
            },
            html: '<%= config.appDir %>/index.html'
        },

        // Performs rewrites based on rev and the useminPrepare configuration
        usemin: {
            options: {
                assetsDirs: ['<%= config.distDir %>', '<%= config.distDir %>/images']
            },
            html: ['<%= config.distDir %>/{,*/}*.html'],
            css: ['<%= config.distDir %>/styles/{,*/}*.css']
        },

        // The following *-min tasks produce minified files in the dist folder
        imagemin: {
            dist: {
                files: [{
                    expand: true,
                    cwd: '<%= config.appDir %>/images',
                    src: '{,*/}*.{gif,jpeg,jpg,png}',
                    dest: '<%= config.distDir %>/images'
                }]
            }
        },

        svgmin: {
            dist: {
                files: [{
                    expand: true,
                    cwd: '<%= config.appDir %>/images',
                    src: '{,*/}*.svg',
                    dest: '<%= config.distDir %>/images'
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
                    cwd: '<%= config.distDir %>',
                    src: '{,*/}*.html',
                    dest: '<%= config.distDir %>'
                }]
            }
        },

        // By default, your `index.html`'s <!-- Usemin block --> will take care of
        // minification. These next options are pre-configured if you do not wish
        // to use the Usemin blocks.
        // cssmin: {
        //     dist: {
        //         files: {
        //             '<%= config.distDir %>/styles/main.css': [
        //                 '.tmp/styles/{,*/}*.css',
        //                 '<%= config.appDir %>/styles/{,*/}*.css'
        //             ]
        //         }
        //     }
        // },
        // uglify: {
        //     dist: {
        //         files: {
        //             '<%= config.distDir %>/scripts/scripts.js': [
        //                 '<%= config.distDir %>/scripts/scripts.js'
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
                    cwd: '<%= config.appDir %>',
                    dest: '<%= config.distDir %>',
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
                    src: ['bower_components/bootstrap-sass-official/vendor/assets/fonts/bootstrap/*.*'],
                    dest: '<%= config.distDir %>'
                }]
            },
            styles: {
                expand: true,
                dot: true,
                cwd: '<%= config.appDir %>/styles',
                dest: '<%= config.staticDir %>/styles/',
                src: '{,*/}*.css'
            }
        },

        // Generates a custom Modernizr build that includes only the tests you
        // reference in your app
        modernizr: {
            dist: {
                devFile: 'bower_components/modernizr/modernizr.js',
                outputFile: '<%= config.distDir %>/scripts/vendor/modernizr.js',
                files: {
                    src: [
                        '<%= config.distDir %>/scripts/{,*/}*.js',
                        '<%= config.distDir %>/styles/{,*/}*.css',
                        '!<%= config.distDir %>/scripts/vendor/*'
                    ]
                },
                uglify: true
            }
        },

        // Run some tasks in parallel to speed up build process
        concurrent: {
            server: [
                'sass:server',
                'copy:styles'
            ],
            test: [
                'copy:styles'
            ],
            dist: [
                'sass',
                'copy:styles',
                'imagemin',
                'svgmin'
            ]
        }
    });


    grunt.registerTask('serve', function (target) {
        if (target === 'dist') {
            return grunt.task.run(['build', 'connect:dist:keepalive']);
        }

        grunt.task.run([
            'clean:server',
            'concurrent:server',
            'autoprefixer',
            // 'connect:livereload',
            'develop',
            'watch'
        ]);
    });

    grunt.registerTask('server', function (target) {
        grunt.log.warn('The `server` task has been deprecated. Use `grunt serve` to start a server.');
        grunt.task.run([target ? ('serve:' + target) : 'serve']);
    });

    grunt.registerTask('test', function (target) {
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
