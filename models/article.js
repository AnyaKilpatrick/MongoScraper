var mongoose = require("mongoose");

// saving a reference to the schema constructor
var Schema = mongoose.Schema;

// creating a new ArticleSchema object
 var ArticleSchema = new Schema({
    // title
    title:{
        type:String,
        required:true
    },
    // link to article
    articleLink:{
        type: String,
        required:true
    },
    // summary
    summary:{
        type: String,
        required:true
    },
    // link to img
    imgLink:{
        type: String,
        required:false
    },
    // adding an id of the note/review associated with this article
    note:{
        type:Schema.Types.ObjectId,
        ref:"Note"
    },
    saved:{
        type:Boolean,
        default:false
    }
 });

var Article = mongoose.model("Article", ArticleSchema);

// exporting Article model
module.exports = Article;
