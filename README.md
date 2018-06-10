# MongoScraper
# BBC News | Travel

# All the News That's Fit to Scrape

MongoScraper is a web app that lets users view and leave comments on the latest news. Mongoose and Cheerio are used to scrape news from BBC Travel channel.

npm packages: express, express-handlebars, mongoose, body-parser, cheerio, request.

App is deployed through Heroku with set up mLav provision. mLab is a remote MongoDB database that Heroku supports natively. 

# Overview

  1. Whenever a user visits a site, the app displays the articles stored in db, and the button "Latest News" scrapes BBC travel news and updates MongoDB in case of new articles added. 
  
  App scrapes and displays the following information for each article:

     * Headline - the title of the article

     * Summary - a short summary of the article

     * URL - the url to the original article

     * Img URL - to display an image related to article

  2. Users are always able to save articles they were interested in. They will be displayed on page "My Articles". Also user can leave comments on saved articles and revisit them later. The comments are saved to the database as well and associated with their articles. Users can delete or update comments left on articles. All stored comments are visible to every user.
