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

(TVmaze part: add curl commands for the TVmaze route, each with its status code)
