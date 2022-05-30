const path = require('path');
const fs = require('fs');

function getFileStat(path) {
  try {
    fs.statSync(path);
    return true;
  } catch (err) {
    return false;
  }
}

function scanFilesByFolder(dir, cb) {
  let _folder = path.resolve(__dirname, dir);
  if(!getFileStat(_folder)){
    return;
  }
  try {
    const files = fs.readdirSync(_folder);

    files.forEach((file) => {

      // 只处理js文件
      if(!file.match(/json/)){
        return;
      }
      // 递归搜索
      let fullPath = path.join(dir, file);
      const stat = fs.statSync(path.join(__dirname,fullPath));
      if(stat.isDirectory()){
        scanFilesByFolder(path.join(dir,file),cb)
      }
      let filename = file.replace('.json', '');
      let oFileCnt = require(_folder + '/' + filename);
      cb && cb(filename, oFileCnt);
    })

  } catch (error) {
    console.log('文件自动加载失败...', error);
  }
}

function loadApiJSON () {
  let mockJson = {}
  scanFilesByFolder('./api',(filename, extendFn)=>{
    mockJson = Object.assign({}, mockJson, extendFn)
  })
  return mockJson
}

module.exports = function (){
  return loadApiJSON ()
}
