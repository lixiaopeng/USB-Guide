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
                tasks : ['compass:server']
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
            server : '<%= paths.tmp %>',
            index: [
                '<%= paths.dist %>/index.html',
                '<%= paths.dist %>/images/progress.png',
                '<%= paths.dist %>/images/sprite-*.png'
            ]
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
            }
        },
        compass : {
            options : {
                sassDir : '<%= paths.app %>/sass',
                cssDir : '<%= paths.tmp %>/stylesheets',
                imagesDir : '<%= paths.app %>/sprites',
                generatedImagesDir : '<%= paths.tmp %>/images',
                relativeAssets : false
            },
            dist : {
                options : {
                    cssDir : '<%= paths.dist %>/stylesheets',
                    generatedImagesDir : '<%= paths.dist %>/images',
                    outputStyle : 'compressed',
                    httpGeneratedImagesPath: '{placeholder}/images'
                }
            },
            server : {
                options : {
                    generatedImagesDir : '<%= paths.tmp %>/images',
                    httpGeneratedImagesPath : '../images',
                    debugInfo : false
                }
            }
        },
        useminPrepare : {
            html : ['<%= paths.app %>/*.html'],
            options : {
                dest : '<%= paths.dist %>'
            }
        },
        usemin : {
            html : ['<%= paths.dist %>/*.html'],
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
                        'javascripts/DD_belatedPNG_0.0.8a-min.js',
                        'images/**/{,*/}*.{webp,gif,png,jpg,jpeg}'
                    ]
                }]
            },
            index : {
                files : [{
                    expand : true,
                    dot : true,
                    cwd : '<%= paths.dist %>',
                    dest : 'usb-guide',
                    src : [
                        'index.html',
                        'images/progress.png',
                        'images/sprite-*.png'
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
        },
        replace: {
            dist: {
                src: ['<%= paths.dist %>/index.html'],
                overwrite: true,
                replacements: [{
                    from: '//@@require.js',
                    to: '<%= grunt.file.read(paths.dist + "/components/requirejs/require.js") %>'
                }, {
                    from: '//@@style.css',
                    to: '<%= grunt.file.read(paths.dist + "/stylesheets/style.css") %>'
                }, {
                    from: '//@@DD_belatedPNG_0.0.8a-min.js',
                    to: '<%= grunt.file.read(paths.dist + "/javascripts/DD_belatedPNG_0.0.8a-min.js") %>'
                }]
            },
            cdn: {
                src: ['<%= paths.dist %>/usb-debug.html'],
                overwrite: true,
                replacements: [{
                    from: /<script(.+)src=['"]([^"']+)["']/gm,
                    to: '<script$1src="http://s.wdjimg.com/usb-engine/$2"'
                }, {
                    from: /<link([^\>]+)href=['"]([^"']+)["']/gm,
                    to: '<link$1href="http://s.wdjimg.com/usb-engine/$2"'
                }]
            }
        },
        rev: {
            dist: {
                files: {
                    src: [
                        '<%= paths.dist %>/javascripts/usb-debug.js',
                        '<%= paths.dist %>/stylesheets/usb-debug.css',
                        '<%= paths.dist %>/stylesheets/ie6.css',
                        '<%= paths.dist %>/stylesheets/ie7.css'
                    ]
                }
            }
        },
        shell: {
            replace : {
                command : './build.sh'
            }
        },
        wandoulabs_deploy : {
            options : {
                authKey : '.wdrc'
            },
            product : {
                deployCDN : {
                    src : '<%= paths.dist %>',
                    target : 'usb-engine'
                },
                deployStatic : {
                    src : '<%= paths.dist %>',
                    target : 'usb-engine',
                    product : true
                }
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

    grunt.registerTask('prebuild', [
        'clean:dist',
        'compass:dist',
        'copy',
        'useminPrepare',
        'concat',
        'uglify',
        'requirejs:dist',
        'htmlmin',
        'rev',
        'usemin',
        'replace:dist',
        'replace:cdn'
    ]);

    grunt.registerTask('replace-main', function () {
        var output = grunt.file.read(pathConfig.dist + '/index.html').replace('//@@main.js', grunt.file.read(pathConfig.dist + "/javascripts/main.js"));
        grunt.file.write(pathConfig.dist + '/index.html', output);
    });

    grunt.registerTask('build', [
        'prebuild',
        'replace-main',
        'shell:replace',
        'copy:index',
        'clean:index'
    ]);

    grunt.registerTask('deploy', [
        'build',
        'wandoulabs_deploy:product'
    ]);
};
