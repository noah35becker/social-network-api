
// IMPORT
const {DateTime} = require('luxon');

// EXPORT
module.exports = date => DateTime.fromJSDate(date).toFormat(`MMM d, yyyy 'at' h:mma`);