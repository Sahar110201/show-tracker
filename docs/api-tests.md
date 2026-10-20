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