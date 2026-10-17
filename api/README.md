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
| (watchlist stuff goes here) | | |
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

Unknown id (404):
```
curl -i http://localhost:4000/api/comments/not-a-real-id
```

### Watchlist

(watchlist part: add one curl command for every watchlist route, each with its status code)

### TVmaze

(TVmaze part: add curl commands for the TVmaze route, each with its status code)