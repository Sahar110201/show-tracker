# Show Tracker

## Overview (Sahar)

Show Tracker is a web application that allows people to keep a track of what shows they have watched, left unfinished or still on their watch list. The users can build their own watchlist, mark each show as plan to watch, currently watching, finished to dropped. They are also able to log the numbers of episodes they have watch and even rate the shows. All this data will be stored in our own MangoDB database. Our express server will call to the free TVmaze API to get the show details, number of episode lists and their air date. 

## Core Features (Sahar)
 
- Search for TV Shows (data will come from TVmaze API)
- Add or remove a show to or from watchlist.
- Add shows to different tabs such as planned to watch, currently watching, finished or dropped.
- Log the no. of episodes they have watched for a particular show.
- Rate a show and add comments under the shows details.
- See episode list and the air date of the shows. 
- Separate Search page to find shows.
- Sorting the shows based on rating. 

## Database Design (Misha)

- Create Data for shows pulled from TVmaze for easy access
- Provide User Activity to keep track of everything the user watches
- Create an episode track to show the episode list and their release dates  

## API Design and TVmaze (Randy)
