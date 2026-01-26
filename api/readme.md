# Cheatsheets: Backend

# Install instructions
Move to directory
```terminaloutput
cd /api/
```

Installation
```terminaloutput
npm install
```

Run dev
```terminaloutput
npm run dev
```

Run production
```terminaloutput
npm start
```


# Making API-calls in frontend
```javascript
const apiURL = "http://localhost:3030/api/";
const cheatsheetsURL = apiURL + "cheatsheets";
```

# Drizzle-Kit Studio
```terminaloutput
npx drizzle-kit studio
```

# Connect to mongoDB via Terminal
Start bash inside mongoDB
```terminaloutput
docker exec -t -i cheatsheet_mongo /bin/bash
```
Connect to database:
```terminaloutput
mongosh "mongodb://localhost:27017/cheatsheets" --apiVersion 1
```

Create collection
```terminaloutput
db.createCollection("cheatsheets")
```

Add example post
```terminaloutput
db.cheatsheets.insertOne({"id": "ac46a36a-a993-4053-9043-2a97bee089dc", "body": "# Vorlesung 1\nLorem ipsum\n\n- Liste\n- Liste\n- Liste\n\n-- Liste\n-- Liste\n\n[Link](https://google.com);\n\n## Vorlesung 1: Unterkapitel"}
```

---
# Route usage
## Cheatsheets
The following documents routes for CRUD operations on cheatsheets

### Create cheatsheet
URL, Method GET:
```
http://localhost:3030/api/cheatsheets/create
```

Body:
```json
  {
    "cheatsheet_id": "37652424-81df-4ed2-91ad-9b06bcfa2752",
    "user_id": 1,
    "title": "API-Test Cheatsheet",
    "description": "Test cheatsheet for API testing",
    "created_at": "CURRENT_TIMESTAMP",
    "updated_at": null
  }
```

### Update cheatsheet
URL, Method PUT:
```
http://localhost:3030/api/cheatsheet/:uuid/update
```

Body, can be single values to update
```json
  {
    "title": "API-Test Cheatsheet",
    "description": "Test cheatsheet for API testing"
  }
```