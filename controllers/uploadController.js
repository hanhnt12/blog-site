const fs = require('fs');
const path = require('path');
const config = require('config');
const formidable = require('formidable');
const moment = require('moment');
const _ = require('lodash');

const asyncMiddleware = require('../middlewares/async');
const AppError = require('../common/error/AppError');
const logger = require('../startup/logging');

/* Upload image. */
exports.upload = asyncMiddleware(async (req, res) => {
    logger.info(`Perfomring upload file...`);
    // Creates a new incoming form
    let form = new formidable.IncomingForm();
    // Sets the directory for placing file uploads in. 
    form.uploadDir = path.join(PROJECT_DIR, config.get('posts.upload.tmpUploadDir'));
    form.maxFileSize = config.get('posts.upload.size');
    form.keepExtensions = true;

    const { oldFile, newFile } = await uploadFile(form, req);

    const isComplete = await moveFile(oldFile, newFile);

    if (!isComplete) {
        throw new AppError('system.sem0001', 500);
    }

    res.responseData = {
        file: newFile.replace(PROJECT_DIR, '')
    };
});

/**
 * Perform upload file
 * @param {File} form 
 * @param {request} req 
 */
function uploadFile(form, req) {
    return new Promise((resolve, reject) => {
        form.parse(req, (err, fields, files) => {
            logger.debug(`Begin upload file...`);
            if (err) {
                logger.error(`Has error when upload file: ${err}`);
                if (err.message.indexOf('maxFileSize') >= 0) {
                   return reject(new AppError('post.pvm0005', 400)); 
                } else {
                    return reject(new AppError('post.pvm0007', 400));
                }
            }
            const fileExt = files.file.name.split('.').pop();
            if (config.get('posts.upload.ext').indexOf(fileExt) < 0) {
                return reject(new AppError('post.pvm0006', 400));
            }

            let oldFile = files.file.path;
            let newFile = path.join(PROJECT_DIR, config.get('posts.upload.uploadDir'), generateFileName(files.file.name));
            resolve({ oldFile, newFile });
        });
    });
}

/**
 * Move file upload
 * @param {String} oldPath 
 * @param {String} newPath 
 */
function moveFile(oldPath, newPath) {
    return new Promise((resolve, reject) => {
        fs.rename(oldPath, newPath, (err) => {
            logger.debug(`Move upload file from ${oldPath} to ${newPath}`);
            if (err) {
                return reject(err);
            }
            return resolve(true);
        });
    });
}

/** Validate form data */
exports.validate = function (req, res, next) {
    logger.debug(`Performing validate upload file...`);
    try {
        // Validate request
        if (!isFormData(req)) {
            throw new AppError('post.pvm0004', 400);
        }
        next();
    } catch (err) {
        logger.debug(`Catching error when validate upload file...`);
        throw err;
    }
}

/**
 * Check request is form data
 * @param {Request} req 
 */
function isFormData(req) {
    const type = req.headers['content-type'] || '';
    return 0 === type.indexOf('multipart/form-data');
}

/**
 * Create file name
 * @param {String} fileName 
 */
function generateFileName(fileName) {
    if (!fileName || !_.isString(fileName)) {
        logger.debug(`Generate file name error. fileName: ${fileName}`);
        throw new AppError('system.sem0001', 500);
    }

    // get file extension
    let fileExt = fileName.split('.').pop();

    // current date
    let current = moment(Date.now()).format("YYYY_MM_DD_HH_mm_ss");

    // random number
    let randomNumber = Math.random().toString().slice(2,11);

    return current + '_' + randomNumber + '.' + fileExt;
}
