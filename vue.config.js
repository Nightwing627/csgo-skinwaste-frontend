const { BugsnagSourceMapUploaderPlugin } = require('webpack-bugsnag-plugins')
const { version } = require('./package.json')

module.exports = {
  lintOnSave: false,
  transpileDependencies: ['vuetify'],

  pluginOptions: {
    i18n: {
      locale: 'en',
      fallbackLocale: 'en',
      localeDir: 'locales',
      enableInSFC: false
    }
  },

  chainWebpack: config => {
    // node-config support
    config.plugin('define').tap(definitions => {
      definitions[0] = Object.assign(definitions[0], {
        CONFIG: JSON.stringify(require('config')),
        APPVERSION: JSON.stringify(version)
      })

      return definitions
    })

    config.module.rule('vue').use('vue-svg-inline-loader').loader('vue-svg-inline-loader')

    if (process.env.NODE_ENV === 'development') {
      config.devtool('eval-source-map')
    }

    if (process.env.NODE_ENV === 'production') {
      config.devtool('hidden-source-map')

      config.plugin('bugsnag-sourcemap-uploader').use(
        BugsnagSourceMapUploaderPlugin,
        [{
          apiKey: '3ec1379c569d655856157eb6ba3351ee',
          appVersion: version,
          publicPath: '*',
          overwrite: true
        }]
      )
    }
  },

  css: {
    loaderOptions: {
      scss: {
        data: '@import "@/styles/variables.scss";'
      }
    }
  }
}
