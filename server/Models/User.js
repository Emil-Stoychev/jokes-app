const mongoose = require('mongoose')

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: [true, 'Username is required!'],
        unique: true
    },
    password: {
        type: String,
        required: [true, 'Password is required'],
    },
    rank: {
        type: Number,
        default: 0
    },
    blacklisted: [{type: mongoose.Schema.Types.ObjectId, ref: 'User'}],
    likedStars: [{type: mongoose.Schema.Types.ObjectId, ref: 'User'}],
    ownStars: [{type: mongoose.Schema.Types.ObjectId, ref: 'User'}],
    ownJokesCount: {
        type: Number,
        default: 0
    },
    likedJokesCount: {
        type: Number,
        default: 0
    },
    avatar: {
        type: String,
        default: 'profile.gif'
    },
},
    { timestamps: true },
)

const User = mongoose.model('User', userSchema)

exports.User = User