// Parallax
$(document).ready(function(){
    $('.parallax').parallax();
});
// scraping data from BBC
$("#scrape").on("click", function(){
    $.get("/scrape", function(data){
        console.log("DATA"+data.length);
        console.log("Scraped articles");
        location.reload();
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
// deleting article from "Saved Articles" page
$(".deleteArticle").on("click", function(){
    var articleId = $(this).data("id");
    $.ajax({
        method:"POST",
        url: "/delete/"+articleId
    }).then(function(data){
        location.reload();
    })
})


// display notes when user reveals a card's hidden info
$(".activator").on("click", function(){
    var artId = $(this).data("id");
    $.get("/myarticles/"+artId, function(data){
        //if article has a note, display it on card
        if(data.note){
            $("#noteHolder"+data._id).empty(); //emptying div before appending
            $("#noteHolder"+data._id).append(`
            <p>${data.note.text} 
                <a id="${data.note._id}" data-id="${data._id}" class="waves-effect waves-light btn right navBtns deleteNote">
                    Delete
                </a>
            </p>
            `)
        }
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
        <p>${data.note.text} 
            <a id="${data.note._id}" data-id="${data._id}" class="waves-effect waves-light btn right navBtns deleteNote">
                Delete
            </a>
        </p>
        `)
    })
})

// delete note
$(".deleteNote").on("click", function(){
    console.log("works!");
    var noteId=$(this).attr("id");
    var articleId=$(this).data("id"); //data-id contains article id so we can define which div to empty right after deleting

    $.ajax({
        method:"POST",
        url:"/deleteNote/"+noteId
    }).then(function(data){
        console.log(data);
        //$("#noteHolder"+articleId).empty(); //emptying div
    })
})


