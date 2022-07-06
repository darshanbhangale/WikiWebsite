const express=require("express");
const bodyParser=require("body-parser");
const ejs=require("ejs");
const mongoose=require("mongoose");
const app=express();
app.set("view engine","ejs");
app.use(bodyParser.urlencoded({
    extended:true
}));
app.use(express.static("public"));
mongoose.connect("mongodb://localhost:27017/wikiDB");
const articleSchema=new mongoose.Schema({
    name:String,
    content:String
});
const Article = mongoose.model("Article",articleSchema);

app.route("/articles")//get
.get(function(req,res){
    Article.find(function(err,foundArticles){
        // console.log(foundArticles);
        res.send(foundArticles);
    });
})//post
.post(function(req,res){
    console.log(req.body.title);
    console.log(req.body.content);
    const newArticle=new Article({
        title:req.body.title,
        content:req.body.content
    });
    newArticle.save(function(err){
        // This is for postman
        if(!err){res.send("Successfully added");}
        else{
            res.send(err);
        }
    });
})//delete
.delete(function(req,res){
    Article.deleteMany(function(err){
        if(!err){
            res.send("sucessful");
        }
        else{
            res.send(err);
        }
    });
});


app.route("/articles/:articleTitle")

.get(function(req, res){
  console.log(req.params.articleTitle);
  
  Article.findOne({title: req.params.articleTitle}, function(err, foundArticle){
    console.log(foundArticle);
    console.log(foundArticle.title);
    if (foundArticle) {
      res.send(foundArticle.body);
    } else {
      res.send("No articles matching that title was found.");
    }
  });
})

.put(function(req, res){

  Article.update(
    {title: req.params.articleTitle},
    {title: req.body.title, content: req.body.content},
    {overwrite: true},
    function(err){
      if(!err){
        res.send("Successfully updated the selected article.");
      }
    }
  );
})

.patch(function(req, res){

  Article.update(
    {title: req.params.articleTitle},
    {$set: req.body},
    function(err){
      if(!err){
        res.send("Successfully updated article.");
      } else {
        res.send(err);
      }
    }
  );
})

.delete(function(req, res){

  Article.deleteOne(
    {title: req.params.articleTitle},
    function(err){
      if (!err){
        res.send("Successfully deleted the corresponding article.");
      } else {
        res.send(err);
      }
    }
  );
});
// app.get();
// app.post("/articles",);
// app.delete("/articles",);
app.listen(3000,function(){
    console.log("connected to server 3000");
});