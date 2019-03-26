const path = require('path')
const indentSet = new Set(['txt', 'gif', 'html', 'json', 'css', 'js'])
const imgSet = new Set(['icon', 'jpg', 'jpeg'])
const videoSet = new Set(['wmv'])
const audioSet = new Set(['wav','wma'])
module.exports = function (filePath, fileStat) {
  let ext = path.extname(filePath).split('.').pop().toLowerCase()
  if (fileStat.isDirectory()) {
    return 'folder'
  }
  if (indentSet.has(ext)) {
    return ext
  }
  if (imgSet.has(ext)) {
    return 'img'
  }
  if (videoSet.has(ext)) {
    return 'video'
  }
  if (audioSet.has(ext)) {
    return 'audio'
  }
  return 'blank'
}
