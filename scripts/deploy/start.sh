#! /usr/bin/expect

set user [lindex $argv 0]
set pwd [lindex $argv 1]
set serverIp [lindex $argv 2]
set targetDir [lindex $argv 3]
set tarDirName [lindex $argv 4]

spawn ssh $user@$serverIp

expect {
  "*yes/no" { send "yes\r"; exp_continue }
  "*password:" { send "$pwd\r" }
}

expect "$*"

# 进入目录
send "cd $targetDir\r"
# 解压到当前目录即可
# 前端发布部署比较简单，如果用nginx作为web服务器，把旧文件替换掉，甚至不需要重启（但是注意设置静态资源缓存策略，，千万不要给html加长时间缓存，除非你非常非常确定它是一万年不会改变的文件...）
send "tar zxvf $tarDirName\r"
send "ls \r"

# 解压中，如果压缩包很大，适当延长sleep时间
sleep 8
expect eof
