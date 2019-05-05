module.exports = (grunt) => {
	'use strict';
	grunt.initConfig({
		browserify: {
			dev: {
				src: [ "./source/App.es6" ],
				dest: "./dist/js/SonOfRogue.js",
				options: {
					browserifyOptions: { debug: true },
					transform: [
						["babelify", {
							"presets": ["@babel/preset-env"],
							"extensions": [".es6"]
						}]
					]
				}
			}
		},
		copy: {
			main: {
				expand: true,
				cwd: 'source/asset/',
				src: '**',
				dest: 'dist/asset/',
			}
		}
	});
	grunt.loadNpmTasks('grunt-browserify');
	grunt.loadNpmTasks('grunt-contrib-copy');

	grunt.registerTask('build', ['copy', 'browserify']);

};
