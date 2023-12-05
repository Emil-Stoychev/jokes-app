const mongoose = require('mongoose')

const jokeSchema = new mongoose.Schema({
    text: {
        type: String,
        require: true
    },
    textColor: String,
    bgColor: String,
    size: Number,
    textAlign: String,
    author: {type: mongoose.Schema.Types.ObjectId, ref: 'User'},
    likes: [{type: mongoose.Schema.Types.ObjectId, ref: 'User'}]
},
    { timestamps: true },
)

const Joke = mongoose.model('Joke', jokeSchema)

exports.Joke = Joke