#!/bin/bash
# 暂存目录
tarPath="rcoco"
npm run build
tar_name="${tarPath}.tgz"
# 如果文件不存在，则创建文件夹
if [ ! -d "tgz" ]; then
    mkdir -p tgz
fi
# 复制dist文件夹到tgz下
cp -r build $tarPath
# 压缩dist目录
tar -zcvf tgz/$tar_name $tarPath/
# 删除刚刚复制进来的dist目录文件
echo "删除${tarPath}目录"
rm -rf $tarPath/
echo "\033[1;32m 压缩完成! 可使用scp命令进行上传：scp tgz/${tar_name} xxxxx"
