const gulp = require('gulp');
const spawn = require('child_process').spawn;
let node;

function server () {
        if (node) {
                node.kill();
        }

        node = spawn('npm', ['run', 'runserver'], { stdio: 'inherit' });
        node.on('close', function (code) {
                if (code === 8) {
                        gulp.log('Error detected, waiting for changes ...')
                }
        });
}

gulp.task('server', function () {
        server();
});

gulp.task('watch-server', function () {

});

const watcher = gulp.watch(['./backend/**/*.js', './app.js']);
watcher.on('change', function() {
        console.log('server file modified');
        server();
});

gulp.task('default', gulp.series('server', 'watch-server'));

process.on('exit', function () {
        if (node) {
                node.kill
        }
});

