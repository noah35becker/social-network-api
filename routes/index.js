
// IMPORTS
const router = require('express').Router();
const apiRoutes = require('./api');

// MIDDLEWARE
router.use('/api', apiRoutes);
router.use((req, res) => res.status(404).json({message: 'Invalid URL'}));

// EXPORT
module.exports = router;