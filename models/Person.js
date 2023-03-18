const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const PersonSchema = new Schema({
    name: {
        type : String,
    },
    email: {
        type : String,
        required : true
    },
    password: {
        type : String,
        required : true
    },
    gender: {
        type : String,
        required : true
    },
    maleprofilepic: {
        type : String,
        default : "https://png.pngtree.com/png-vector/20190710/ourmid/pngtree-user-vector-avatar-png-image_1541962.jpg"
    },
    femaleprofilepic : {
        type : String,
        default :"https://static.vecteezy.com/system/resources/thumbnails/004/899/680/small/beautiful-blonde-woman-with-makeup-avatar-for-a-beauty-salon-illustration-in-the-cartoon-style-vector.jpg"
    },
    date: {
        type : Date,
        default : Date.now()
    }
})

module.exports = Person = mongoose.model("myPerson", PersonSchema);