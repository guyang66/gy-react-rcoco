const fs = require('fs-extra')
const path = require('path')
const urlParse = require('url-parse')
const request = require('request')
const mkdirp = require('async-mkdirp')
const chalk = require('chalk')

const config = require('../../config/config-default')

const donwResource = async resource => {
  if (resource.indexOf('//') === 0) {
    resource = `http:${resource}`
  }
  const { pathname, hostname } = urlParse(resource)
  if (!hostname) return
  const dirs = pathname.split('/')
  const fileName = dirs.splice(-1).toString()
  const rootDirPath = process.cwd()
  const saveDirPath = path.join(rootDirPath, '/public', ...dirs)

  if (!fs.existsSync(path.join(saveDirPath, fileName))) {
    await mkdirp(saveDirPath)
    request.get(resource)
      .on('error', error => {
        console.log(chalk.red(`下载失败：${resource} \n message:${error.message}`))
      })
      .pipe(fs.createWriteStream(path.join(saveDirPath, fileName)), {
        encoding: null,
        end: true,
      })
      .on('finish', () => {
        console.log(chalk.cyan(`下载完成：${resource}`))      })
  } else {
    console.log(chalk.blue(`${resource}  已存在`))
  }
}
const resourceList = config.resources
resourceList.map(donwResource)
