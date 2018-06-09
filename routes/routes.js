var express = require("express");
var app = express();
var db=require("../models");
var axios=require("axios");
var cheerio=require("cheerio");


module.exports = function(app){
    // ============home page============
    app.get("/", function(req, res){
        // grabbing data from Articles collection
        db.Article.find({}).then(function(dbArticle){
            console.log("dbArticle!!!!!!!!" + dbArticle.length);
            if(dbArticle.length>0){
                console.log("found "+dbArticle.length+"results");
                // creating an object to pass it to index handlebar
                var hbsObject = {
                    articles: dbArticle
                };
                res.render("index", hbsObject);
            }else{
                res.render("index");
            }
        })
        .catch(function(err){
            // in case of error
            res.json(err);
        })
        console.log("Home page launched");
    })
    //============route for scraping news=======
    app.get("/scrape", function(req, res){
        // grabbing body of html request
        axios.get("http://www.bbc.com/travel/").then(function(response){
            // loading it into cheerio
            var $ = cheerio.load(response.data);

            $("div.promo-unit-layout-standard").each(function(i, element){
                // saving empty result object
                var result = {};
                // grabbing img, title, summary and link of each div(article)
                result.title = $(element)
                    .find("h3.promo-unit-title")
                    .text().trim();
                result.articleLink = $(element)
                    .find("h3.promo-unit-title")
                    .parent("a")
                    .attr("href");
                result.summary = $(element)
                    .find("p.promo-unit-summary")
                    .text().trim();
                result.imgLink = $(element)
                    .find("a")
                    .attr("href")
                    .replace("130_73", "976_549"); //replacing it in an img src, so we can load a higher quality picture
                console.log(result);
                // Create a new Article using the `result` object built from scraping
                db.Article.update( //using upsert option to insert new data only if it doesn't already exist in db
                    {title:result.title}, //looking for matching article title and summary (because sometimes BBC changes title)
                    result,
                    {upsert:true}
                )
                .then(function(dbArticle) {
                    // View the added result in the console
                    console.log(dbArticle);
                    res.redirect("/");
                })
                .catch(function(err) {
                    // If an error occurred, send it to the client
                    return res.json(err);
                });
            })
        })
    })
    // ======saving(updating) articles==============
    app.post("/saveArticle/:id", function(req, res){
        var articleId = req.params.id;
        db.Article.findOneAndUpdate({_id:articleId}, {saved: true})
        .then(function(savedArticle){
            console.log(savedArticle);
        })
    })
    //==========deleting(updating) articles=======
    app.post("/delete/:articleId", function(req, res){
        var articleId = req.params.articleId;
        db.Article.findOneAndUpdate({_id:articleId}, {saved: false})
        .then(function(updatedArticle){
            console.log("successfully updated");
            res.json(updatedArticle);
        })
    })
    //=========saved articles page==========
    app.get("/myarticles", function(req, res){
        // pulling all articles that have propert "saved" set to true

        db.Article.find({saved:true}).then(function(dbArticle){
            console.log("dbArticle!!!!!!!!" + dbArticle.length);
            if(dbArticle.length>0){
                console.log("found "+dbArticle.length+"results");
                // creating an object to pass it to index handlebar
                var hbsObject = {
                    articles: dbArticle
                };
                res.render("saved", hbsObject);
            }else{
                res.render("saved");
                console.log("You have 0 saved articles");
            }
        })
        .catch(function(err){
        // in case of error
        res.json(err);
        })
    })
    app.get("/myarticles/:articleId", function(req, res){
        var articleId = req.params.articleId;
        // populating the Article with note
        db.Article.findOne({_id:articleId})
        .populate("note")
        .then(function(dbArticle){
            res.json(dbArticle);
        }).catch(function(err){
            res.json(err);
        })
    })
    // =========save new note============
    app.post("/addnote/:articleid", function(req, res){
        var articleId = req.params.articleid;

        db.Note.create(req.body).then(function(dbNote){

            // before we update note in article,  we are deleting old note from db as we don't need it anymore
            // db.Article.findOne({_id:articleId}).then(function(result){
            //     db.Note.remove({_id:result.note._id});
            // }).then(function(results){
            //     console.log("successfully removed old note");
            // }).catch(function(err){
            //     console.log(err);
            // })

            // when note is saved successfully, we need to find an article
            //and associate it with note by adding note id
            //{new:true} will return an updated Article, as mongoose query returns original one (before changes) by default
            return db.Article.findOneAndUpdate({_id:articleId}, {note: dbNote._id}, {new:true});

        }).then(function(data){
            return db.Article.findOne({_id:articleId}, {new: true}).populate("note");
        }).then(function(dbArticle){
            res.json(dbArticle);
        }).catch(function(err){
            res.json(err);
        })
    })
    //=============delete note==============
    app.post("/deleteNote/:noteId", function(req, res){
        var noteId = req.params.noteId;
        //deleting note document
        db.Note.findOneAndRemove({_id:noteId}).then(function(data){
            res.json(data);
            console.log("note was deleted successfully");
        })
    })

}