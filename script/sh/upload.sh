#! /usr/bin/expect

set user [lindex $argv 0]
set pwd [lindex $argv 1]
set serverIp [lindex $argv 2]
set targetDir [lindex $argv 3]

spawn scp ./tar/deploy.tar.gz $user@$serverIp:$targetDir

set timeout 30

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
