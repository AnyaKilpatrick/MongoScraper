// Parallax
$(document).ready(function(){
    $('.parallax').parallax();
});

$("#scrape").on("click", function(){
    $.get("/scrape", function(data){
        console.log("DATA"+data.length);
        console.log("Scraped articles");
    })
})
      