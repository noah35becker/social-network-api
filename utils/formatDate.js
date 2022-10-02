
// IMPORT
const {DateTime} = require('luxon');

// EXPORT
module.exports = date => DateTime.fromMillis(date).toFormat('MMM d, yyyy "at" h:mma');