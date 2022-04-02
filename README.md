# Next-Gen-Event-TrackerInstructions:
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
