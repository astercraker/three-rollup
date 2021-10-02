import nodeResolve from 'rollup-plugin-node-resolve';
import serve from 'rollup-plugin-serve';
import livereload from 'rollup-plugin-livereload';

export default{
    input: 'src/js/main-three.js',
    output: {
        file: 'src/js/main-three.min.js'
    },
    plugins: [
        nodeResolve(),
        serve({
            open: true,
            verbose: true,
            contentBase: ['src'],
            historyApiFallback: true,
            host: 'localhost',
            port: 3000,
        }),
        livereload({ watch: ['src'] }),
    ]
}