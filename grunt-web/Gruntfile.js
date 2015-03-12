module.exports = function(grunt) {

  var mozjpeg = require('imagemin-mozjpeg');
  // Project configuration.
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    version: grunt.option('tag') || grunt.template.today("dd-mm-yyyy"),
    imagemin: {
      static: {
        options: {
          optimizationLevel: 3,
          svgoPlugins: [{ removeViewBox: false }],
          use: [mozjpeg()]
        },
        files: {
          'dev/images/sprite.png': 'src/images/sprite/*.png',
          'dev/images/sprite.jpg': 'src/images/sprite/*.jpg',
          'dev/images/sprite.gif': 'src/images/sprite/*.gif'
        }
      },
      dynamic: {                         // Another target
        files: [{
          expand: true,                  // Enable dynamic expansion
          cwd: 'src/',                   // Src matches are relative to this path
          src: ['images/sprite/*.{png,jpg,gif}'],   // Actual patterns to match
          dest: 'dev/'                  // Destination path prefix
        }]
      }
    },
    csslint: {
      strict: {
        options: {
          import: 2
        },
        src: ['dev/css/*.css']
      }
    },
    coffee: {
      compile: {
        expand: true,
        flatten: true,
        cwd: 'src/js/coffee/',
        src: ['*.coffee'],
        dest: 'dev/js/',
        ext: '.js'
      }
    },
    jshint: { // js规范检查
      files: ['gruntfile.js', 'dev/js/*.js'],
      // configure JSHint (documented at http://www.jshint.com/docs/)
      options: {
        globals: {
          jQuery: true,
          console: true,
          module: true
        }
      }
    },
    concat: {  // 合并代码
      js: {
        src: ['dev/js/*.js'],
        dest: 'dev/js/compiled.js'
      },
      css: {
        src: ['dev/css/*.css'],
        dest: 'dev/css/compiled.css'
      }
    },
    uglify: { // 压缩js代码
      options: {
        // 此处定义的banner注释将插入到输出文件的顶部
        banner: '/*! <%= pkg.name %> <%= grunt.template.today("dd-mm-yyyy") %> */\n'
      },
      js: {
        files: {
          'release/js/compiled.min.<%= version %>.js': ['<%= concat.js.dest %>']
        }
      }
    },
    less: {
      compile: {
        options: {
          paths: ["src/css/less"],
          modifyVars: {
            imgPath: '"http://mycdn.com/path/to/images"'
          }
        },
        files: [{
          cwd: "src/css/less",
          src: "*.less",
          dest: "dev/css",
          expand: true,
          ext: ".css"
        }]
      }
    },
    autoprefixer : {
      options: {
        browsers: ['ie > 7', 'ff > 3.4']
      },
      multiple_files: {
        expand: true,
        flatten: true,
        src: 'dev/css/*.css',
        dest: 'dev/css/'
      },
    },
    cssmin: {  // 压缩css代码
      target: {
        files: {
          'release/css/compiled.min.<%= version %>.css': ['<%= concat.css.dest %>']
        }
      }
    },
    jade: {
      dev: {
        options: {
          data: {
            dev: true,
            version: '<%= version %>'
          },
          client: false,
          pretty: true
        },
        files: [ {
          cwd: "src/views/pages",
          src: "*.jade",
          dest: "dev",
          expand: true,
          ext: ".html"
        } ]
      },
      release: {
        options: {
          data: {
            dev: false,
            version: '<%= version %>'
          },
          client: false,
          pretty: false
        },
        files: [ {
          cwd: "src/views/pages",
          src: "*.jade",
          dest: "release",
          expand: true,
          ext: ".html"
        } ]
      }
    },
    htmlmin: {  // 压缩html
      dev: {
        options: {                                 // Target options
          removeComments: true,
          collapseWhitespace: true
        },
        files: {                                   // Dictionary of files
          'release/*.html': 'dev/*.html',     // 'destination': 'source'
        }
      }
    },
    copy: {
      js: {
        files: [
          {expand: true, cwd: "src/js/javascript/", src: "*.js", dest: "dev/js/"}
        ]
      },
      css: {
        files: [
          {expand: true, cwd: "src/css/css/", src: "*.css", dest: "dev/css/"}
        ]
      },
      dev: {
        files: [
          {expand: true, cwd: "src/js/javascript/", src: "*.js", dest: "dev/js/"},
          {expand: true, cwd: "src/css/css/", src: "*.css", dest: "dev/css/"},
          {expand: true, cwd: "src/js/lib/", src: "*", dest: "dev/js/lib/"},
          {expand: true, cwd: "src/css/lib/", src: "*", dest: "dev/css/lib/"},
          {expand: true, cwd: "src/images/", src: "**/*", dest: "dev/images"}
        ]
      },
      release: {
        files: [
          {expand: true, cwd: "src/js/lib/", src: "*", dest: "release/js/lib/"},
          {expand: true, cwd: "src/css/lib/", src: "*", dest: "release/css/lib/"},
          {expand: true, cwd: "src/images/", src: "**/*", dest: "release/images"}
        ]
      }
    },
    watch: {
      options: {
        interrupt: true,
      },
      js: {
        files: ['src/js/javascript/*.js'],
        tasks: ['copy:js']
      },
      css: {
        files: ['src/css/css/*.css'],
        tasks: ['copy:css']
      },
      less: {
        files: ['src/css/less/*.less'],
        tasks: ['less']
      },
      coffee: {
        files: ['src/js/coffee/*.coffee'],
        tasks: ['coffee']
      },
      jade: {
        files: ['src/views/**/*.jade'],
        tasks: ['jade:dev']
      }
    },
    clean: {
      dev: ['dev'],
      release: ['release']
    }
  });

  // 加载包含 "uglify" 任务的插件。
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-contrib-copy');
  grunt.loadNpmTasks('grunt-contrib-cssmin');
  grunt.loadNpmTasks('grunt-contrib-htmlmin');
  grunt.loadNpmTasks('grunt-contrib-imagemin');
  grunt.loadNpmTasks('grunt-autoprefixer');
  grunt.loadNpmTasks('grunt-contrib-csslint');
  grunt.loadNpmTasks('grunt-contrib-jade');
  grunt.loadNpmTasks('grunt-contrib-less');
  grunt.loadNpmTasks('grunt-contrib-copy');
  grunt.loadNpmTasks('grunt-contrib-coffee');

  // 默认被执行的任务列表。
  grunt.registerTask('dev', ['clean:dev', 'copy:dev', 'autoprefixer', 'less', 'autoprefixer', 'coffee', 'jade:dev', 'watch']);
  grunt.registerTask('release', ['clean', 'jade:release', 'copy:dev', 'copy:release', 'less', 'autoprefixer', 'csslint', 'concat:css', 'cssmin', 'coffee', 'jshint', 'concat:js', 'uglify']);
};