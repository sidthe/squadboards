SquadBoards
=============

This repo contains all the code for running the SquadBoards web app. The app is meant to be a collection of developer planning, management and work tools

Installation
-----------

```
cd $dir
npm install
```

Starting the app
-----------

```
npm start
```
The start script will run webpack and create the required bundle file, after which will start the express server. If no variable was set the server will run on `localhost:3000`

Debugging
-----------
To activate basic console logging set `debug=true` in `squadserver.js`

Styles
-----------
- All components start with `Capital` letters, both the file names and the component functions
- All variables and function names outside components are `camelCase`
- We use ` "" ` as standard quotes all over the place

Ignoring trash
-----------
We have a build in .gitignore that will exclude `npm_modules` and the `bundle.js` file. Please keep it this way or extend it if needed
