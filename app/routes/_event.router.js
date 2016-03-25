/**
 * Event router
 *
 * HTTP Verb  Route                   Description
 * GET        /api/event              Get all of the events
 * GET        /api/event/:event_id    Get a single event by event id
 * POST       /api/event              Create a single event
 * DELETE     /api/event/:event_id    Delete a single event
 * PUT        /api/event/:event_id    Update a event with new info
 */

// Load the `event` model
import Event from '../models/event.model';

export default (app, router) => {

  router.route('/event')
    // ### Create an `event`
    // Accessed at POST http://localhost:8080/api/event
    .post((req, res) => {
      Event.create({
        title : req.body.title,
        description : req.body.description,
        location : req.body.location
      }, (err, event) => {
        if (err)
          res.send(err);
        // DEBUG
        console.log(`Event created: ${event}`);
        // return the new `event` to our front-end
        res.json(event);
      });
    })

    // ### Get all of the `events`
    // Accessed at GET http://localhost:8080/api/event
    .get((req, res) => {
      // Use mongoose to get all recipes in the database
      Event.find((err, event) => {
        if(err)
          res.send(err);
        else
          res.json([{
            title: 'Test',
            start: '2016-03-24',
            end: '2016-03-24',
            allDay: true
          }]);
      });
    });

  router.route('/event/:event_id')
    // ### Get a `event` by ID
    // Accessed at GET http://localhost:8080/api/event/:event_id
    .get((req, res) => {
      // Use mongoose to fetch a single `recipe` by id in the database
      Event.findOne(req.params.event_id, (err, event) => {
        if(err)
          res.send(err);
        else
          res.json(event);
      });
    })

    // ### Update a `event` by ID
    // Accessed at PUT http://localhost:8080/api/event/:event_id
    .put((req, res) => {
      // use our `event` model to find the `event` we want
      Event.findOne(req.params.event_id, (err, event) => {
        if (err)
          res.send(err);
        // Only update a field if a new value has been passed in
        if (req.body.title)
          event.title = req.body.title;
        if (req.body.creator)
          event.creator = req.body.creator;
        if (req.body.description)
          event.description = req.body.description;
        // save the `event`
        return event.save((err) => {
          if (err)
            res.send(err);
          return res.send(event);
        });
      });
    })

    // ### Delete a `event` by ID
    // Accessed at DELETE http://localhost:8080/api/event/:event_id
    .delete((req, res) => {
      // DEBUG
      console.log(`Attempting to delete event with id: ${req.params.event_id}`);
      Event.remove({
        _id : req.params.event_id
      }, (err, event) => {
        if(err)
          res.send(err);
        else
          console.log('Event successfully deleted!');
        Event.find((err, events) => {
          if(err)
            res.send(err);
          res.json(events);
        });
      });
    });
};
