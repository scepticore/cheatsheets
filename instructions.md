# Local Dev Environment
`.env`
```dotenv
NODE_ENV=development

MONGO_URL=mongodb://mongodb:27017/cheatsheets
SQLITE_DB_PATH=./data/cheatsheet.db

API_PORT=3030
VITE_API_URL=http://localhost:3030

PDF_GEN_URL=http://pdf-gen:3000
```

# Production (Traefik)
`.env`
```dotenv
NODE_ENV=production

MONGO_URL=mongodb://mongodb:27017/cheatsheets
SQLITE_DB_PATH=./data/cheatsheet.db

API_PORT=3030
VITE_API_URL=http://api.example.com

PDF_GEN_URL=http://pdf-gen:3000
```

Run dev:
```terminaloutput
docker compose up
```

Run production:
```terminaloutput
docker compose up -d --build
```