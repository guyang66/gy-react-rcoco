#! /usr/bin/expect

set user [lindex $argv 0]
set pwd [lindex $argv 1]
set serverIp [lindex $argv 2]
set targetDir [lindex $argv 3]
set localTarDir [lindex $argv 4]
# 使用scp上传到服务器
spawn scp $localTarDir $user@$serverIp:$targetDir
# 可能压缩包很大，服务器带宽和网速的问题，scp上传可能会很慢，建议放宽超时时间
set timeout 1000
expect {
"(yes/no)?"
  {
    send "yes\n"
    expect "*assword:" { send "$pwd\n" }
  }
  "*assword:"
  {
    send "$pwd\n"
    expect {
      "*ermission denie*" {
       exit 3
      }
       "100%" {
         expect eof
       }
    }
  }
}
