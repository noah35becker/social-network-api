
// IMPORTS
const {Schema, model, Types} = require('mongoose');
const formatDate = require('../utils/formatDate');



// SCHEMAS

// Reaction schema (subdocument)
const ReactionSchema = new Schema(
    {  // Fields
        reactionId: {  // Set custom ID, to avoid confusion with the parent Thought's `_id`
            type: Schema.Types.ObjectId,
            default: () => new Types.ObjectId()
        },
        reactionBody: {
            type: String,
            required: '`reactionBody` is required',
            trim: true,
            minLength: 1,
            maxLength: 280
        },
        user: {  // controllers later use `populate` to pull in the user's `username`
            type: Schema.Types.ObjectId,
            ref: 'User',
            required: '`user` (an ObjectId) is required'
        },
        createdAt: {
            type: Date,
            default: Date.now,
            get: createdAtVal => formatDate(createdAtVal)  // Format date when queried
        }
    },
    {  // Options
        toJSON: {
            getters: true  // use whatever getters are specified (see `createdAt.get` above)
        },
        id: false,
        _id: false
    }
);


// Thought schema
const ThoughtSchema = new Schema(
    {  // Fields
        thoughtText: {
            type: String,
            required: '`thoughtText` is required',  // custom err msg
            trim: true,
            minLength: 1,
            maxLength: 280
        },
        createdAt: {
            type: Date,
            default: Date.now,
            get: createdAtVal => formatDate(createdAtVal)  // Format date when queried
        },
        user: {  // controllers later use `populate` to pull in the user's `username`
                type: Schema.Types.ObjectId,
                ref: 'User',
                required: '`user` (an ObjectId) is required'
        },
        reactions: [ReactionSchema]
    },
    {  // Options
        toJSON: {
            getters: true,  // use whatever getters are specified (see `createdAt.get` above)
            virtuals: true  // use whatever `virtual`s are specified (see `reactionCount` below)
        },
        id: false  // `id` is an ID generated by MongoDB, different from the `_id` that's already generated by Mongoose; only one is needed
    }
);

// `virtual` for total count of reactions, computed when a `Thought` document is queried
ThoughtSchema.virtual('reactionCount').get(function(){
    return this.reactions.length;
});



// MONGOOSE MODEL
const Thought = model('Thought', ThoughtSchema);



// EXPORT
module.exports = Thought;