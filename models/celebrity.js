const mongoose = require('mongoose')
const Schema = mongoose.Schema

const celebritySchema = new Schema({
    name: {
        type: String,
        required: true,
        unique: true
    },
    description: {
        type: String
    },
    birthdate:{
        type: Date
    },
    deathdate:{
        type: Date,
        required: true
    },
    featured:{
        type: Boolean,
        default: false
    },
    //comments: [commentSchema]
}, {
    timestamps: true
})

const Celebrity = mongoose.model('Celebrity', celebritySchema)

module.exports = Celebrity