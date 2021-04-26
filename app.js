const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const _ =  require("lodash");
const app = express();

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));
app.set('view engine', 'ejs');

mongoose.connect("mongodb://localhost:27017/wikiDB", {useNewUrlParser: true});

const articleSchema = {
    title: String,
    content: String
};

const Article = mongoose.model("Article", articleSchema);

app.get("/articles", (req,res) => {
    Article.find({}, function(err, foundArticles){
        if (!err){
        res.send(foundArticles);
        } else {
            console.log(err);
        }
    });
});

app.post("/articles", (req,res) => {
   const newArticle = new Article ({
       title: req.body.title,
       content: req.body.content
   });
   newArticle.save(function(err){
       if (err){
            res.send(err);
       } else {
           res.send("Bing-o!")
       }
   });
});

app.delete("/articles", (req,res)=>{
    Article.deleteMany(function(err){
        if(err){
            res.send(err);
        } else{
            res.send("Deleted All.");
        }
    })
})
///////////////////

app.get("/articles/:articleTitle", (req,res) => {
    Article.findOne({title: req.params.articleTitle}, function(err, foundArticle){
        if(foundArticle){
            res.send(foundArticle)
        } else{
            res.send("No Article with that title was found");
        }
    });
});

app.put("/articles/:articleTitle", (req,res) => {
    Article.update(
        {title: req.params.articleTitle},
        {title: req.body.title, content: req.body.content},
        {overwrite: true},
        function(err){
            if(!err){
                res.send("Successfully Updated");
            } else{
                res.send(err);
            }
        }      
    )
});

app.patch("/articles/:articleTitle", (req,res) => {
    Article.update(
        {title: req.params.articleTitle},
        {$set: req.body},
        function(err){
            if(!err){
                res.send("Successfully Updated Selected Parts");
            } else{
                res.send(err);
            }
        }      
    );
});

app.delete("/articles/:articleTitle", (req,res)=>{
    Article.deleteOne(
        {title: req.params.articleTitle},        
        function(err){
        if(err){
            res.send(err);
        } else{
            res.send("Deleted One.");
        }
    });
});

app.listen(3000, function(){
    console.log("server started on PORT 3000");
});