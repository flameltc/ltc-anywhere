module.exports = {
  root: process.cwd(),
  hostname: '127.0.0.1',
  port: 9527,
  compress: /\.(html|css|js|md)/,
  cache: {
    maxAge: 600,
    cacheControl: true,
    lastModified: true,
  }
}