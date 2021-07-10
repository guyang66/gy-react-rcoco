#! /usr/bin/expect

set user [lindex $argv 0]
set pwd [lindex $argv 1]
set serverIp [lindex $argv 2]
set targetDir [lindex $argv 3]
set date [lindex $argv 4]
set version [lindex $argv 5]

spawn ssh $user@$serverIp
expect "*password:"
send "$pwd\r"
expect "*#"

send "cd $targetDir\r"
send "mv dist dist_backup_$version\_$date\r"
send "tar zxvf deploy.tar.gz\r"
send "mv ./tar/dist ./dist\r"

expect eof
