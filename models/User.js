
// IMPORTS
const {Schema, model} = require('mongoose');


// SCHEMA
const UserSchema = new Schema(
    {  // Fields
        username: {
            type: String,
            required: '"username" is required',  // custom err msg
            trim: true,
            unique: true  // creates a 'unique index' for this field, i.e. not really validation per se
        },
        email: {
            type: String,
            required: '"email" is required',
            trim: true,
            unique: true,
            lowercase: true,  // convert to lowercase before saving
            match: [/^[a-z0-9_\.]+@[a-z0-9\.]+\.[a-z]{2,3}$/i, '"email" is invalid']
        },
        thoughts: [
            {
                type: Schema.Types.ObjectId,
                ref: 'Thought'
            },
        ],
        friends: [
            {
                type: Schema.Types.ObjectId,
                ref: 'User'
            }
        ]
    },
    {  // Options
        toJSON: {
            virtuals: true,  // use whatever `virtual`s are specified (see `friendCount` below)
        },
        id: false  // `id` is an ID generated by MongoDB, different from the `_id` that's already generated by Mongoose; only one is needed
    }
);

// `virtual` for total count of friends, computed when a `User` document is queried
UserSchema.virtual('friendCount').get(function(){
    return this.friends.length;
});


// MONGOOSE MODEL
const User = model('User', UserSchema);


// EXPORT
module.exports = User;