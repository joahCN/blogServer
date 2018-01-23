'use strict';
var fs = require('fs');
var path = require('path');
var utils = require('../util');
var moment = require('moment');

const Controller = require('egg').Controller;

class ArticleController extends Controller {
  async list() {
    //query login user's article list
    const results = await this.ctx.service.article.queryArticles({
      where: {authorId: this.ctx.user.id}
    });
    this.ctx.body = {
      list: results,
    };
  }

  async sortList() {
    const results = await this.ctx.service.article.queryArticles({
      columns: ['id', 'title', 'coverPage', 'type', 'subContent'],
    });
    this.ctx.body = {
      list: results,
    };
  }

  async create() {
    const ctx = this.ctx;
    const user = ctx.user;
    const body = ctx.request.body;
    const { title, content, id, type, coverPage } = body;
    const article = {
      title,
      content,
      type,
      time: moment().format("YYYY-MM-DD, h:mm:ss a"),
      subContent: utils.extractTextFromHtml(content),
      authorId: user.id,
      author: user.name
    };
    if(coverPage) {
      article.coverPage = utils.getSmallImagePath(coverPage);
      let imageName = utils.extractImageName(coverPage);
      utils.manipulateImage(path.join(this.config.imagePath, imageName));
    } else {
      article.coverPage = utils.getDefaultCoverPage(type);
    }
    let result;
    if (id) {
      article.id = id;
      result = await this.app.mysql.update('articles', article);
    } else {
      result = await this.app.mysql.insert('articles', article);
    }
    if (result.affectedRows === 1) {
      ctx.body = {
        success: true,
      };
    } else {
      ctx.body = {
        success: false,
      };
    }
  }
  
  async deleteArticle() {
    const id = this.ctx.request.body.id;
    const result = await this.app.mysql.delete('articles', {
      id: id,
    });
    this.ctx.body = {
      success: result.affectedRows === 1
    }
  }

  async uploadFiles() {
    const ctx = this.ctx;
    const parts = ctx.multipart();
    let part, uploadedFiles = [];
    try {
      while ((part = await parts()) != null) {
        if (part.length) {
          ctx.logger.debug('arrays are busboy fields: ');
        } else {
          if (!part.filename) {
            // user click `upload` before choose a file,
            // `part` will be file stream, but `part.filename` is empty
            // must handler this, such as log error.
            ctx.logger.error('no file uploaded');
            return;
          }
          // otherwise, it's a stream
          ctx.logger.debug("upload file: ");
          ctx.logger.debug("filename: " + part.fieldname + " | mime:" + part.mime + " | encoding:" + part.encoding);

          let result, diskPath, savedFileName, dotIndex;
          try {
            dotIndex = part.filename.lastIndexOf(".");
            savedFileName = part.filename.substr(0, dotIndex) + Date.now() + part.filename.substr(dotIndex);
            diskPath = path.join(this.config.imagePath, savedFileName);
            uploadedFiles.push({
              name: part.filename,
              url: '/public/images/' + savedFileName
            });
            part.pipe(fs.createWriteStream(diskPath))
          } catch (err) {
            ctx.logger.debug("upload file error: " + err);
            ctx.logger.error("upload file fail: " + err);
            throw err;
          }

        }
        this.ctx.body = {
          success: true,
          uploadFiles: uploadedFiles
        };
      }
    } catch (err) {
      
      this.ctx.body = {
        success: false,
      };
    }
    
  }
}

module.exports = ArticleController;
