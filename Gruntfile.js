// wrapper 函数
module.exports = function(grunt) {

  var sassStyle = 'expanded';
  // 初始化configuration对象
  grunt.initConfig({
  	// 读取package.json文件项目配置信息，存入到pkg属性中
    pkg: grunt.file.readJSON('package.json'),
    // concat 合并文件
    concat: {
    	options: {
    		deparator: ";"
    	},
    	dist: {
    		src: ['build/**/*.js'],
    		dest: './dist/<%= pkg.name %>.js'
    	}
    },
    // uglify 压缩js文件
    uglify: {
    	options: {
    		// banner 注释将插入到输出文件的顶部
    		banner: '/*! <%= pkg.name %> <%= grunt.template.today("dd-mm-yy") %> */\n'
    	},
    	dist: {
    		// files: {
    		// 	// 将concat里生成的文件压缩成min.js
    		// 	'dist/<%= pkg.name %>.min.js' : ['<%= concat.dist.dest %>']
    		// }
    		src: ['<%= concat.dist.dest %>'],
    		dest: 'dist/<%= pkg.name %>1.min.js'
    	}
    },
    // jshint 语法检查
    jshint: {
    	// 文件数组
    	files: ['build/**/*.js','dist/**/*.js'],
    	options: {
    		globals: {
    			jQuery: true,
    			console: true,
    			module: true
    		}
    	}
    },
    // connect 
    connect: {
    	options: {
    		port: 9000,
    		open: true,
    		livereload: 35729,
    		hostname: 'localhost'
    	},
    	server: {
    		options: {
    			port: 9001,
    			base: './'
    		}
    	}
    },
    // cssjoin 将src里的css复制到dist里
    cssjoin: {
      join: {
        files: {
          "dist/bar.css": ['./main.css','src/bar.css']
        }
      }
    },
    cssmin: {
      compress: {
        files: {
          './dist/all.css': ['./main.css','src/bar.css']
        }
      }
    },
    jst: {
      compile: {
        options: {
          prettify: true,
        },
        files: {
          "build/test/jst.js" : ['src/source/**/*.html']
        }
      }
    },
    // watch 监听文件变动 监听jst任务 只要保存jst.js就能变化
    watch: {
      files: ['src/source/**/*.html'],
      tasks: ['jst']
    },
    // requirejs 结果只是比压缩多了define
    requirejs: {
      compile: {
        'options': {
          // 所有的js文件都会相对于这个目录
          'baseUrl': './',
          // 配置文件目录
          "paths": {
            // 后面自动的加上js后缀
            "_": "build/test/test-a",
            "B": "build/test"
            // "text" : "src/require.text"
          },
          "include": [
            "_",
            "B",
          ],
          // mainConfigFile: '',
          // name: '',
          // 输出文件
          'out': 'dist/libs.js'
        }
      }
    },
    // copy
    copy: {
      main: {
        // flatten: true,
        src: './build/**/*.js',
        dest: './dist/'
      }
    }

  });

  // 插件加载
  grunt.loadNpmTasks("grunt-contrib-concat");
  grunt.loadNpmTasks("grunt-contrib-uglify");
  grunt.loadNpmTasks("grunt-contrib-jshint");
  grunt.loadNpmTasks("grunt-contrib-watch");
  grunt.loadNpmTasks("grunt-contrib-connect");
  grunt.loadNpmTasks("grunt-cssjoin");
  grunt.loadNpmTasks("grunt-contrib-cssmin");
  grunt.loadNpmTasks("grunt-contrib-jshint");
  grunt.loadNpmTasks("grunt-contrib-jst");
  grunt.loadNpmTasks("grunt-contrib-requirejs");
  grunt.loadNpmTasks("grunt-contrib-copy");

  // 任务注册
  grunt.registerTask("test",['cssjoin','cssmin','jst']);
  grunt.registerTask("require",['requirejs']);
  grunt.registerTask("qwe",['watch','copy']);
  grunt.registerTask("watchit","connect");
  grunt.registerTask("default",['jshint','concat','uglify']);
  // 基本任务 grunt foo:test:123 => foo,test 123
  grunt.registerTask('foo','a sample task that logs stuff',function(arg1,arg2){
    if(arguments.length === 0){
      grunt.log.writeln(this.name + ", no args")
    }else{
      grunt.log.writeln(this.name + "," + arg1 + " " + arg2)
    }
  });
  grunt.event.on('watch', function(action, filepath, target) {
          grunt.log.writeln(target + ': ' + filepath + ' has ' + action);
    });

  // 自定义任务
  grunt.registerTask('bar','bar',function(){
    grunt.log.writeln('bar');
  });
  grunt.registerTask('baz','baz',function(){
    grunt.log.writeln('baz');
  });
  grunt.registerTask('foo1','test',function(){
    grunt.task.requires("bar");
    grunt.log.writeln("test");
    grunt.task.run(['bar','baz']);
  });
  // 异步任务
  grunt.registerTask("asyncfoo",'asyncfoo task',function(){
    var done = this.async();
    grunt.log.writeln("Processing task...");
    setTimeout(function(){
      grunt.log.writeln('all done');
      done();
    },1000);
  })

};
