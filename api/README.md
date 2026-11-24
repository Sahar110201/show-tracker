# Express API for CPAN 212 Group 7

## How to run

```
cd api
npm install
npm run dev
```

The server runs on http://localhost:4000.

## Environment variables

| Variable | Default | Description |
|---|---|---|
| PORT | 4000 | Port the server listens on |

## Endpoints

| Method | Path | Description |
|---|---|---|
| GET | /api/comments | List all comments. `?tvmazeId=` or `?watchlistItem=` narrows the list down |
| GET | /api/comments/:id | Get one comment **with its watchlist item included** (populate) |
| POST | /api/comments | Create a comment |
| PUT | /api/comments/:id | Update a comment |
| DELETE | /api/comments/:id | Delete a comment |
| GET | /api/watchlist | This will show all watchlist items |
| GET | /api/watchlist/:id | This will show on specific watchlist item |
| POST | /api/watchlist | This will add new item to our watchlist |
| PUT | /api/watchlist/:id | This will update our watchlist |
| DELETE | /api/watchlist/:id | This will delete a watchlist item |
| GET | /api/shows/search | search through TVMaze |
| GET | /api/shows/:id | Returns a show by its ID with its episodes (id, season, number, name, airedate) |

Change from M1: comments now have all five routes (M1 only listed add and get).

Change from M3: comments are stored in MongoDB instead of an array, so they no
longer disappear when the server restarts. Every comment is linked to a watchlist
item, and `GET /api/comments/:id` sends the linked item back with the comment.

## The comments model

A comment is stored in the `comments` collection with these fields:

| Field | Type | Rules |
|---|---|---|
| watchlistItem | ObjectId, links to a WatchlistItem | Empty when the show is not on the watchlist |
| tvmazeId | Number | Required, a whole number, 1 or more |
| text | String | Required, trimmed, 1 to 500 characters |
| createdAt, updatedAt | Date | Added automatically |

`watchlistItem` is the link between the two collections. The comment form on the
show page only knows the TVmaze id, so the API looks up the watchlist item with
that `tvmazeId` and links the comment to it. A show that has not been added to
the watchlist yet still accepts comments, and its `watchlistItem` stays `null`.

## Testing

### Comments

Run `npm run seed` first so there are comments to work with, then start the
server and run these in a second terminal.

Replace `<comment-id>` with an id from the list request. The ids are MongoDB
ObjectIds now, so they look like `6b0511b6b7fede83b3b3c50a`.

On Mac or Linux use `curl` and the commands exactly as written. On Windows
PowerShell use `curl.exe` and put a backslash before every double quote inside
the `-d` body, like `-d '{\"tvmazeId\": 169, \"text\": \"New comment\"}'`,
otherwise PowerShell removes the quotes and the API answers 400.

List comments (200). The link is just the id here:
```
curl -i http://localhost:4000/api/comments
```

Only one show's comments (200). This is what the comments section on the show
page uses, so the browser no longer has to filter the whole list itself:
```
curl -i "http://localhost:4000/api/comments?tvmazeId=54198"
```

Only one watchlist item's comments (200):
```
curl -i "http://localhost:4000/api/comments?watchlistItem=<watchlist-item-id>"
```

Bad filter value (400). Both filters are checked before the database is asked:
```
curl -i "http://localhost:4000/api/comments?tvmazeId=abc"
curl -i "http://localhost:4000/api/comments?watchlistItem=nope"
```

**Get one comment with its watchlist item (200).** This is the populate route:
`watchlistItem` comes back as the whole item instead of just its id, so the edit
page gets the comment and the show it is about from this one request:
```
curl -i http://localhost:4000/api/comments/<comment-id>
```
```json
{
  "id": "6b0511b6b7fede83b3b3c50a",
  "watchlistItem": {
    "id": "6b0511b6b7fede83b3b3c4ee",
    "tvmazeId": 54198,
    "name": "The Bear",
    "status": "watching",
    "episodesWatched": 4,
    "rating": 4
  },
  "tvmazeId": 54198,
  "text": "Season 1 is stressful in the best way.",
  "createdAt": "2026-11-24T04:25:26.756Z",
  "updatedAt": "2026-11-24T04:25:26.756Z"
}
```

