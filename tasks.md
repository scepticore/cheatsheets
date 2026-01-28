# Overall
- [ ] Documentation
- [ ] DocStrings
- [ ] Errorhandling
- [ ] Security

---

# Frontend
- [ ] Notifications
  - [ ] Autosave
  - [ ] Registration
  - [ ] Sign In Errors
  - [ ] PDF Export

## Auth
- [ ] Auth Service
- [x] SignUp Form
- [ ] SignIn Form
- [ ] Redirect after signin / create or load session
- [ ] Redirect after signup / create session
- [ ] Create User Folder in /output/ with uuid after successfull registration

## Pages
- [ ] Community Cheatsheets (flag: `public = true`)
- [ ] Example Cheatsheets
- [ ] Help Section
- [ ] Dashboard with news from Software / Latest cheatsheets

## Cheatsheets
- [ ] Settings (Column-Count, Font-Size)
- [ ] Single View
- [ ] New Cheatsheet triggers SQLite Create and MongoDB Create and uses uuid
- [ ] Create Form
  - [ ] Read formData
  - [ ] Read ace-Content
- [x] Edit Form
  - [x] Read formData change (and save)
  - [x] Read ace-Content on change (and save)
- [ ] Delete Dialogue
- [ ] Render-Button to reload PDF
- [ ] Download as .md-file
- [ ] Notification on autosave


---

# API / Backend
- [ ] Use JWT for requests
- [x] Create Cheatsheet
- [x] Read Cheatsheet
  - [x] Connection to SQLite DB
  - [x] Connection to MongoDB
- [ ] Update Cheatsheet
  - [ ] Update in SQLite DB
  - [ ] Update MongoDB Object
- [x] Delete Cheatsheet
- [ ] PDF Storage
- [ ] Route To Get PDF (e.g. api:3030/api/cheatsheet/:uuid/pdf)
- [ ] Button to download markdown file (write text into file and store as .md)

---
# PDF-Generator
- [ ] TaskItem
- [ ] Store PDF on Backend

---
# MongoDB
- [ ] Create Cheatsheet
- [ ] Read Cheatsheet
- [ ] Update Cheatsheet
- [ ] Delete Cheatsheet