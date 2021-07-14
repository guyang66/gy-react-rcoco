#!/usr/bin/env node

const path = require('path')
const fs = require('fs')
const { spawn, exec } = require('child_process')
const chalk = require('chalk')
const inquirer = require('inquirer')
const pkg = require('../package.json')
const config = require('../config/project.config')

const { serverIp, user, targetDir } = config.deployConfig

const options = {
  stdio: 'inherit',
  shell: true,
}

let pwd // ssh 缓存登录密码

const shell = (order, option = {}) => {
  const p = new Promise((resolve, reject) => {
    exec(order, option, (error, stdout) => {
      if (error) {
        reject(error)
      }
      resolve(stdout)
    })
  })
  return p
}

const getPwd = async () => {
  const answers = await inquirer.prompt([{
    type: 'password',
    message: '请输入ssh登录密码',
    name: 'pwd',
  }])
  console.log(chalk.cyan('............ssh登录密码get............'))
  return answers.pwd
}

const getNowDate = (t) => {
  if (!t) {
    t = new Date()
  }
  if (!(t instanceof Date)) {
    t = new Date(t)
  }
  const y = t.getFullYear()
  const m = t.getMonth() + 1
  const d = t.getDate()
  const h = t.getHours()
  const minutes = t.getMinutes()
  const s = t.getSeconds()
  return `${y}-${m < 10 ? (`0${m}`) : m}-${d < 10 ? (`0${d}`) : d}_${
    h < 10 ? (`0${h}`) : h}:${minutes < 10 ? (`0${minutes}`) : minutes}:${s < 10 ? (`0${s}`) : s}`
}

const installPackages = async () => {
  console.log(chalk.blue('............开始安装依赖............'))
  const order = 'npm install'
  await shell(order)
  console.log(chalk.blue('............安装依赖结束............'))
}

const upload = async () => {
  console.log(chalk.blue('............开始上传包............'))
  const params = [path.resolve(__dirname, './sh/upload.sh'), user, pwd, serverIp, targetDir]
  const result = spawn('expect', params, options)

  result.on('data', (data) => {
    console.log(chalk.blue(data))
  })
  result.on('error', (err) => {
    console.log(chalk.blue(`${err}`))
  })
  result.on('close', (data, msg) => {
    if (data === 0) {
      console.log(chalk.green('上传成功！！'))
      execute()
    } else if (data === 3) {
      console.log(chalk.red('ssh password incorrect!!'))
      console.log(chalk.cyan('............结束............'))
    } else {
      console.log(chalk.red(`上传失败${msg}`))
    }
  })
}

const execute = () => {
  console.log(chalk.cyan('...........开始部署..............'))
  const params = [path.resolve(__dirname, './sh/build.sh'), user, pwd, serverIp, targetDir, getNowDate(), pkg.version]
  const result = spawn('expect', params, options)

  result.on('data', (data) => {
    console.log(chalk.blue(data))
  })
  result.on('error', (data) => {
    console.log(chalk.blue(`${data}`))
  })
  result.on('close', (data, msg) => {
    if (data === 0) {
      console.log(chalk.green('部署完成！！'))
    } else {
      console.log(chalk.red(`部署失败！${msg}`))
    }
  })
}

const tarDist = async () => {
  console.log(chalk.cyan('............压缩开始............'))
  const orderCopy = 'cp -r ./dist/. tar/dist'
  await shell(orderCopy)
  const orderCompress = 'tar -czvf ./tar/deploy.tar.gz ./tar/dist'
  await shell(orderCompress)
  const orderDelete = 'rm -rf ./tar/*'
  await shell(orderDelete)
  console.log(chalk.cyan('............压缩完成............'))
}

const run = async () => {
  console.log(chalk.cyan('............deploy启动............'))
  pwd = await getPwd()
  const rmDirOrder = 'rm -rf ./tar'
  await shell(rmDirOrder)

  if (!fs.existsSync('./tar')) {
    const order = 'mkdir ./tar'
    await shell(order)
  }

  if (!fs.existsSync('./tar/dist')) {
    const order = 'mkdir ./tar/dist'
    await shell(order)
  }

  if (fs.existsSync('./dist')) {
    await tarDist()
  }

  // await installPackages()
  await upload()
}

run().then(() => {
  // do nothing..
})
