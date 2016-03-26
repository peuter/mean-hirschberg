// ```
// routes.js
// (c) 2015 David Newman
// david.r.niciforovic@gmail.com
// routes.js may be freely distributed under the MIT license
// ```

// */app/routes.js*

// ## Node API Routes

// Define routes for the Node backend
import authRoutes from './routes/_authentication.router.js';
import clubRoutes from './routes/_club.router.js';
import personRoutes from './routes/_person.router.js';
import eventRoutes from './routes/_event.router.js';
var serveStatic = require('serve-static')

export default (app, router, passport) => {

  // ### Express Middlware to use for all requests
  router.use((req, res, next) => {

    console.log('I sense a disturbance in the force...'); // DEBUG

    // Make sure we go to the next routes and don't stop here...
    next();
  });

  // Define a middleware function to be used for all secured routes
  let auth = (req, res, next) => {

    if (!req.isAuthenticated())
      res.send(401);

    else
      next();
  };

  // Define a middleware function to be used for all secured administration
  // routes
  let admin = (req, res, next) => {

    if (!req.isAuthenticated() || req.user.role !== 'admin')
      res.send(401);

    else
      next();
  };

  // ### Server Routes

  // Handle things like API calls,

  // #### Authentication routes

  // Pass in our Express app and Router.
  // Also pass in auth & admin middleware and Passport instance
  authRoutes(app, router, passport, auth, admin);

  // #### RESTful API Routes

  // Pass in our Express app and Router
  clubRoutes(app, router);
	personRoutes(app, router);
  eventRoutes(app, router);

	// All of our routes will be prefixed with /api
	app.use('/api', router);

  // ### Frontend Routes

  app.use('/node_modules', serveStatic("./node_modules"));
  app.use('/assets', serveStatic("./src/assets"));

  // Route to handle all Angular requests
  app.get('*', (req, res) => {

    // Load our src/app.html file
    res.sendFile('./dist/index.html', { root: __dirname+'/../' });
  });
};
