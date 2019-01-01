const moment = require('moment');
const _ = require('lodash');

const VN_CHAR_ACCENT = ['À', 'Á', 'Â', 'Ã', 'È', 'É', 'Ê', 'Ì', 'Í',
    'Ò', 'Ó', 'Ô', 'Õ', 'Ù', 'Ú', 'Ý', 'à', 'á', 'â', 'ã', 'è', 'é', 'ê', 'ì', 'í', 'ò', 'ó', 'ô', 'õ', 'ù',
    'ú', 'ý', 'Ă', 'ă', 'Đ', 'đ', 'Ĩ', 'ĩ', 'Ũ', 'ũ', 'Ơ', 'ơ', 'Ư', 'ư', 'Ạ', 'ạ', 'Ả', 'ả', 'Ấ', 'ấ', 'Ầ',
    'ầ', 'Ẩ', 'ẩ', 'Ẫ', 'ẫ', 'Ậ', 'ậ', 'Ắ', 'ắ', 'Ằ', 'ằ', 'Ẳ', 'ẳ', 'Ẵ', 'ẵ', 'Ặ', 'ặ', 'Ẹ', 'ẹ', 'Ẻ', 'ẻ',
    'Ẽ', 'ẽ', 'Ế', 'ế', 'Ề', 'ề', 'Ể', 'ể', 'Ễ', 'ễ', 'Ệ', 'ệ', 'Ỉ', 'ỉ', 'Ị', 'ị', 'Ọ', 'ọ', 'Ỏ', 'ỏ', 'Ố',
    'ố', 'Ồ', 'ồ', 'Ổ', 'ổ', 'Ỗ', 'ỗ', 'Ộ', 'ộ', 'Ớ', 'ớ', 'Ờ', 'ờ', 'Ở', 'ở', 'Ỡ', 'ỡ', 'Ợ', 'ợ', 'Ụ', 'ụ',
    'Ủ', 'ủ', 'Ứ', 'ứ', 'Ừ', 'ừ', 'Ử', 'ử', 'Ữ', 'ữ', 'Ự', 'ự', 'Ỳ', 'ỳ', 'Ỵ', 'ỵ', 'Ỷ', 'ỷ', 'Ỹ', 'ỹ'];

const VN_CHAR_REMOVE_ACCENT = ['A', 'A', 'A', 'A', 'E', 'E', 'E', 'I',
    'I', 'O', 'O', 'O', 'O', 'U', 'U', 'Y', 'a', 'a', 'a', 'a', 'e', 'e', 'e', 'i', 'i', 'o', 'o', 'o', 'o',
    'u', 'u', 'y', 'A', 'a', 'D', 'd', 'I', 'i', 'U', 'u', 'O', 'o', 'U', 'u', 'A', 'a', 'A', 'a', 'A', 'a',
    'A', 'a', 'A', 'a', 'A', 'a', 'A', 'a', 'A', 'a', 'A', 'a', 'A', 'a', 'A', 'a', 'A', 'a', 'E', 'e', 'E',
    'e', 'E', 'e', 'E', 'e', 'E', 'e', 'E', 'e', 'E', 'e', 'E', 'e', 'I', 'i', 'I', 'i', 'O', 'o', 'O', 'o',
    'O', 'o', 'O', 'o', 'O', 'o', 'O', 'o', 'O', 'o', 'O', 'o', 'O', 'o', 'O', 'o', 'O', 'o', 'O', 'o', 'U',
    'u', 'U', 'u', 'U', 'u', 'U', 'u', 'U', 'u', 'U', 'u', 'U', 'u', 'Y', 'y', 'Y', 'y', 'Y', 'y', 'Y', 'y'];

/**
 * Convert string VietNamese accent string to non accent
 * @param {String} input 
 */
function removeAccent(input) {
    if (!input || !_.isString(input)) {
        return '';
    }

    const charArr = input.split('');
    const output = charArr.reduce((accumlator, currentValue) => {
        let index = VN_CHAR_ACCENT.indexOf(currentValue);
        let replaceChar = currentValue;
        if (index >= 0) {
            replaceChar = VN_CHAR_REMOVE_ACCENT[index];
        }
        return accumlator + replaceChar;
    }, '');
    if (output) {
        return output;
    }

    return input;
}

/**
 * Generate permark link for post
 * 1. Remove VietNamese accent
 * 2. Remove none alphanumberic character
 * 3. Construct permark link:
 *      title + '-' + current date + 1 random lowercase character + 1 or 2 random digit
 * @param {String} title 
 */
function generatePermarkLink(title) {
    if (!title || !_.isString(title)) {
        return '';
    }

    let removedAccent = removeAccent(title);
    removedAccent = removedAccent.toLowerCase();
    // replace all non alphanumberic and space character to space
    removedAccent = _.replace(removedAccent, /[^a-z^\d\s]/g, ' ');

    // split word by space
    let permakLink = removedAccent.split(/\s/).filter((w) => {
        return w.trim().length > 0;
    }).reduce((accumlator, currentValue) => { 
        return accumlator + '-' + currentValue;
    });

    // current date
    let current = moment(Date.now()).format("YYYY-MM-DD-HH-mm");

    // random number
    let randomNumber = Math.floor(Math.random() * 100);
    let randomChar = VN_CHAR_REMOVE_ACCENT[randomNumber] || 'p'

    return permakLink + '-' + current + randomChar.toLowerCase() + randomNumber;
}

/**
 * check object id of mongo
 */
function isValidObjectId(id) {
  if (id && id.match(/^[0-9a-fA-F]{24}$/)) {
    // Yes, it's a valid ObjectId, proceed with `findById` call.
    return true;
  }

  return false;
}

exports.generatePermarkLink = generatePermarkLink;
exports.isValidObjectId = isValidObjectId;
