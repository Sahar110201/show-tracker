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

# M4: MongoDB persistence

For M4 I connected the API to MongoDB with Mongoose. I wrote `db.js` which turns on `sanitizeFilter`and stops with a clear message if `MONGODB_URI` is missing and connects before the server even starts listening. I also added `MONGODB_URI` with a fake value to `.env.example`. I also updated the error handler so Mongoose validation errors and bad values give a 400 with field details and I also wrote a `findById` helper so a badly formed id or a missing document can give a 404. I also made the shared `toJSON` options that rename `_id` to `id` so the frontend keeps working, and I updated `formErrors.js` so the forms show the field errors from the API. I also wrote the seed script and Readme. 

## Misha

## M1: Proposal Plan

Added api, docs and web folders

Added CONTRIBUTIONS and README files for folders

Brainstormed on the Databse Design of the Project for MongoDB

## M2: Express REST API

For M2, I was responsible in creating a watchlist feature. I created both watchlist.js router and watchlistlogic.js controller that is responsible in listing items, searching one item, adding new items, updating them and removing them. I also added validation so API returns 400 message if we receive wrong information. 

## M3: Next.js Frontend

For M3, I worked on the Watchlist portion of the frontend. I created a Watchlist Page where a user can add the show or a movie they would like to watch. I also created an edit section where a user can edit their current list if they had made a mistake somewhere and it allows them to change rating, status or the name using TVMazeID. Additionally I added loading.js and error.js so a person can see a loading state when the data is being fetched and giving an error message of API not working. 

## Randy

## M1: Proposal Plan

Brainstormed on the API Deisgn and TVmaze

Researched on Error Handling

## M3: Next.js Frontend

For M3, I built the comments part of the frontend. I put all of it in its own component, web/app/components/CommentsSection.js, so the show detail page only needed one line added to it. The section lists the comments for that show, has a form to add one, and a delete button on each comment. I also made an all comments page at /comments and an edit page at /comments/[id]/edit, which sends you back to the show page after you save so you can see the change. Both forms turn the submit button off while they are sending, and when the API answers with a 400 the message is printed right under the text box. I added a React Context in web/app/components/MessageContext.js with a green bar in the layout, so a message like "Comment added" is still on screen after you move to another page.

## M4: MongoDB persistence

For M4 I moved the comments from the array they were kept in over to MongoDB, and I added the filter, sort and paging controls to the watchlist page.

I wrote the comments model in api/src/models/Comment.js. A comment has the text, the tvmazeId and a watchlistItem field, which is the link to a watchlist item. I put all the checks in the model itself instead of the zod schema the controller used before, so the text has to be 1 to 500 characters after the spaces are trimmed off and the tvmazeId has to be a whole number of 1 or more. Sahar's error handler already turns a Mongoose validation error into a 400 with one message per field, which is the same shape the forms were already reading, so the messages still show up under the text box without me changing the forms.

Then I rewrote api/src/controllers/comments.js so all five routes use the database. The link is worked out by the API: the comment form on the show page only knows the TVmaze id, so the controller looks for the watchlist item with that tvmazeId and links the comment to it. A show you have not added to your watchlist yet can still be commented on, and its link is just left empty, so commenting still works on any show you find through search. GET /api/comments/:id is the populate route, which uses populate() to send the whole watchlist item back with the comment instead of only its id, so the edit page can show "On your watchlist as The Bear, watching, 4 episodes watched" without a second request. I also added ?tvmazeId= and ?watchlistItem= to the list route, so the comments section asks for only the comments it needs instead of downloading every comment and filtering them in the browser. For the 404s I reused Sahar's findById helper, which I gave an extra argument so it can populate as well, and which means a badly formed id answers 404 without the database being asked.

On the frontend I rebuilt web/app/watchlist/page.js. It now has a status dropdown, a sort dropdown and Previous and Next buttons. They all work through the address, for example /watchlist?status=watching&sort=rating&page=2, so reloading the page, pressing the back button or sending someone the link all give the same view. The two dropdowns are a plain form like the one on the search page, so there is no client side JavaScript needed, and picking a new filter sends you back to page 1. Previous and Next are links that carry the status and sort along with them, and they turn into plain grey text on the first and last page. The page also says how many shows matched and which page you are on. I made sure a hand typed address cannot break the page: anything the API would reject, like ?sort=bogus or ?page=-5, falls back to the default instead of showing the error screen.

I tested all of it with curl and in the browser, and wrote the comments tests, the model description and the corrected watchlist query parameter table into api/README.md.