Create a comment (201). 169 is Breaking Bad, which the seed puts on the
watchlist, so the comment is linked to it automatically:
```
curl -i -X POST http://localhost:4000/api/comments -H "Content-Type: application/json" -d '{"tvmazeId": 169, "text": "New comment"}'
```

Create a comment on a show that is not on the watchlist (201). It still works
and `watchlistItem` comes back as `null`:
```
curl -i -X POST http://localhost:4000/api/comments -H "Content-Type: application/json" -d '{"tvmazeId": 9999, "text": "Not on my watchlist"}'
```

Create a comment and pick the watchlist item yourself (201):
```
curl -i -X POST http://localhost:4000/api/comments -H "Content-Type: application/json" -d '{"tvmazeId": 169, "text": "Linked on purpose", "watchlistItem": "<watchlist-item-id>"}'
```

Update a comment (200):
```
curl -i -X PUT http://localhost:4000/api/comments/<comment-id> -H "Content-Type: application/json" -d '{"tvmazeId": 169, "text": "Changed comment"}'
```

Delete a comment (204):
```
curl -i -X DELETE http://localhost:4000/api/comments/<comment-id>
```

Validation failure (400). The rules live in the model now, so the reply names
every field that is wrong. This is what the forms print under the text box:
```
curl -i -X POST http://localhost:4000/api/comments -H "Content-Type: application/json" -d '{}'
```
```json
{
  "error": {
    "message": "Validation failed",
    "details": {
      "tvmazeId": "TVMaze ID is required",
      "text": "Comment text is required"
    }
  }
}
```

Empty text (400). Spaces are trimmed off first, so `"   "` counts as empty:
```
curl -i -X POST http://localhost:4000/api/comments -H "Content-Type: application/json" -d '{"tvmazeId": 169, "text": "   "}'
curl -i -X PUT http://localhost:4000/api/comments/<comment-id> -H "Content-Type: application/json" -d '{"tvmazeId": 169, "text": "   "}'
```

Body is not valid JSON (400):
```
curl -i -X POST http://localhost:4000/api/comments -H "Content-Type: application/json" -d '{bad json}'
```

Unknown id (404). A badly formed id can never match a document, so it is a 404
and not a 400, and the database is not asked at all:
```
curl -i http://localhost:4000/api/comments/not-a-real-id
curl -i http://localhost:4000/api/comments/000000000000000000000000
curl -i -X DELETE http://localhost:4000/api/comments/not-a-real-id
```

Unknown watchlist item on create (404):
```
curl -i -X POST http://localhost:4000/api/comments -H "Content-Type: application/json" -d '{"tvmazeId": 169, "text": "hi", "watchlistItem": "000000000000000000000000"}'
```

### Watchlist

List Shows (200):
```
curl -i http://localhost:4000/api/watchlist
```

Get one show displaying (200):
```
curl -i http://localhost:4000/api/watchlist/<id>
```

Create a watchlist item (201):
```
curl -i -X POST http://localhost:4000/api/watchlist \ -H "Content-Type: application/json" \ -d '{"tvmazeId": 169, "status": "watching", "rating": 5}'
```

Update the watchlist (200):
```
curl -i -X PUT http://localhost:4000/api/shows/<ID> \ -H "Content-Type: application/json" \ -d '{"tvmazeId": 169, "name": "Updated Show"}'
```

Delete a show (204):
```
curl -i -X DELETE http://localhost:4000/api/watchlist/<id>
```

Validation failure (400):
```
curl -i -X POST http://localhost:4000/api/shows \ -H "Content-Type: application/json" \ -d '{"tvmazeId": "not-a-number", "name": ""}'
```

Unknown id (404):
```
curl -i http://localhost:4000/api/watchlist/<id>
```

### TVmaze

# Shows API Tests

Start the server first (from the `api` folder), then run these in a second terminal.
The server runs on port 4000. On Windows PowerShell use `curl.exe`. On Mac or Linux use `curl`.

