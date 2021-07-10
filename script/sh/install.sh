#! /usr/bin/expect

spawn npm install
expect "up to dat*"
# 错误捕获 提前退出
expect eof
