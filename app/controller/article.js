'use strict';
var fs = require('fs');
var path = require('path');
var utils = require('../util');

const Controller = require('egg').Controller;

class ArticleController extends Controller {
  async list() {
    const results = await this.ctx.service.article.queryArticles({});
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
    const body = ctx.request.body;
    const { title, content, id, type, coverPage } = body;
    const article = {
      title,
      content,
      type,
      time: Date.now(),
      subContent: utils.extractTextFromHtml(content),
    };
    if(coverPage) {
      article.coverPage = utils.getSmallImagePath(coverPage);
      let imageName = utils.extractImageName(coverPage);
      utils.manipulateImage(path.join(this.config.imagePath, imageName));
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
          // // arrays are busboy fields
          // console.log('field: ' + part[0]);
          // console.log('value: ' + part[1]);
          // console.log('valueTruncated: ' + part[2]);
          // console.log('fieldnameTruncated: ' + part[3]);
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

          let result, diskPath;
          try {
            diskPath = path.join(this.config.imagePath, part.filename);
            uploadedFiles.push({
              name: part.filename,
              url: '/public/images/'+part.filename
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
