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
        tmp : '.tmp',
        test : 'test'
    };

    grunt.initConfig({
        paths : pathConfig,
        watch : {
            compass : {
                files : ['<%= paths.app %>/compass/{,*/}*/{,*/}*.{scss,sass,png,ttf}'],
                tasks : ['compass:server']
            },
            test : {
                files : ['<%= paths.app %>/javascripts/**/*.js'],
                tasks : ['jshint:test', 'karma:server:run'],
                options : {
                    spawn : false
                }
            },
            livereload: {
                files: [
                    '<%= paths.app %>/*.html',
                    '<%= paths.app %>/javascripts/**/*.js',
                    '<%= paths.app %>/images/**/*.*',
                    '<%= paths.tmp %>/stylesheets/**/*.css',
                    '<%= paths.tmp %>/images/**/*.*'
                ],
                options : {
                    livereload : true,
                    spawn : false
                }
            }
        },
        connect : {
            options : {
                port : 9999,
                hostname : '0.0.0.0'
            },
            server : {
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
                path : 'http://127.0.0.1:<%= connect.options.port %>',
                app : 'Google Chrome Canary'
            }
        },
        clean : {
            dist : ['<%= paths.tmp %>', '<%= paths.dist %>'],
            server : '<%= paths.tmp %>',
            index: [
                '<%= paths.dist %>/index.html',
                '<%= paths.dist %>/images/progress.png',
                '<%= paths.dist %>/images/connecting.png',
                '<%= paths.dist %>/images/sprite-*.png'
            ]
        },
        useminPrepare : {
            html : ['<%= paths.app %>/*.html'],
            options : {
                dest : '<%= paths.dist %>'
            }
        },
        usemin: {
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
                        'images/**/*.{webp,gif,png,jpg,jpeg}',
                        'components/requirejs/require.js'
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
                        'images/connecting.png',
                        'images/sprite-*.png'
                    ]
                }]
            }
        },
        compass : {
            options : {
                sassDir : '<%= paths.app %>/compass/sass',
                cssDir : '<%= paths.tmp %>/stylesheets',
                imagesDir : '<%= paths.app %>/compass/images',
                fontsDir : '<%= paths.app %>/compass/fonts',
                relativeAssets : true
            },
            dist : {
                options : {
                    cssDir : '<%= paths.dist %>/stylesheets',
                    generatedImagesDir : '<%= paths.dist %>/images',
                    outputStyle : 'compressed',
                    httpGeneratedImagesPath: './images'
                }
            },
            server : {
                options : {
                    generatedImagesDir : '<%= paths.tmp %>/images',
                    debugInfo : true
                }
            }
        },
        rev: {
            dist: {
                files: {
                    src: [
                        '<%= paths.dist %>/javascripts/usb-debug.js',
                        '<%= paths.dist %>/javascripts/jquery.scrollbar.js',
                        '<%= paths.dist %>/javascripts/jquery.color.js',
                        '<%= paths.dist %>/stylesheets/usb-debug.css',
                        '<%= paths.dist %>/stylesheets/ie6.css',
                        '<%= paths.dist %>/stylesheets/ie7.css'
                    ]
                }
            }
        },
        imagemin : {
            dist : {
                files : [{
                    expand : true,
                    cwd : '<%= paths.dist %>/images',
                    src : '**/*.{png,jpg,jpeg}',
                    dest : '<%= paths.dist %>/images'
                }]
            }
        },
        requirejs : {
            dist : {
                options : {
                    almond : true,
                    appDir : '<%= paths.app %>/javascripts',
                    dir :　'<%= paths.dist %>/javascripts',
                    optimize : 'uglify',
                    baseUrl : './',
                    uglify : {
                        toplevel : true,
                        ascii_only : false,
                        beautify : false
                    },
                    paths : {
                        $ : '../components/jquery/jquery',
                        i18n : '../components/requirejs-i18n/i18n',
                        _ : '../components/underscore/underscore'
                    },
                    shim: {
                        $ : {
                            exports : '$'
                        },
                        _ : {
                            exports : '_'
                        }
                    },
                    preserveLicenseComments : true,
                    useStrict : false,
                    wrap : true,
                    modules : [{
                        name : 'main',
                        include : ['jquery', 'i18n', '_',]
                    }]
                }
            }
        },
        concurrent: {
            dist : ['copy:dist', 'compass:dist']
        },
        jshint : {
            test : ['<%= paths.app %>/javascripts/**/*.js']
        },
        karma : {
            options : {
                configFile : '<%= paths.test %>/karma.conf.js',
                browsers : ['Chrome_without_security']
            },
            server : {
                reporters : ['progress'],
                background : true
            },
            test : {
                reporters : ['progress', 'junit', 'coverage'],
                preprocessors : {
                    '<%= paths.app %>/javascripts/**/*.js' : 'coverage'
                },
                junitReporter : {
                    outputFile : '<%= paths.test %>/output/test-results.xml'
                },
                coverageReporter : {
                    type : 'html',
                    dir : '<%= paths.test %>/output/coverage/'
                },
                singleRun : true
            },
            travis : {
                browsers : ['PhantomJS'],
                reporters : ['progress'],
                singleRun : true
            }
        },
        bump : {
            options : {
                files : ['package.json', 'bower.json'],
                updateConfigs : [],
                commit : true,
                commitMessage : 'Release v%VERSION%',
                commitFiles : ['-a'],
                createTag : true,
                tagName : 'v%VERSION%',
                tagMessage : 'Version %VERSION%',
                push : false
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
                }/*,
                deployStatic : {
                    src : '<%= paths.dist %>',
                    target : 'usb-engine',
                    product : true
                }*/
            }
        }
    });

    grunt.registerTask('server', [
        'clean:server',
        'compass:server',
        'connect:server',
        'karma:server',
        'open',
        'watch'
    ]);

    grunt.registerTask('prebuild', [
        'clean:dist',
        'compass:dist',
        'requirejs:dist',
        'copy',
        'useminPrepare',
        'concat',
        'uglify',
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
