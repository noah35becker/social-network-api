
// IMPORT
const {Thought, User} = require('../models');



// FUNCTIONS
const thoughtController = {

    // Get all Thoughts
    async getAllThoughts(req, res){
        try{
            const dbThoughtsData = await Thought.find({})
                .populate([
                    {
                        path: 'user',
                        select: '_id username'
                    },
                    {
                        path: 'reactions',
                        populate: {
                            path: 'user',
                            select: '_id username'
                        }
                    }
                ]).select('-__v')  // exclude the `__v` field from query results
                .sort({_id: -1});  // sort by descending order of `_id` (which contains, as part of its char sequence, a timestamp)
            res.json(dbThoughtsData);
        }catch (err){
            console.log(err);
            res.status(500).json(err);
        }
    },


    // Get one Thought by ID
    async getThoughtById({params}, res){
        try {
            const dbThoughtData = await Thought.findOne({_id: params.id})
                .populate([
                    {
                        path: 'user',
                        select: '_id username'
                    },
                    {
                        path: 'reactions',
                        populate: {
                            path: 'user',
                            select: '_id username'
                        }
                    }
                ]).select('-__v');

            if (!dbThoughtData)
                return res.status(404).json({message: `No Thought found with an ID of ${params.id}`});

            res.json(dbThoughtData);
        }catch (err){
            console.log(err);
            res.status(500).json(err);
        }
    },


    // Create Thought
    async createThought({body}, res){  // `body` = {thoughtText, user (ObjectId)}
        try{
            const dbThoughtData = await Thought.create(body);

            await User.findOneAndUpdate(
                {_id: body.user},
                {$push: {thoughts: dbThoughtData._id}},
                {new: true}
            );

            res.json({
                message: 'Thought successfully created',
                thought: dbThoughtData
            });
        }catch (err){
            console.log(err);
            res.status(400).json(err);
        }
    },


    // Update Thought by ID
    async updateThought({params, body}, res){
        try{
            const dbThoughtData = await Thought.findOneAndUpdate(
                {_id: params.id},
                {thoughtText: body.thoughtText},  // Validation: `body` should only include `thoughtText` (not `user`: It would be bad practice to switch a Thought's ownership from one User to another)
                {
                    new: true,
                    runValidators: true  // otherwise, validators only run when creating a document
                },
            )
                .populate([
                    {
                        path: 'user',
                        select: '_id username'
                    },
                    {
                        path: 'reactions',
                        populate: {
                            path: 'user',
                            select: '_id username'
                        }
                    }
                ]).select('-__v');

            if (!dbThoughtData)
                return res.status(404).json({message: `No Thought found with an ID of ${params.id}`});

                res.json({
                    message: 'Thought successfully updated',
                    thought: dbThoughtData
                });
        }catch (err){
            console.log(err);
            res.status(500).json(err);
        }
    },


    // Delete Thought by ID
    async deleteThought({params}, res){
        try{
            const dbThoughtData = await Thought.findOneAndDelete({_id: params.id})
                .select('-__v');

            if (!dbThoughtData)
                return res.status(404).json({message: `No Thought found with an ID of ${params.id}`});

            await User.updateOne(
                {_id: dbThoughtData.user},
                {$pull: {thoughts: dbThoughtData._id}},
                {new: true}
            );

            res.json({
                message: 'Thought successfully deleted',
                thought: dbThoughtData
            });
        }catch (err){
            console.log(err);
            res.status(500).json(err);
        }
    },


    // Add a reaction to a Thought
    async addReaction({params, body}, res){  // `body` = {reactionBody, user (ObjectId)}
        try{
            const dbThoughtData = await Thought.findOneAndUpdate(
                {_id: params.thoughtId},
                {$push: {reactions: body}},
                {
                    new: true,
                    runValidators: true
                },
            )
                .populate([
                    {
                        path: 'user',
                        select: '_id username'
                    },
                    {
                        path: 'reactions',
                        populate: {
                            path: 'user',
                            select: '_id username'
                        }
                    }
                ]).select('-__v');

            if (!dbThoughtData)
                return res.status(404).json({message: `No User found with an ID of ${params.thoughtId}`});
                
            res.json({
                message: 'Reaction successfully added',
                thought: dbThoughtData
            });
        }catch (err){
            console.log(err);
            res.status(400).json(err);
        }
    },


    // Remove a reaction from a Thought
    async removeReaction({params}, res){
        try{
            const dbThoughtData = await Thought.findOneAndUpdate(
                {_id: params.thoughtId},
                {$pull: {reactions: {reactionId: params.reactionId}}},
                {new: true},
            )
                .populate([
                    {
                        path: 'user',
                        select: '_id username'
                    },
                    {
                        path: 'reactions',
                        populate: {
                            path: 'user',
                            select: '_id username'
                        }
                    }
                ]).select('-__v');

            if (!dbThoughtData)
                return res.status(404).json({message: `No Thought found with an ID of ${params.thoughtId}`});
                
                res.json({
                    message: 'Reaction successfully deleted',
                    thought: dbThoughtData
                });
        }catch (err){
            console.log(err);
            res.status(400).json(err);
        }
    },
};


// EXPORT
module.exports = thoughtController;