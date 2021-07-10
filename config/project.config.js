module.exports = {
  deployConfig: {
    serverIp: '121.40.230.6',
    targetDir: '/opt/workspace',
    user: 'root',
    pwd: '*',
  },
  clientConfig: {
    buildDir: './dist'
  },
  serverConfig: {
    port: 6001,
    staticPath: './static'
  }
}
