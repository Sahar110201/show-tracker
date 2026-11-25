# Show Tracker

Welcome to CPAN 212 Group 7 Project:

Made by:

Sahar (Sahar110201)

Misha (KiPMaster127-code)

Randy (randyrampersaud1337)

## AI use

Sahar: I used Claude to help correct my code and debug the code for M2 and M3. Whenever I got stuck somewhere or I kept getting erorrs, I copy pasted my code into claude to ask for its help and see where I went wrong. For M4, I used claude and ChatGPT when I got stuck and should not connect the MangoDB properly. I also got stuck on a error handler code where I was not able to figure out where I was wrong and when I pasted that code onto Claude, it showed me a typo. Additionaly, the seed.js I was also stuck on that where I asked for Calude's help. 

Misha: I had to use Claude to debug my watchlistlogic.js when I would get errors and explain what some of the errors would mean in order to fix the problem. For M3, I used it to help me debug the wactchlist/page.js. For M4 I used ChatGPT to help me setup my MongoDB correctly, originally I've had problem connecting the project to Atlas and the seed would give out querrySrv error. 

Randy: Used Claude code with debugging /controller/show.js, /routes/shows.js, tvmaze.js, server,js  and implementing TVmaze API and used it help me with the file structure. For M4 I used Claude to explain how Mongoose populate() and the ref field work, because I was not sure why my watchlistItem field kept coming back as just an id. I also asked it why my comment validation messages were not reaching the form, and it pointed out that I had left the old zod check in the controller so the model rules were never being run. When I was building the filter and sort controls on the watchlist page I asked it how searchParams works in Next.js 16, since it is a promise now and has to be awaited, and I used it to check my understanding of why a plain form was a better fit there than a client component.

## Changes from the wireframes

Sahar

**Search page:** the results are shown as rows with the poster, rating, title, premiere date, genres, a short description, and a "View details" button, as in the wireframe. The episode count from the wireframe is not shown, because TVmaze's search results do not include the number of episodes.

**Show details page:** the episodes are grouped into collapsible seasons instead of one flat list because long shows have too many episodes for a single list. The rating shown in the page banner is TVmaze's rating out of 10 and the user's own rating out of 5 is set on the watchlist forms. The page also shows the show summary and the genres as tags which are not in the wireframe.

**Profile page:** the Profile page from the wireframes is not built in M3.

Misha

**Dashboard Page:** Currently the Watchlist Page displays the Status of the movie, TVMazeID and its rating, We also have a Edit feature where a user can edit their Watchlist as they are going along through their movie or a show.

## Individual Walkthroughs as The Dropbox was missing

Sahar - https://www.youtube.com/watch?v=aZtaCch7hKc

Misha - https://www.youtube.com/watch?v=B_P9sjuPF2g

Randy - https://www.youtube.com/watch?v=6onu_Y46Rj0

## M2 and M3 Demo Video

https://www.youtube.com/watch?v=oMgRrIuu0_I
