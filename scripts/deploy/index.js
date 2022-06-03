#!/usr/bin/env node
const path = require('path')
const { spawn, exec } = require('child_process')
const chalk = require('chalk')
const inquirer = require('inquirer')
const config = require('./config')
const options = {
  stdio: 'inherit',
  shell: true,
}
const { serverIp, user, targetDir, localTarDir, tarDirName } = config.deployConfig
let pwd
const getPwd = async () => {
  const answers = await inquirer.prompt([{
    type: 'password',
    message: '请输入ssh登录密码',
    name: 'pwd',
  }])
  console.log(chalk.cyan('............ssh登录密码get............'))
  return answers.pwd
}

const upload = async () => {
  console.log(chalk.blue('............开始上传压缩包............'))
  const params = [path.resolve(__dirname, './upload.sh'), user, pwd, serverIp, targetDir, localTarDir]
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
  const params = [path.resolve(__dirname, './start.sh'), user, pwd, serverIp, targetDir, tarDirName]
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
const run = async () => {
  console.log(chalk.cyan('............deploy启动............'))
  pwd = await getPwd()
  await upload()
}

run().then(() => {
  // do nothing..
})
