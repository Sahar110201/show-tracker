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
| GET | /api/comments | List all comments |
| GET | /api/comments/:id | Get one comment |
| POST | /api/comments | Create a comment |
| PUT | /api/comments/:id | Update a comment |
| DELETE | /api/comments/:id | Delete a comment |
| GET | /api/watchlist | This will show all watchlist items |
| GET | /api/watchlist/:id | This will show on specific watchlist item |
| POST | /api/watchlist | This will add new item to our watchlist |
| PUT | /api/watchlist/:id | This will update our watchlist |
| DELTE | /api/watchlist/:id | This will delete a watchlist item |
| (TVmaze stuff goes here) | | |

Change from M1: comments now have all five routes (M1 only listed add and get).

## Testing

### Comments

Replace `<comment-id>` with an id from the list request.

List comments (200):
```
curl -i http://localhost:4000/api/comments
```

Get one comment (200):
```
curl -i http://localhost:4000/api/comments/<comment-id>
```

Create a comment (201):
```
curl -i -X POST http://localhost:4000/api/comments -H "Content-Type: application/json" -d '{"tvmazeId": 169, "text": "New comment"}'
```

Update a comment (200):
```
curl -i -X PUT http://localhost:4000/api/comments/<comment-id> -H "Content-Type: application/json" -d '{"tvmazeId": 169, "text": "Changed comment"}'
```

Delete a comment (204):
```
curl -i -X DELETE http://localhost:4000/api/comments/<comment-id>
```

Validation failure (400):
```
curl -i -X POST http://localhost:4000/api/comments -H "Content-Type: application/json" -d
```

Unknown id (404):
```
curl -i http://localhost:4000/api/comments/not-a-real-id
```

### Watchlist

List Shows (200):
```
curl -i http://localhost:4000/api/shows
```

Get one show displaying (200):
```
curl -i http://localhost:4000/api/shows/<ID>
```

Create a watchlist item (201):
```
curl -i -X POST http://localhost:4000/api/shows \ -H "Content-Type: application/json" \ -d '{"tvmazeId": 169, "name": "Example Show"}'
```

Update the watchlist (200):
```
curl -i -X PUT http://localhost:4000/api/shows/<ID> \ -H "Content-Type: application/json" \ -d '{"tvmazeId": 169, "name": "Updated Show"}'
```

Delete a show (204):
```
curl -i -X DELETE http://localhost:4000/api/shows/<ID>
```

Validation failure (400):
```
curl -i -X POST http://localhost:4000/api/shows \ -H "Content-Type: application/json" \ -d '{"tvmazeId": "not-a-number", "name": ""}'
```

Unknown id (404):
```
curl -i http://localhost:4000/api/comments/not-a-real-id
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
