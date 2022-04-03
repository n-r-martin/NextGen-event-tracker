<h1 align="center"> Next Gen Event Tracker <h1>

![badge](https://img.shields.io/badge/license-MIT-blue)

## Description


## Table of Contents
- [Description](#description) 
- [User Stories](#user-stories)  
- [Installation](#installation)
- [Contribution](#contribution)
- [License](#license)
- [Usage](#usage)
- [Questions](#questions)
  
## User Stories
As a user, I want to view events for a specific area/region </br>
As a user, I want to have a profile specific user experience </br>
As a user, I want to submit an event into the database to contribute to the community. </br>
As a developer, I want to access community submitted events via api and use in my app. </br>

## Installation
1. update ./config/connection.js and the root/ .env as needed for your database info.
2. Run ./db/schema.sql using mysql console
3. Run npm i from terminal
4. Run npm run seed from terminal
5. Run npm start from terminal
App will listen on :3001 if running from localhost, or data from process.env.PORT if running from app server (i.e. Heroku)
<http://localhost:3001> will render a webpage with data from both tables
<http://localhost:3001/api/routeone> will return data from modelone table
<http://localhost:3001/api/routetwo> will return data from modeltwo table
App will use local .env for database connection if running from localhost, or data from process.env if running from app server (i.e. Heroku)
App will use local .env and settings in connection.js for database connection if running from localhost, or data from process.env to include JAWS_DB if running from app server (i.e. Heroku)

## Contribution
Follow basic contribution guidelines and coding etiquette, please.

## License
![badge](https://img.shields.io/badge/license-MIT-blue)</br>

This project is covered by MIT

  
## Usage


## Questions
Look for us on GitHub at: 
- [Nick M](https://github.com/n-r-martin "Nick's link")  
- [Mike J](https://github.com/GittinIt6 "Nick's link")
- [Spencer K](https://github.com/Skerans "Spencer's link")

