const fs = require('fs-extra')
const path = require('path')
const urlParse = require('url-parse')
const request = require('request')
const mkdirp = require('async-mkdirp')
const chalk = require('chalk')

const config = require('../../config/config-default')
const copyResource = (from, to, name) => {
  fs.writeFileSync(to, fs.readFileSync(from))
  console.log(chalk.green(name, '复制成功！'))
}
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
  const resourcePath =  path.join(rootDirPath, '/resource', ...dirs)
  const isMock = process.env.NODE_ENV === 'mock'
  if (!fs.existsSync(path.join(saveDirPath, fileName))) {
    await mkdirp(saveDirPath)
    if(isMock){
      // 如果是mock模式，就不要去服务端下载了（后台服务每开启），直接去resource copy过来接口。
      copyResource(path.join(resourcePath, fileName),path.join(saveDirPath, fileName), resource)
      return
    }
    // 用后台服务的静态资源来模拟cdn，然后按需下载第三方资源
    request.get(resource)
      .on('error', error => {
        console.log(chalk.red(`下载失败：${resource} \n message:${error.message}`))
      })
      // 下载失败的时候还是会写入文件（只不过是个没有内容的文件）
      .pipe(fs.createWriteStream(path.join(saveDirPath, fileName)), {
        encoding: null,
        end: true,
      })
      .on('finish', () => {
        console.log(chalk.cyan(`下载完成：${resource}`))
      })
  } else {
    let size = fs.statSync(path.join(saveDirPath, fileName)).size
    if(size <= 0){
      // 文件大小如果是0，则说明上一次下载失败，需要重新下载，手动清除这些文件
      console.log(chalk.red(`下载失败：${resource} \n message:文件无内容！`))
      fs.rm(path.join(saveDirPath, fileName))
    } else {
      // 表示已经下载过或者mock模式复制完成过
      console.log(chalk.blue(`${resource}  已存在`))
    }
  }
}
const resourceList = config.resources
resourceList.map(donwResource)
