# Contributions

## Sahar 

## M1: Proposal Plan

Organized the overview for the project

Created Git Page and added the remaining Team Members into the project

Created Issues to be worked on throughout the project

## M2: Express REST API

For M2, I set up the API project so it runs on port 4000. I wrote the error handling so that every error reply looks the same. I added the checks for bad data so that the API replies with a 400 that says which part is wrong. I also built the comments part which can show all comments, show one comment, add a comment, change a comment and delete a comment. I tested each one in the browser and with curl. I also wrote the api/README.md, which explains how to run the API and how to test the comments routes.

## M3: Next.js Frontend

I set up the web app and added the rewrite that sends /api requests to the Express API. I also made the layout with the header links. I built the search page and the show detail page and both of these pages get their data from our Express API. I also added the episode list to the API's show details route so that the detail page can show the episodes and their air dates.

## Misha

## M1: Proposal Plan

Added api, docs and web folders

Added CONTRIBUTIONS and README files for folders

Brainstormed on the Databse Design of the Project for MongoDB

## M2: Express REST API

For M2, I was responsible in creating a watchlist feature. I created both watchlist.js router and watchlistlogic.js controller that is responsible in listing items, searching one item, adding new items, updating them and removing them. I also added validation so API returns 400 message if we receive wrong information. 

## M3: Next.js Frontend

For M3, I worked on the Watchlist portion of the frontend. I created a Watchlist Page where a user can add the show or a movie they would like to watch. I also created an edit section where a user can edit their current list if they had made a mistake somewhere and it allows them to change rating, status or the name using TVMazeID. Additionally I added loading.js and error.js so a person can see a loading state when the data is being fetched and giving an error message of API is not working. 

## Randy

## M1: Proposal Plan

Brainstormed on the API Deisgn and TVmaze

Researched on Error Handling

## M3: Next.js Frontend

For M3, I built the comments part of the frontend. I put all of it in its own component, web/app/components/CommentsSection.js, so the show detail page only needed one line added to it. The section lists the comments for that show, has a form to add one, and a delete button on each comment. I also made an all comments page at /comments and an edit page at /comments/[id]/edit, which sends you back to the show page after you save so you can see the change. Both forms turn the submit button off while they are sending, and when the API answers with a 400 the message is printed right under the text box. I added a React Context in web/app/components/MessageContext.js with a green bar in the layout, so a message like "Comment added" is still on screen after you move to another page.

