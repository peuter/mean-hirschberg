/**
 * Person router
 *
 * HTTP Verb  Route                   Description
 * GET        /api/person              Get all of the persons
 * GET        /api/person/:person_id    Get a single person by person id
 * POST       /api/person              Create a single person
 * DELETE     /api/person/:person_id    Delete a single person
 * PUT        /api/person/:person_id    Update a person with new info
 */

// Load the `person` model
import Person from '../models/person.model';

export default (app, router) => {

  router.route('/person')
    // ### Create an `person`
    // Accessed at POST http://localhost:8080/api/person
    .post((req, res) => {
      console.log(req.body);
      Person.create(req.body, (err, person) => {
        if (err)
          res.send(err);
        // DEBUG
        console.log(err);
        console.log(`Person created: ${person}`);
        // return the new `person` to our front-end
        res.json(person);
      });
    })

    // ### Get all of the `persons`
    // Accessed at GET http://localhost:8080/api/person
    .get((req, res) => {
      // Use mongoose to get all recipes in the database
      Person.find((err, person) => {
        if(err)
          res.send(err);
        else
          res.json(person);
      });
    });

  router.route('/person/:person_id')
    // ### Get a `person` by ID
    // Accessed at GET http://localhost:8080/api/person/:person_id
    .get((req, res) => {
      // Use mongoose to fetch a single `recipe` by id in the database
      Person.findOne(req.params.person_id, (err, person) => {
        if(err)
          res.send(err);
        else
          res.json(person);
      });
    })

    // ### Update a `person` by ID
    // Accessed at PUT http://localhost:8080/api/person/:person_id
    .put((req, res) => {
      // use our `person` model to find the `person` we want
      Person.findOne(req.params.person_id, (err, person) => {
        if (err)
          res.send(err);
        // Only update a field if a new value has been passed in
        if (req.body.name)
          person.name = req.body.name;
        if (req.body.address)
          person.address = req.body.address;
        if (req.body.email)
          person.email = req.body.email;
        // save the `person`
        return person.save((err) => {
          if (err)
            res.send(err);
          return res.send(person);
        });
      });
    })

    // ### Delete a `person` by ID
    // Accessed at DELETE http://localhost:8080/api/person/:person_id
    .delete((req, res) => {
      // DEBUG
      console.log(`Attempting to delete person with id: ${req.params.person_id}`);
      Person.remove({
        _id : req.params.person_id
      }, (err, person) => {
        if(err)
          res.send(err);
        else
          console.log('Person successfully deleted!');
        Person.find((err, persons) => {
          if(err)
            res.send(err);
          res.json(persons);
        });
      });
    });
};
