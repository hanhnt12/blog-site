const bcrypt = require('bcrypt');

async function run () {
    await bcrypt.genSalt(10);
}