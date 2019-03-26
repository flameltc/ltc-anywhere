const {cache} = require('../config/defaultConfig')
function refreshRes(stats, res) {
  const { maxAge, cacheControl, lastModified} = cache
  if (cacheControl) {
    res.setHeader('Cache-Control',`public, max-age=${maxAge}`)
  }
  if (lastModified) {
    res.setHeader('Last-Modified', stats.mtime.toUTCString())
  }
}

module.exports = function isFresh(stats, req, res) {
  refreshRes(stats, res)
  const lastModified = req.headers['if-modified-since']
  if (!lastModified) {
    return false
  }
  if (lastModified && lastModified !== res.getHeader('Last-Modified')) {
    return false
  }
  return true
}