module.exports = function(grunt) {
	
	// Require it at the top and pass in the grunt instance
	require('jit-grunt')(grunt, {
		scsslint: 'grunt-scss-lint'
	});
	require('time-grunt')(grunt);
	
	// All configuration goes here 
	grunt.initConfig({
		pkg: grunt.file.readJSON('package.json'),
		
		// Accessibility Configuration
		accessibility: {
			options : {
				accessibilityLevel: 'WCAG2A',
				verbose: true
			},
			all : {
				files: [
					{
						cwd: 'build/',
						dest: 'reports/',
						expand: true,
						ext: '-report.txt',
						src: ['*.html']
					}
				]
			}
		},
		
		// Configuration for assemble
		assemble: {
			options: {
				data: 'source/assemble/data/**/*.{json,yml}',
				helpers: 'source/assemble/helpers/**/*.js',
				layoutdir: 'source/assemble/layouts/',
				partials: ['source/assemble/partials/**/*.hbs', 'build/tmp/icon-sprite.svg', 'dist/tmp/icon-sprite.svg']
			},
			dev: {
				files: [
					{
						cwd: 'source/assemble/pages/',
						dest: 'build/',
						expand: true,
						flatten: true,
						src: ['**/*.hbs']
					}
				]
			},
			dist: {
				files: [
					{
						cwd: 'source/assemble/pages/',
						dest: 'dist/',
						expand: true,
						flatten: true,
						src: ['**/*.hbs']
					}
				]
			}
		},
		
		// Configuration for autoprefixer
		autoprefixer: {
			options: {
				browsers: ['last 2 versions', 'ie 9']
			},
			dev: {
				options: {
					map: true
				},
				src: 'build/css/*.css'
			},
			dist: {
				src: 'dist/css/*.css'
			}
		},
		
		// Configuration for deleting files
		clean: {
			dev: {
				files: [
					{
						filter: 'isFile',
						src: ['build/**/*']
					}
				]
			},
			dist: {
				files: [
					{
						filter: 'isFile',
						src: ['dist/**/*']
					}
				]
			},
			dist_js: {
				files: [
					{
						filter: 'isFile',
						src: ['dist/**/_*.js']
					}
				]
			},
			docs: {
				dist: ['jsdocs/**/*']
			}
		},
		
		// Configuration for compass
		compass: {
			options: {
				debugInfo: false,
				force: true,
				noLineComments: true,
				outputStyle: 'expanded', // minifying for dist will be done by grunt-contrib-cssmin
				require: ['sass-globbing', 'compass/import-once'],
				sassDir: 'source/sass'
			},
			dev: {
				options: {
					cssDir: 'build/css',
					environment: 'development',
					sourcemap: true,
                    raw: [
                        'http_path = "/"',
                        'Sass::Script::Number.precision = 8',
                        'sass_options = {',
                        '  :cache => true,',
                        '}'
                    ].join("\n"),
                }
			},
			dist: {
				options: {
					cssDir: 'dist/css',
					environment: 'production',
					sourcemap: false,
                    raw: [
                        'http_path = "/"',
                        'Sass::Script::Number.precision = 8',
                        'sass_options = {',
                        '  :cache => false,',
                        '}'
                    ].join("\n"),
                }
			}
		},
		
		// Configuration for run tasks concurrently
		concurrent: {
			dev: ['compass:dev', 'assemble:dev', 'modernizr'],
			dist: ['compass:dist', 'assemble:dist', 'modernizr']
		},
		
		// Configuration for livereload
		connect: {
			livereload: {
				options: {
					base: 'build',
					hostname: '0.0.0.0',
					port: 9002,
					middleware: function(connect, options) {
						return [
							require('connect-livereload')({
								port: 35730
							}),
							connect.static(options.base),
							connect.directory(options.base)
						]
					}
				},
				files: {
					src: ['*/*.html']
				}
			}
		},
		
		// Configuration for copying files
		copy: {
			ajax: {
				cwd: 'source/ajax-content/',
				dest: 'dist/ajax-content/',
				expand: true,
				src: ['**/*']
			},
			favicon: {
				cwd: 'source/img/',
				dest: 'dist/img/',
				expand: true,
				src: ['**/*.ico']
			},
			fonts: {
				cwd: 'source/fonts/',
				dest: 'dist/fonts/',
				expand: true,
				src: ['**/*']
			},
			js: {
				cwd: 'source/js/',
				dest: 'dist/js/',
				expand: true,
				src: ['**/*']
			},
			styleguide: {
				cwd: 'build/css/',
				dest: 'styleguide/css/',
				expand: true,
				filter: 'isFile',
				flatten: true,
				src: ['**/*.css']
			}
		},
		
		// Configuration for minifying css-files
		cssmin: {
			dist: {
				cwd: 'dist/css/',
				dest: 'dist/css/',
				expand: true,
				src: ['*.css']
			}
		},
		
		// Configuration for splitting css-files (e.g. IE9)
		csssplit: {
			options: {
				maxRules: 500,
				suffix: '-part'
			},
			dev: {
				dest: 'build/css',
				src: 'build/css/styles.css'
			},
			dist: {
				dest: 'dist/css',
				src: 'dist/css/styles.css'
			}
		},
		
		// Configuration for grouping media queries
		group_css_media_queries: {
			dist: {
				files: {
					'dist/css/styles.css': ['dist/css/styles.css']
				}
			}
		},
		
		// Configuration for managing SVG-icons
		grunticon: {
			options: {
				cssprefix: '%icon-',
				datapngcss: '_icons-data-png.scss',
				datasvgcss: '_icons-data-svg.scss',
				urlpngcss: '_icons-fallback.scss'
			},
            dev: {
                options: {
                    pngfolder: 'build/img/bgs/png-fallback',
                    loadersnippet: 'build/tmp/grunticon/grunticon-loader.js', /* we don't need this! */
                    previewhtml: 'build/tmp/grunticon/preview.html'  /* we don't need this! */
                },
                files: [
                    {
                        cwd: 'build/tmp/svgmin/bgs',
                        dest: 'source/sass/grunticon',
                        expand: true,
                        src: ['*.svg']
                    }
                ]
            },
            dist: {
                options: {
                    pngfolder: 'dist/img/bgs/png-fallback',
                    loadersnippet: 'dist/tmp/grunticon/grunticon-loader.js', /* we don't need this! */
                    previewhtml: 'dist/tmp/grunticon/preview.html'  /* we don't need this! */
                },
                files: [
                    {
                        cwd: 'dist/tmp/svgmin/bgs',
                        dest: 'source/sass/grunticon',
                        expand: true,
                        src: ['*.svg']
                    }
                ]
            }
		},
		
		// Configuration for validating html-files
		htmlhint: {
			options: {
				force: true,
				'attr-lowercase': false, // set to false because of svg-attribute 'viewBox'
				'attr-value-double-quotes': true,
				'attr-value-not-empty': true,
				'doctype-first': true,
				'doctype-html5': true,
				'id-class-value': true,
				'id-unique': true,
				'img-alt-require': true,
				'spec-char-escape': true,
				'src-not-empty': true,
				'style-disabled': true,
				'tag-pair': true,
				'tag-self-close': true,
				'tagname-lowercase': true
			},
			all: {
				src: ['*/*.html', '!jsdocs/**/*.html', '!styleguide/**/*.html']
			}
		},
		
		// Configuration for optimizing image-files
		imagemin: {
			options: {
				optimizationLevel: 7
			},
			dev: {
				files: [
					{
						cwd: 'source/img/',
						dest: 'build/img/',
						expand: true,
						src: ['**/*.{jpg,png,gif}']
					}
				]
			},
			dist: {
				files: [
					{
						cwd: 'source/img/',
						dest: 'dist/img/',
						expand: true,
						src: ['**/*.{jpg,png,gif}']
					}
				]
			}
		},
		
		// Configuration for file includes
		includes: {
			options: {
				duplicates: false,
				flatten: true,
				includeRegexp: /^\/\/\s*import\s+['"]?([^'"]+)['"]?\s*$/
			},
			dev: {
				files: [
					{
						cwd: 'source/js',
						dest: 'build/js',
						expand: true,
						ext: '.js',
						src: ['**/*.js']
					}
				]
			},
			dist: {
				files: [
					{
						cwd: 'source/js',
						dest: 'dist/js',
						expand: true,
						ext: '.js',
						src: ['**/*.js']
					}
				]
			}
		},
		
		// Configuration for documenting js-files
		jsdoc : {
			all: {
				options: {
					destination: 'jsdocs'
				},
				src: ['source/js/modules/**/*.js', 'source/js/README.md']
			}
		},
		
		// Configuration for validating js-files
		jshint: {
			options: {
				force: true,
				'asi': false,
				'bitwise': false,
				'boss': true,
				'browser': true,
				'curly': false,
				'eqeqeq': false,
				'eqnull': true,
				'evil': false,
				'forin': true,
				'immed': false,
				'indent': 4,
				'jquery': true,
				'laxbreak': true,
				'maxerr': 50,
				'newcap': false,
				'noarg': true,
				'noempty': false,
				'nonew': false,
				'nomen': false,
				'onevar': false,
				'plusplus': false,
				'regexp': false,
				'undef': false,
				'sub': true,
				'strict': false,
				'white': false
			},
			own: {
				options: {
					'-W015': true
				},
				src: [
					'source/js/init/*.js',
					'source/js/modules/**/*.js'
				]
			},
			all: {
				options: {
					'-W015': true,
					'-W089': true
				},
				src: [
					'source/js/**/*.js',
					'!source/js/vendor/**/*.js'
				]
			}
		},
		
		// Modernizr configuration
		modernizr: {
			all: {
				customTests: ['source/js/vendor/plugins/_positionsticky.js', 'source/js/vendor/plugins/_csschecked.js'],
				devFile: 'remote',
				files: {
					src: ['source/**/*.js', 'source/**/*.scss', '!source/js/vendor/*.js']
				},
				outputFile: 'source/js/vendor/_modernizr.js',
				uglify: false
			}
		},
		
		// Configuration for pagespeed
		pagespeed: {
			options: {
				nokey: true,
				url: "http://yoursite.com"
			},
			prod: {
				options: {
					locale: "de_DE",
					strategy: "desktop",
					threshold: 80,
					url: "http://yoursite.com"
				}
			},
			paths: {
				options: {
					locale: "de_DE",
					paths: ["/yourpage1.html", "/yourpage2.html"],
					strategy: "desktop",
					threshold: 80
				}
			}
		},
		
		// Configuration for measuring frontend performance
		phantomas: {
			all : {
				options : {
					indexPath: 'build/phantomas/',
					numberOfRuns: 10,
					url: 'http://0.0.0.0:9002/'
				}
			}
		},
		
		// Configuration for photobox
		photobox: {
			all: {
				options: {
					indexPath: 'build/photobox/',
					screenSizes: [ '320', '568', '768', '1024', '1280' ],
					urls: [ 'http://0.0.0.0:9002/index.html' ]
				}
			}
		},
		
		// Configuration for prettifying the html-code generated by assemble
		prettify: {
			options: {
				condense: false,
				indent: 1,
				indent_char: '	',
				indent_inner_html: false,
				preserve_newlines: true,
				unformatted: [
					"a",
					"b",
					"code",
					"em",
					"i",
					"mark",
					"strong",
					"pre"
				]
			},
			dev: {
				options: {
					brace_style: 'expand'
				},
				files: [
					{
						cwd: 'build/',
						dest: 'build/',
						expand: true,
						ext: '.html',
						src: ['*.html']
					}
				]
			},
			dist: {
				options: {
					brace_style: 'collapse'
				},
				files: [
					{
						cwd: 'dist/',
						dest: 'dist/',
						expand: true,
						ext: '.html',
						src: ['*.html']
					}
				]
			}
		},
		
		// Configuration for SCSS linting
		scsslint: {
			allFiles: [
				'source/sass/{blocks,extends,mixins,variables,styles.scss,_*.scss}'
			],
			options: {
				colorizeOutput: true,
				compact: true,
				config: '.scss-lint.yml',
				force: true
			}
		},
		
		// Configuration for string-replacing the grunticon output
		'string-replace': {
			'grunticon-datasvg': {
				files: {
					'source/sass/icons/_icons-data-svg.scss': 'source/sass/grunticon/_icons-data-svg.scss'
				},
				options: {
					replacements: [{
						pattern: /%icon-/g,
						replacement: '%icon-data-svg-'
					}]
				}
			},
            'grunticon-datapng': {
				files: {
					'source/sass/icons/_icons-data-png.scss': 'source/sass/grunticon/_icons-data-png.scss'
				},
				options: {
					replacements: [{
						pattern: /%icon-/g,
						replacement: '%icon-data-png-'
					}]
				}
			},
            'grunticon-fallback': {
				files: {
					'source/sass/icons/_icons-fallback.scss': 'source/sass/grunticon/_icons-fallback.scss'
				},
				options: {
					replacements: [{
						pattern: /%icon-/g,
						replacement: '%icon-fallback-'
					}]
				}
			}
		},
		
		// Configuration for the styleguide output
		styleguide: {
			options: {
				framework: {
					name: 'kss'
				},
				name: 'Style Guide',
				template: {
					src: 'source/styleguide-template/'
				}
			},
			all: {
				files: [
					{
						'styleguide': 'source/sass/blocks/**/*.scss'
					}
				]
			}
		},
		
		// Configuration for optimizing SVG-files
		svgmin: {
			options: {
				 plugins: [
					{ cleanupAttrs: true },
					{ cleanupEnableBackground: true },
					{ cleanupIDs: true },
					{ cleanupNumericValues: true },
					{ collapseGroups: true },
					{ convertColors: true },
					{ convertPathData: true },
					{ convertShapeToPath: true },
					{ convertStyleToAttrs: true },
					{ convertTransform: true },
					{ mergePaths: true },
					{ moveElemsAttrsToGroup: true },
					{ moveGroupAttrsToElems: true },
					{ removeComments: true },
					{ removeDoctype: true },
					{ removeEditorsNSData: true },
					{ removeEmptyAttrs: true },
					{ removeEmptyContainers: true },
					{ removeEmptyText: true },
					{ removeHiddenElems: true },
					{ removeMetadata: true },
					{ removeNonInheritableGroupAttrs: true },
					{ removeRasterImages: true },
					{ removeTitle: true },
					{ removeUnknownsAndDefaults: true },
					{ removeUnusedNS: true },
					{ removeUselessStrokeAndFill: false }, // Enabling this may cause small details to be removed
					{ removeViewBox: false }, // Keep the viewBox because that's where illustrator hides the SVG dimensions
					{ removeXMLProcInst: false }, // Enabling this breaks grunticon because it removes the XML header
					{ sortAttrs: true },
					{ transformsWithOnePath: false } // Enabling this breaks Illustrator SVGs with complex text
				]
			},
			dev: {
				files: [
					{
						cwd: 'source/img/bgs',
						dest: 'build/tmp/svgmin/bgs',
						expand: true,
						ext: '.svg',
						src: ['*.svg']
					},
                    {
                        cwd: 'source/img/icons',
                        dest: 'build/tmp/svgmin/icons',
                        expand: true,
                        ext: '.svg',
                        src: ['*.svg']
                    }
				]
			},
			dist: {
				files: [
                    {
                        cwd: 'source/img/bgs',
                        dest: 'dist/tmp/svgmin/bgs',
                        expand: true,
                        ext: '.svg',
                        src: ['*.svg']
                    },
                    {
                        cwd: 'source/img/icons',
                        dest: 'dist/tmp/svgmin/icons',
                        expand: true,
                        ext: '.svg',
                        src: ['*.svg']
                    }
				]
			}
		},
		
		// Configuration for building the SVG-sprite
		svgstore: {
			options: {
				prefix : 'icon-',
				formatting : {
					indent_char: '	',
					indent_size : 1
				},
				svg: {
					style: "display: none;"
				}
			},
			dev: {
				files: {
					'build/tmp/icon-sprite.svg': ['build/tmp/svgmin/icons/*.svg']
				}
			},
            dist: {
                files: {
                    'build/tmp/icon-sprite.svg': ['build/tmp/svgmin/icons/*.svg']
                }
            }
		},
		
		// Configuration for syncing files
		// Task does not remove any files and directories in 'dest' that are no longer in 'cwd'. :'(
		sync: {
			ajax: {
				files: [
					{
						cwd: 'source/ajax-content/',
						dest: 'build/ajax-content/',
						src: '**/*'
					}
				]
			},
			favicon: {
				files: [
					{
						cwd: 'source/img/',
						dest: 'build/img/',
						src: '**/*.ico'
					}
				]
			},
			fonts: {
				files: [
					{
						cwd: 'source/fonts/',
						dest: 'build/fonts/',
						src: '**/*'
					}
				]
			},
			js: {
				files: [
					{
						cwd: 'source/js/',
						dest: 'build/js/',
						src: '**/*'
					}
				]
			}
		},
		
		// Configuration for uglifying JS
		uglify: {
			dist: {
				options: {
					compress: {
						drop_console: true
					}
				},
				files: [
					{
						cwd: 'dist/js',
						dest: 'dist/js',
						expand: true,
						src: ['**/*.js', '!**/_*.js']
					}
				]
			}
		},
		
		// Configuration for watching changes
		watch: {
			options: {
				livereload: 35730,
				spawn: true
			},
			css: {
				files: ['build/css/**/*.css']
			},
			scss: {
				files: ['source/sass/**/*.scss'],
				tasks: ['compass:dev', 'autoprefixer:dev', 'csssplit:dev'],
				options: {
					debounceDelay: 0,
					livereload: false
				}
			},
			images: {
				files: ['source/img/*', 'source/img/**/*.{jpg,png}', '!source/img/dev/*'],
				tasks: ['newer:imagemin:dev']
			},
			svg_bgs: {
				files: ['source/img/bgs/*.svg'],
				tasks: ['newer:svgmin:dev', 'grunticon', 'string-replace']
			},
			svg_icons: {
				files: ['source/img/icons/*.svg'],
				tasks: ['newer:svgmin:dev', 'svgstore:dev', 'newer:assemble:dev']
			},
			sync_ajax: {
				files: ['source/ajax-content/**/*'],
				tasks: ['sync:ajax']
			},
			sync_fonts: {
				files: ['source/fonts/**/*'],
				tasks: ['sync:fonts']
			},
			sync_js: {
				files: ['source/js/**/*'],
				tasks: ['modernizr', 'sync:js', 'includes:dev', 'jshint']
			},
			templates: {
				files: ['source/assemble/**/*.{json,hbs}'],
				tasks: ['newer:assemble:dev', 'prettify:dev', 'htmlhint'],
				options: {
					spawn: false
				}
			}
		}
	});
	
	// Where we tell Grunt we plan to use this plug-in.
	// done by jit-grunt plugin loader
	
	
	// Where we tell Grunt what to do when we type "grunt" into the terminal.
	
	// Default -> Standard Build task
	grunt.registerTask('default', [
		'build'
	]);
	
	// Build task
	grunt.registerTask('build', [
		'clean:dev',
		'svgmin:dev',
		'svgstore:dev',
		'grunticon:dev',
		'string-replace:grunticon-datasvg',
        'string-replace:grunticon-datapng',
        'string-replace:grunticon-fallback',
		'imagemin:dev',
		'concurrent:dev',
		'autoprefixer:dev',
		'csssplit:dev',
		'sync',
		'includes:dev',
		'prettify:dev',
		'htmlhint',
		'jshint',
		'connect:livereload',
		'watch'
	]);
	
	// Distributing task
	grunt.registerTask('dist', [
		'clean:dist',
		'clean:docs',
		'svgmin:dist',
		'svgstore:dist',
		'grunticon:dist',
        'string-replace:grunticon-datasvg',
        'string-replace:grunticon-datapng',
        'string-replace:grunticon-fallback',
		'imagemin:dist',
		'concurrent:dist',
		'autoprefixer:dist',
		'csssplit:dist',
		'group_css_media_queries',
		'cssmin',
		'copy:ajax',
		'copy:favicon',
		'copy:fonts',
		'copy:js',
		'includes:dist',
		'uglify',
		'clean:dist_js',
		'prettify:dist',
		'htmlhint',
		'accessibility',
		'jshint',
		'jsdoc'
	]);
	
	// HTMLHint task
	grunt.registerTask('check-html', [
		'htmlhint'
	]);
	
	// SCSSLint task
	grunt.registerTask('check-scss', [
		'scsslint'
	]);
	
	// JSHint task
	grunt.registerTask('check-js', [
		'jshint'
	]);
	
	// JSHint task
	grunt.registerTask('check-wcag2', [
		'accessibility'
	]);
	
	// Pagespeed task
	grunt.registerTask('measure-pagespeed', [
		'pagespeed'
	]);
	
	// Phantomas task
	grunt.registerTask('measure-performance', [
		'connect:livereload',
		'phantomas'
	]);
	
	// Photobox task
	grunt.registerTask('take-screenshots', [
		'connect:livereload',
		'photobox'
	]);
	
	// Styleguide task
	grunt.registerTask('build-styleguide', [
		'styleguide',
		'copy:styleguide'
	]);
	
};
