$(document).on("click", "#scrapeButton", function () {
    $.ajax({
        method: "GET",
        url: "/scrape",
    })
        .then(function (data) {
            window.location = "/";
        })
});


var articleId
$(document).on("click", "#commentButton", function () {
    var article = $(this).attr("data-id");
    var thisarticle = article;
    $("#commentModal").show();
    articleId = thisarticle

});

var commentSent = false;
// When you click the savecomment button
$(document).on("click", "#saveButton", function () {
    console.log("Comment: "+articleId);
       // Run a POST request to change the note, using what's entered in the inputs
    
       if (!commentSent){
           commentSent = true;
        $.ajax({
            method: "POST",
            url: "/articles/" + articleId,
            data: {
                comment: $("#comment").val()
            }
        })
            // With that done
            .then(function (data) {
                // Log the response
                console.log(data);
                // Empty the notes section
                $("#comment").empty();
            });
    
      $("#commentModal").hide();
       }
       else{
        commentSent =false;
       }
   
    
});