## Search route: GET /api/shows/search?q=

| # | What it tests | Command | Expected |
|---|---|---|---|
| 1 | Search works | `curl.exe -i "http://localhost:4000/api/shows/search?q=girls"` | 200 |
| 2 | Missing q | `curl.exe -i "http://localhost:4000/api/shows/search"` | 400 |
| 3 | Empty q | `curl.exe -i "http://localhost:4000/api/shows/search?q="` | 400 |

## Details route: GET /api/shows/:id

| # | What it tests | Command | Expected |
|---|---|---|---|
| 4 | Real show id | `curl.exe -i "http://localhost:4000/api/shows/139"` | 200 |
| 5 | Unknown show id | `curl.exe -i "http://localhost:4000/api/shows/99999999"` | 404 |
| 6 | Id is not a number | `curl.exe -i "http://localhost:4000/api/shows/abc"` | 404 |

The 200 response for a real id also includes an `episodes` list. Each episode has an `id`, `season`, `number`, `name` and `airdate`.

## Cache test

Run the same command twice:

```
curl.exe -i "http://localhost:4000/api/shows/139"
```

Both give 200. The second time, the server terminal prints `Cache hit: show:139`.

## Timeout and error tests (TVmaze problems)

Change one value in `api/src/services/tvmaze.js`, save, run the command, then change it back.
Use a search word you have not used yet, because used words come from the cache.

| # | What it tests | Change | Command | Expected |
|---|---|---|---|---|
| 7 | TVmaze too slow | `TIMEOUT_MS = 1` | `curl.exe -i "http://localhost:4000/api/shows/search?q=office"` | 504 |
| 8 | TVmaze broken | `TVMAZE = "https://api.tvmaze.com.fake"` | `curl.exe -i "http://localhost:4000/api/shows/search?q=friends"` | 502 |

## Database setup (MongoDB)

The API stores its data in MongoDB with Mongoose.

1. Create a free MongoDB Atlas cluster, a database user, and add your current IP address to the Network Access list.
2. Copy `api/.env.example` to `api/.env`.
3. Put your own connection string in `MONGODB_URI`. Include a database name after `.mongodb.net/`, for example `show_tracker`. Never commit `.env`.
4. Run `npm install`, then `npm run dev`. The API prints `Connected to MongoDB` before it starts listening. If `MONGODB_URI` is missing, it stops with a clear message.

| Variable | Description |
|---|---|
| PORT | Port the server listens on (default 4000) |
| MONGODB_URI | Your MongoDB connection string |

## Seed data

```
cd api
npm run seed
```

This deletes and re-creates the sample data for every model, with 28 watchlist items and a few comments. Run it again any time to reset the data. It is a script, not a route, so nobody can reset the data through the API.

## Watchlist list endpoint: query parameters

`GET /api/watchlist` accepts these query parameters:

| Parameter | Default | Rules |
|---|---|---|
| status | all | One of `plan_to_watch`, `watching`, `finished`, `dropped` |
| sort | name | `name`, `status`, `rating` or `episodesWatched`. Any other field gets a 400. Only lowest to highest, there is no `-` to reverse it |
| page | 1 | A whole number, 1 or more |
| limit | 10 | A whole number, 1 or more. Anything over 20 is treated as 20 |

The response is `{ items, total, pages }`. A bad parameter gets a 400.

The watchlist page uses these three for its status filter, its sort dropdown and
its Previous and Next buttons, and keeps them in the address so a reload shows
the same page:

```
curl -i "http://localhost:4000/api/watchlist?status=watching&sort=name&page=1"
curl -i "http://localhost:4000/api/watchlist?status=finished&sort=episodesWatched&page=1"
curl -i "http://localhost:4000/api/watchlist?sort=rating&page=3"
```

A page past the last one is not an error. It answers 200 with an empty `items`
list, and `total` and `pages` still tell you where the end is:
```
curl -i "http://localhost:4000/api/watchlist?page=99"
```

A sort field that is not in the list (400):
```
curl -i "http://localhost:4000/api/watchlist?sort=bogus"
```
