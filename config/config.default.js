'use strict';
const path = require('path');

module.exports = appInfo => {
  const config = exports = {};

  // use for cookie sign key, should change to your own and keep security
  config.keys = appInfo.name + '_1512888036899_9309';

  // add your config here
  config.middleware = [];
  config.mysql = {
  // 单数据库信息配置
    client: {
      // host
      host: 'gz-cdb-9xnybols.sql.tencentcdb.com',
      // 端口号
      port: '63817',
      // 用户名
      user: 'root',
      // 密码
      password: '888**BBBBBDIKce121z**',
      // 数据库名
      database: 'blog',
    },
    // 是否加载到 app 上，默认开启
    app: true,
    // 是否加载到 agent 上，默认关闭
    agent: false,
  };
  config.security = {
    csrf: {
      enable: false,
    },
    domainWhiteList: [ 'http://localhost:8000', 'http://127.0.0.1:8000' ],
  };
  config.view = {
    root: [
      path.join(appInfo.baseDir, 'app/view'),
    ].join(','),
    defaultViewEngine: 'nunjucks',
    defaultExtension: '.nj',
  };
  return config;
};
