
// IMPORT
const {User} = require('../models');



// FUNCTIONS
const userController = {

    // Get all Users
    async getAllUsers(req, res){
        try{
            const dbUsersData = await User.find({})
                .select('-__v')  // exclude the `__v` field from query results
                .sort({_id: -1});  // sort by descending order of `_id` (which contains, as part of its char sequence, a timestamp)
            res.json(dbUsersData);
        }catch (err){
            console.log(err);
            res.status(500).json(err);
        }
    },


    // Get one User by ID
    async getUserById({params}, res){
        try {
            const dbUserData = await User.findOne({_id: params.id})
                .populate([
                    {
                        path: 'thoughts',
                        select: '-__v -user'
                    },
                    {
                        path: 'friends',
                        select: '_id username email'
                    },
                ]).select('-__v');

            if (!dbUserData)
                return res.status(404).json({message: `No User found with an ID of ${params.id}`});

            res.json(dbUserData);
        }catch (err){
            console.log(err);
            res.status(500).json(err);
        }
    },


    // Create User
    async createUser({body}, res){  // `body` = {username, email}
        try{
            const dbUserData = await User.create(body);
            res.json(dbUserData);
        }catch (err){
            console.log(err);
            res.status(400).json(err);
        }
    },


    // Update User by ID
    async updateUser({params, body}, res){
        try{
            const dbUserData = await User.findOneAndUpdate(
                {_id: params.id},
                body,
                {
                    new: true,
                    runValidators: true  // otherwise, validators only run when creating a document
                },
            )
                .populate([
                    {
                        path: 'thoughts',
                        select: '-__v -user'
                    },
                    {
                        path: 'friends',
                        select: '_id username email'
                    },
                ]).select('-__v');

            if (!dbUserData)
                return res.status(404).json({message: `No User found with an ID of ${params.id}`});

            res.json(dbUserData);
        }catch (err){
            console.log(err);
            res.status(500).json(err);
        }
    },


    // Delete User by ID
    async deleteUser({params}, res){
        try{
            const dbUserData = await User.findOneAndDelete({_id: params.id})
                .select('-__v');

            if (!dbUserData)
                return res.status(404).json({message: `No User found with an ID of ${params.id}`});

            res.json({
                message: 'User and all its associated Thoughts successfully deleted',
                user: dbUserData
            });
        }catch (err){
            console.log(err);
            res.status(500).json(err);
        }
    },


    // Add a friend to User's friends list
    async addFriend({params}, res){
        try{
            const dbUserData = await User.findOneAndUpdate(
                {_id: params.userId},
                {$push: {friends: params.friendId}},
                {new: true},
            )
                .populate([
                    {
                        path: 'thoughts',
                        select: '-__v -user'
                    },
                    {
                        path: 'friends',
                        select: '_id username email'
                    },
                ]).select('-__v');

            if (!dbUserData)
                return res.status(404).json({message: `No User found with an ID of ${params.userId}`});
                
            res.json(dbUserData);
        }catch (err){
            console.log(err);
            res.status(400).json(err);
        }
    },


    // Remove a friend to User's friends list
    async removeFriend({params}, res){
        try{
            const dbUserData = await User.findOneAndUpdate(
                {_id: params.userId},
                {$pull: {friends: params.friendId}},
                {new: true},
            )
                .populate([
                    {
                        path: 'thoughts',
                        select: '-__v -user'
                    },
                    {
                        path: 'friends',
                        select: '_id username email'
                    },
                ]).select('-__v');

            if (!dbUserData)
                return res.status(404).json({message: `No User found with an ID of ${params.userId}`});
                
            res.json(dbUserData);
        }catch (err){
            console.log(err);
            res.status(400).json(err);
        }
    }
};


// EXPORT
module.exports = userController;