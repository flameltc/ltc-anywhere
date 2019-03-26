const fs = require("fs");
const path = require('path');
const handlebars = require('handlebars');
const mime = require('./mime');
const getIconName = require('./getIconName')
const compress = require('./compress')
const range = require('./range')
const promisify = require("util").promisify;
const readdir = promisify(fs.readdir);
const stat = promisify(fs.stat);
const isFresh = require('./cache');

const tplPath = path.join(__dirname, '../template/dir.tpl');
const soucre = fs.readFileSync(tplPath, 'utf8');
const template = handlebars.compile(soucre);

module.exports = async function (req, res, filePath, config) { 
  try {
    const stats = await stat(filePath);

    if (stats.isFile()) {
      const contentType = mime(filePath);
      res.setHeader("Content-Type", contentType);

      if (isFresh(stats, req, res)) {
        res.statusCode = 304;
        res.end();
        return;
      }

      let rs;

      // 范围请求206
      const { code, start, end } = range(stats.size, req, res)
      if (code === 200) {
        res.statusCode = 200;
        rs = fs.createReadStream(filePath);
      } else {
        res.statusCode = 206;
        rs = fs.createReadStream(filePath, { start, end });
      }

      // 内容压缩
      if (filePath.match(config.compress)) {
        rs = compress(rs, req, res)
      }
      rs.pipe(res)
    } else if (stats.isDirectory()) {

      const files = await readdir(filePath);
      res.statusCode = 200;
      res.setHeader("Content-Type", "text/html");
      const dir = path.relative(config.root, filePath);
      // const lastIndex = dir.lastIndexOf('\\');
      const filePromise = Promise.all(
        files.map(file => stat(path.join(filePath, file)))
      );

      filePromise.then(items => {
        const data = {
          title: path.basename(filePath),
          dir: dir ? `/${dir}` : '',
          files: files.map((file, index) => {
            return {
              file,
              iconName: getIconName(file, items[index])
            }
          })
        }
        res.end(template(data));
      }) 
    }
  } catch (error) {
    res.statusCode = 404;
    res.setHeader("Content-Type", "text/plain");
    res.end(`${filePath} is not a directory or file`);
    return;
  }
}