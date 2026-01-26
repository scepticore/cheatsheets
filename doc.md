# Documentation (service name)

## Frontend (frontend)
- Web based Markdown Editor

## API / Backend (api)
- REST-API based on ExpressJS

## PDF-Generator (pdf-gen)
- PDF-Generator Service
- Calls API (/api/cheatsheets/:uuid/pdf)
- Generates PDF in user folder

## MongoDB (mongodb)
- Stores Markdown as Objects
```json
{
    "id": "uuid",
    "body": "markdownstring"
}
```