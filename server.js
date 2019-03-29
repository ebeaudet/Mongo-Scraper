// Dependencies
var Article = require("./models/Article.js")
var Comment = require("./models/Comments.js")
var express = require("express");
var mongoose = require("mongoose");
var exphbs = require("express-handlebars");
// Require axios and cheerio. This makes the scraping possible
var axios = require("axios");
var cheerio = require("cheerio");



// Initialize Express
var app = express();

app.use(express.static("public"));

var PORT = process.env.PORT || 8000;


// Use body parser with the app
app.use(express.urlencoded({
  extended: false
}));

// Initialize Handlebars
app.engine("handlebars", exphbs({ defaultLayout: "main" }));
app.set("view engine", "handlebars");


var MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost/ArticleSchema"
mongoose.connect(MONGODB_URI);

app.get("/", function (req, res) {

  Article.find({})
    .then(function (Article) {
   
      var articleObject = {
        article: Article
      }
      res.render("index", articleObject);

    })
    .catch(function (err) {
      res.json(err);

    });


//     Comment.find({}) 
//     .then(function (Comment) {

//       var commentObject = {
//         comment: Comment
//       }
//       res.render("index", commentObject);
//     })
//     .catch(function (err) {
//       res.json(err);
    

// });
});
app.get("/scrape", function (req, res) {
  //   res.render("scrape", { layout: "main" });
   // Routes

  // app.get("/scrape", function(req, res) {
  // First, we grab the body of the html with axios
  axios.get("https://loudwire.com/").then(function (response) {
    // Then, we load that into cheerio and save it to $ for a shorthand selector
    var $ = cheerio.load(response.data);

    // Now, we grab every headline title within an article tag, and do the following:
    $("article").each(function (i, element) {
      var result = {};
      var title = $(element).children("div").children("a").attr("title")
      var link = $(element).children("div").children("a").attr("href")
      var summary = $(element).children("div").children("div.excerpt").html()

      result.title = title
      result.link = link
      result.summary = summary

      let newArticle = new Article(result)

      newArticle.save().then(() => {
      })
        .catch(err => {
          console.log(err)
        })
    });
    res.send("Scrape Complete");
  });
});

app.get("/articles", function (req, res) {

  Article.find({})
    .then(function (Article) {

      var articleObject = {
        article: Article
      }
      res.render("index", articleObject);

    })
    .catch(function (err) {
      res.json(err);

    });
});


app.post("/articles/:id", function (req, res) {
  Comment.findOneAndUpdate(req.body,req.body,{new:true})
    .then(function (dbComment) {

      return Article.findOneAndUpdate({_id:req.params.id},  {$push: { comment: dbComment._id } }, { new: false })

    })
    .then(function(dbArticle) {
      res.json(dbArticle);
    })
    .catch(function (err) {
      res.json(err);
    });
});

// Listen on port 8000
app.listen(PORT, function () {
  console.log("App running on port 8000!");
});
