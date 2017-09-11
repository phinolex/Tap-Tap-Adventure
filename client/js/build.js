require.config({

    appDir: "../",
    baseUrl: "js/",
    dir: "../../client-build",
    optimize: "uglify",
    optimizeCss: "standard.keepLines",

    paths: {
        jquery: 'lib/jquery'
    },

    modules: [
        {
            name: 'jquery'
        },

        {
            name: 'game',
            exclude: ['jquery']
        },

        {
            name: 'lib/home',
            exclude: ['jquery', 'game']
        }
    ]
});