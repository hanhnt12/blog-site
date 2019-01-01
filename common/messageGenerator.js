const resource = require('./resources/message.json');

module.exports = function (key) {
    if (key && key.indexOf('.') >= 0) {
        let arr = key.split('.');
        let message = arr.reduce((accumulator, currentValue, currentIndex, arr) => {
            if (currentIndex === 0) {
                return accumulator;
            }
            return accumulator[currentValue];
        }, resource[arr[0]]);
        if (!message) {
            return resource.system.sem0001;
        }
        return message;
    }

    return '';
}