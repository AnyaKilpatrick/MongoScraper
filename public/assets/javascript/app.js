// Parallax
$(document).ready(function(){
    $('.parallax').parallax();
});

$("#scrape").on("click", function(){
    $.get("/scrape", function(data){
        console.log("DATA"+data.length);
        console.log("Scraped articles");
        location.reload();
    })
})
$(".activator").on("click", function(){
    var artId = $(this).data("id");
    $.get("/myarticles/"+artId, function(data){
        console.log("Article with note"+JSON.stringify(data));
        $("#noteHolder"+data._id).empty(); //emptying div before appending
        $("#noteHolder"+data._id).append(`
        <p>${data.note.text} <a href="#" data-id="${data.note._id}" class="waves-effect waves-light btn right navBtns">Delete</a></p>
        `)
    })
})
//saving article(by setting property "saved" to true in db)
$(".saveArticle").on("click", function(){
    var articleId = $(this).data("id");
    console.log(articleId);
    $.post("/saveArticle/"+articleId, function(data){
        console.log("saved article "+ data);  
    })
})
// adding note
$(".addNote").on("click", function(){   
    var articleId=$(this).data("id");
    // taking a value from title input
    var note =$("#noteFor"+articleId).val().trim();

    $.ajax({
        method:"POST",
        url:"/addnote/"+articleId,
        data: {
            text: note
        }
    }).then(function(data){
        // empty notes section
        $("#noteFor"+articleId).val("");
        $("#noteHolder"+data._id).empty(); //emptying div before appending
        $("#noteHolder"+data._id).append(`
        <p>${data.note.text} <a href="#" data-id="${data.note._id}" class="waves-effect waves-light btn right navBtns">Delete</a></p>
        `)
    })
})
