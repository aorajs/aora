const { nestjsPlugin } = require('@aora/bundler-webpack/dist/server')
const { reactPlugin } = require('@aora/bundler-webpack/dist/entity')

module.exports = {
  serverPlugin: nestjsPlugin(),
  clientPlugin: reactPlugin()
}
