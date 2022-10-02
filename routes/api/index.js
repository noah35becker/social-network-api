
// IMPORTS
const router = require('express').Router();
const userRoutes = require('./user-routes');
const thoughtRoutes = require('./thought-routes');

// MIDDLEWARE
router.use('/users', userRoutes);
router.use('/thoughts', thoughtRoutes);

// EXPORT
module.exports = router;