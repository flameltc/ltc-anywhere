const http = require('http');
const path = require('path');
const chalk = require('chalk');
const conf = require('./config/defaultConfig');
const route = require('./helper/route')
const openUrl = require('./helper/openUrl')

class Server {
  constructor(config) {
    this.config = Object.assign({}, conf, config);
  }
  start() {
    const server = http.createServer((req, res) => {
      const filePath = path.join(this.config.root, req.url);
      route(req, res, filePath, this.config)
    });

    server.listen(this.config.port, this.config.hostname, () => {
      const addr = `http://${this.config.hostname}:${this.config.port}`;
      console.info(`server running at ${chalk.green(addr)}`); // eslint-disable-line
      openUrl(addr)
    })
  }
}
module.exports = Server;


