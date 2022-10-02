
// IMPORTS
const express = require('express');
    const app = express();
const mongoose = require('mongoose');
const PORT = process.env.PORT || 3001;



// MIDDLEWARE
app.use(express.json());
app.use(express.urlencoded({extended: true}));

app.use(require('./routes'));



// INITIALIZE

// Connect Mongoose
mongoose.connect(process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/social-network-api', {
    useNewUrlParser: true,
    useUnifiedTopology: true
});
mongoose.set('debug', true); // This logs all Mongo queries that are executed


// Connect server
app.listen(PORT, () => console.log(`Connected on localhost:${PORT}`));
