
// IMPORT
const {User, Thought} = require('../models');



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
                        select: '-__v -user',
                        populate: {
                            path: 'reactions',
                            populate: {
                                path: 'user',
                                select: '_id username'
                            }
                        }
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
            res.json({
                message: 'User successfully created',
                user: dbUserData
            });
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
                        select: '-__v -user',
                        populate: {
                            path: 'reactions',
                            populate: {
                                path: 'user',
                                select: '_id username'
                            }
                        }
                    },
                    {
                        path: 'friends',
                        select: '_id username email'
                    },
                ]).select('-__v');

            if (!dbUserData)
                return res.status(404).json({message: `No User found with an ID of ${params.id}`});

            res.json({
                message: 'User successfully updated',
                user: dbUserData
            });
        }catch (err){
            console.log(err);
            res.status(500).json(err);
        }
    },


    // Delete User by ID
    async deleteUser({params}, res){
        try{
            const dbUserData = await User.findOneAndDelete({_id: params.id})
                .populate([
                    {
                        path: 'thoughts',
                        select: '-__v -user',
                        populate: {
                            path: 'reactions',
                            populate: {
                                path: 'user',
                                select: '_id username'
                            }
                        }
                    },
                    {
                        path: 'friends',
                        select: '_id username email'
                    },
                ]).select('-__v');

            if (!dbUserData)
                return res.status(404).json({message: `No User found with an ID of ${params.id}`});

            dbUserData.thoughts.forEach(async thought => await Thought.deleteOne({_id: thought._id}));  // also purge User's associated Thoughts from the database

            dbUserData.friends.forEach(async friend => await User.updateOne(  // also remove User from all other Users' friends lists
                {_id: friend._id},
                {$pull: {friends: dbUserData._id}},
            ));

            res.json({
                message: 'User and all its associated Thoughts successfully deleted, and User removed from all other Users\' friends lists',
                user: dbUserData
            });
        }catch (err){
            console.log(err);
            res.status(500).json(err);
        }
    },


    // Add friends to each other's friends list
    async mutualAddFriends({params}, res){
        try{
            const dbUserData1 = await User.findOneAndUpdate(
                {_id: params.userId},
                {$push: {friends: params.friendId}},
                {new: true},
            )
                .populate({
                    path: 'friends',
                    select: '_id username email'
                }).select('-__v');

            if (!dbUserData1)
                return res.status(404).json({message: `No User found with an ID of ${params.userId}`});

            const dbUserData2 = await User.findOneAndUpdate(
                {_id: params.friendId},
                {$push: {friends: params.userId}},
                {new: true},
            )
                .populate({
                    path: 'friends',
                    select: '_id username email'
                }).select('-__v');

            if (!dbUserData2)
                return res.status(404).json({message: `No User found with an ID of ${params.friendId}`});
                
            res.json({
                message: 'Users are mutually added to each other\'s friends list',
                user1: dbUserData1,
                user2: dbUserData2
            });
        }catch (err){
            console.log(err);
            res.status(400).json(err);
        }
    },


    // Remove friends from each other's friends list
    async mutualRemoveFriends({params}, res){
        try{
            const dbUserData1 = await User.findOneAndUpdate(
                {_id: params.userId},
                {$pull: {friends: params.friendId}},
                {new: true},
            )
                .populate({
                    path: 'friends',
                    select: '_id username email'
                }).select('-__v');

            if (!dbUserData1)
                return res.status(404).json({message: `No User found with an ID of ${params.userId}`});

            const dbUserData2 = await User.findOneAndUpdate(
                {_id: params.friendId},
                {$pull: {friends: params.userId}},
                {new: true},
            )
                .populate({
                    path: 'friends',
                    select: '_id username email'
                }).select('-__v');

            if (!dbUserData1)
                return res.status(404).json({message: `No User found with an ID of ${params.friendId}`});
                
            res.json({
                message: 'Users are mutually removed from each other\'s friends list',
                user1: dbUserData1,
                user2: dbUserData2
            });
        }catch (err){
            console.log(err);
            res.status(400).json(err);
        }
    }
};


// EXPORT
module.exports = userController;