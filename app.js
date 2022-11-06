const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const ejs = require("ejs");

const app = express();
app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

mongoose.connect("mongodb://localhost:27017/wikiDB");

const articleSchema = new mongoose.Schema({
  title: String,
  content: String,
});

const Article = new mongoose.model("Article", articleSchema);

///////////////////////////Request for ALL articles///////////////////

app.route("/articles")
  .get(function (req, res) {
    Article.find({}, function (err, foundArticles) {
      if (!err) {
        res.send(foundArticles);
      } else {
        res.send(err);
      }
    });
  })
  .post(function (req, res) {
    const articleTitle = req.body.title;
    const articleContent = req.body.content;

    const newArticle = new Article({
      title: articleTitle,
      content: articleContent,
    });
    newArticle.save((err) => {
      if (!err) {
        res.send("Successfully added new article");
      } else {
        res.send(err);
      }
    });
  })
  .delete(function (req, res) {
    Article.deleteMany({}, function (err) {
      if (!err) {
        res.send("All articles are deleted");
      } else {
        res.send(err);
      }
    });
  });
//////////////////////Request for a specific article//////////////
  app.route("/articles/:articleTitle")
  .get(function(req,res){
    const getArticle = req.params.articleTitle
    Article.findOne({title:getArticle}, function(err,foundArticle){
      if(foundArticle){
        res.send(foundArticle)
      } else {
        res.send("No article found!")
      }
    })
  })
  .put(function(req, res){
    Article.replaceOne(
      {title: req.params.articleTitle},
      {title:req.body.title, content:req.body.content},
      function(err){
        if(!err){
          res.send('Successfully updated title and content!')
        }
      }
    )
  })

  .patch(function(req,res){
    Article.updateOne(
      {title:req.params.articleTitle},
      {$set: req.body},
      function(err){
        if(!err){
          res.send("Successfully updated")
        }else {
          res.send(err)
        }
      }
    )
  })

app.listen(3100, () => {
  console.log("Server started on port 3100");
});
