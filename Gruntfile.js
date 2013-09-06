'use strict';

var lrSnippet = require('connect-livereload')();

var mountFolder = function (connect, dir) {
    return connect.static(require('path').resolve(dir));
};

module.exports = function (grunt) {
    // load all grunt tasks
    require('matchdep').filterDev('grunt-*').forEach(grunt.loadNpmTasks);

    // configurable paths
    var pathConfig = {
        app : 'app',
        dist : 'dist',
        tmp : '.tmp'
    };

    grunt.initConfig({
        paths : pathConfig,
        watch : {
            compass : {
                files : ['<%= paths.app %>/{,*/}*/{,*/}*.{scss,png}'],
                tasks : ['compass']
            },
            livereload: {
                files: [
                    '<%= paths.app %>{,*/}*/*.html',
                    '<%= paths.tmp %>/stylesheets/*.css',
                    '<%= paths.app %>/javascripts/*.js',
                    '<%= paths.tmp %>/images/{,*/}*/{,*/}*.{png,jpg,jpeg,gif,webp}'
                ],
                options : {
                    livereload : true
                }
            }
        },
        connect : {
            options : {
                port : 9999,
                hostname : '0.0.0.0'
            },
            dev : {
                options : {
                    middleware : function (connect) {
                        return [
                            lrSnippet,
                            mountFolder(connect, '.tmp'),
                            mountFolder(connect, pathConfig.app)
                        ];
                    }
                }
            }
        },
        open: {
            server : {
                path : 'http://127.0.0.1:<%= connect.options.port %>'
            }
        },
        clean : {
            dist : ['<%= paths.tmp %>', '<%= paths.dist %>'],
            server : '<%= paths.tmp %>'
        },
        requirejs : {
            dist : {
                options : {
                    optimize : 'uglify',
                    uglify : {
                        toplevel : true,
                        ascii_only : false,
                        beautify : false
                    },
                    preserveLicenseComments : true,
                    useStrict : false,
                    wrap : true
                }
            },
            source : {
                options : {
                    appDir : '<%= paths.app %>/javascripts',
                    dir :　'<%= paths.dist %>/javascripts',
                    optimize : 'uglify',
                    uglify : {
                        toplevel : true,
                        ascii_only : false,
                        beautify : false
                    },
                    preserveLicenseComments : true,
                    useStrict : false,
                    wrap : true
                }
            }
        },
        compass : {
            options : {
                sassDir : '<%= paths.app %>/sass',
                cssDir : '<%= paths.tmp %>/stylesheets',
                imagesDir : '<%= paths.app %>/sprites',
                generatedImagesDir : '<%= paths.tmp %>/images',
                httpGeneratedImagesPath: '../images',
                relativeAssets : false
            },
            dist : {
                options : {
                    cssDir : '<%= paths.dist %>/stylesheets',
                    generatedImagesDir : '<%= paths.dist %>/images',
                    outputStyle : 'compressed'
                }
            },
            server : {
                options : {
                    debugInfo : true
                }
            }
        },
        useminPrepare : {
            html : ['<%= paths.app %>/index.html'],
            options : {
                dest : '<%= paths.dist %>'
            }
        },
        usemin : {
            html : ['<%= paths.dist %>/index.html'],
            options : {
                dirs : ['<%= paths.dist %>']
            }
        },
        htmlmin : {
            dist : {
                files : [{
                    expand : true,
                    cwd : '<%= paths.app %>',
                    src : ['*.html'],
                    dest : '<%= paths.dist %>'
                }]
            }
        },
        copy : {
            dist : {
                files : [{
                    expand : true,
                    dot : true,
                    cwd : '<%= paths.app %>',
                    dest : '<%= paths.dist %>',
                    src : [
                        'javascripts/nls/*/*.js',
                        'images/{,*/}*.{webp,gif,png,jpg,jpeg}'
                    ]
                }]
            }
        },
        imagemin : {
            dist : {
                files : [{
                    expand : true,
                    cwd : '<%= paths.dist %>/images',
                    src : '{,*/}*.{png,jpg,jpeg}',
                    dest : '<%= paths.dist %>/images'
                }]
            }
        }
    });

    grunt.registerTask('server', [
        'clean:server',
        'compass:server',
        'connect:dev',
        'open',
        'watch'
    ]);

    grunt.registerTask('build', [
        'clean:dist',
        'compass:dist',
        'copy',
        'useminPrepare',
        'concat',
        'uglify',
        'requirejs:dist',
        'htmlmin',
        'usemin'
    ]);
};
