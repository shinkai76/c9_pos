module.exports = {
    devServer: {
        port: 8083,
        open: true,
        proxy: {
            "/api": {
                target: "http://test.c8erp.com:6320",
                ws: true,
                changeOrigin: true
            }
        },
    },
    // http://test.c8erp.com:6320/static/c9_pos/index.html#/
    publicPath: process.env.NODE_ENV === 'production' ? '../c9_pos/' : '/',
    outputDir: "c9_pos",
    assetsDir: './',
    lintOnSave: false,
    runtimeCompiler: true
}
