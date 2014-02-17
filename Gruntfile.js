module.exports = function (grunt) {
    "use strict";

    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        typescript : {
            app: {
                src: ['src/ts/**/*.ts'],
                dest: 'dist/static/app.js'
            }
        },
        jade : {
            base: {
                options: {
                    client: false,
                    pretty: true
                },
                files: grunt.file.expandMapping(
                    ["**/*.jade"],
                    "dist",
                    {ext: ".html", cwd: "src/jade"}
                )
            }
        },
        concat: {
            options: {
                separator: ';\n'
            },
            css: {
                src: ['src/css/master.css', 'src/css/animations.css'],
                dest: 'dist/static/master.css'
            },
        },
        copy: {
            js : {
                files: [
                    {
                        expand: true,
                        cwd: 'src/js',
                        src: ['**/*.js'],
                        dest: 'dist/static'
                    }
                ]
            }
        }
    });

    grunt.loadNpmTasks('grunt-typescript');
    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-contrib-copy');
    grunt.loadNpmTasks('grunt-contrib-jade');
    grunt.registerTask('default', ['typescript', 'jade', 'copy', 'concat']);

};
