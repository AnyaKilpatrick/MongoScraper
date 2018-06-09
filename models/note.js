var mongoose = require("mongoose");

var Schema = mongoose.Schema;

// creating a new NoteSchema object
var NoteSchema = new Schema({
    text: {
        type: String,
        required:true
    }
});

// creating model from the above schema, using mongoose model method
var Note = mongoose.model("Note", NoteSchema);

// exposrting the Note model
module.exports = Note;