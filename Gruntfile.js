/*global module:false*/

// Less - Custom

module.exports = function(grunt) {

	grunt.initConfig({
		pkg: grunt.file.readJSON('package.json'),
		meta: {
			banner: '/* \n' +
					' * <%= pkg.name %> v<%= pkg.version %> - <%= grunt.template.today("yyyy-mm-dd") %> \n' +
					' * <%= pkg.description %> \n' +
					' * <%= pkg.homepage %> \n' +
					' * \n' +
					' * Copyright <%= grunt.template.today("yyyy") %> <%= pkg.author.name %>; <%= pkg.license %> Licensed \n' +
					' */ \n\n'
		},
		// LESS
		less: {
			main: {
				files: {
					'<%= pkg.codename %>.css': 'src/<%= pkg.codename %>.less',
					'<%= pkg.codename %>.ie.css': 'src/<%= pkg.codename %>.ie.less'
				}
			},
			min: {
				options: {
					report: 'min',
					cleancss: true
				},
				files: {
					'<%= pkg.codename %>.min.css': 'src/<%= pkg.codename %>.less',
					'<%= pkg.codename %>.ie.min.css': 'src/<%= pkg.codename %>.ie.less'
				}
			}


		},
		// Auto Prefixer
		autoprefixer: {
			options: {
				browsers: [ '> 1%', 'last 5 versions', 'Firefox ESR', 'Opera 12.1', 'IE 8', 'IE 9' ]
			},
			no_dest: {
				 src: '*.css'
			}
		},
		// Banner
		usebanner: {
			banner: {
				options: {
					position: 'top',
					banner: '<%= meta.banner %>',
					linebreak: false
				},
				files: {
					src: [
						'<%= pkg.codename %>.css',
						'<%= pkg.codename %>.min.css',
						'<%= pkg.codename %>.ie.css',
						'<%= pkg.codename %>.ie.min.css'
					]
				}
			}
		},
		// Bower sync
		sync: {
			all: {
				options: {
					sync: [ 'name', 'version', 'description', 'author', 'license', 'homepage' ],
					overrides: {
						main: [
							'<%= pkg.codename %>.css'
						],
						ignore: [ "*.jquery.json" ]
					}
				}
			}
		},
		// Watcher - For dev only!!
		watch: {
			styles: {
				files: [
					'src/**.less'
				],
				tasks: [
					'less',
					'autoprefixer'
				]
			}
		}
	});

	// Load tasks
	grunt.loadNpmTasks('grunt-contrib-watch');
	grunt.loadNpmTasks('grunt-contrib-less');
	grunt.loadNpmTasks('grunt-autoprefixer');
	grunt.loadNpmTasks('grunt-banner');
	grunt.loadNpmTasks('grunt-npm2bower-sync');

	// Readme
	grunt.registerTask('buildReadme', 'Build Formstone README.md file.', function () {
		var pkg = grunt.file.readJSON('package.json'),
			extra = grunt.file.exists('src/README.md') ? '\n\n---\n\n' + grunt.file.read('src/README.md') : '';
			destination = "README.md",
			markdown = '<h2>Development of this plugin has ended. Please upgrade to the new <a href="http://formstone.it">Formstone</a>.</h2><br> \n\n' +
					   '<a href="http://gruntjs.com" target="_blank"><img src="https://cdn.gruntjs.com/builtwith.png" alt="Built with Grunt"></a> \n' +
					   '# ' + pkg.name + ' \n\n' +
					   pkg.description + ' \n\n' +
					   '- [Demo](' + pkg.demo + ') \n' +
					   '- [Documentation](' + pkg.homepage + ') \n\n' +
					   '#### Bower Support \n' +
					   '`bower install ' + pkg.name + '` ' +
					   extra;

		grunt.file.write(destination, markdown);
		grunt.log.writeln('File "' + destination + '" created.');
	});

	// Default task.
	grunt.registerTask('default', [ 'less', 'autoprefixer', 'usebanner', 'sync', 'buildReadme' ]);

};