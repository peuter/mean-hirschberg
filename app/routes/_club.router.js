/**
 * Club router
 *
 * HTTP Verb  Route                   Description
 * GET        /api/club              Get all of the clubs
 * GET        /api/club/:club_id    Get a single club by club id
 * POST       /api/club              Create a single club
 * DELETE     /api/club/:club_id    Delete a single club
 * PUT        /api/club/:club_id    Update a club with new info
 */

// Load the `club` model
import Club from '../models/club.model';
import Importer from '../utils/Importer';

export default (app, router) => {

  router.route('/club/import').get((req, res) => {
    Importer.importClubsAndPeoples(req, res);
  });

  router.route('/club')
    // ### Create an `club`
    // Accessed at POST http://localhost:8080/api/club
    .post((req, res) => {
      Club.create(req.body, (err, club) => {
        if (err)
          res.send(err);
        // DEBUG
        console.log(`Club created: ${club}`);
        // return the new `club` to our front-end
        res.json(club);
      });
    })

    // ### Get all of the `clubs`
    // Accessed at GET http://localhost:8080/api/club
    .get((req, res) => {
      // Use mongoose to get all recipes in the database
      Club.find().populate('contact').exec((err, club) => {
        if(err)
          res.send(err);
        else
          res.json(club);
      });
    });

  router.route('/club/:club_id')
    // ### Get a `club` by ID
    // Accessed at GET http://localhost:8080/api/club/:club_id
    .get((req, res) => {
      // Use mongoose to fetch a single `recipe` by id in the database
      Club.findOne(req.params.club_id).populate('contact').exec((err, club) => {
        if(err)
          res.send(err);
        else
          res.json(club);
      });
    })

    // ### Update a `club` by ID
    // Accessed at PUT http://localhost:8080/api/club/:club_id
    .put((req, res) => {
      // use our `club` model to find the `club` we want
      Club.findOne(req.params.club_id).populate('contact').exec((err, club) => {
        if (err)
          res.send(err);
        // Only update a field if a new value has been passed in
        for (var key in req.body) {
          club[key] = req.body[key];
        }
        // save the `club`
        return club.save((err) => {
          if (err)
            res.send(err);
          return res.send(club);
        });
      });
    })

    // ### Delete a `club` by ID
    // Accessed at DELETE http://localhost:8080/api/club/:club_id
    .delete((req, res) => {
      // DEBUG
      console.log(`Attempting to delete club with id: ${req.params.club_id}`);
      Club.remove({
        _id : req.params.club_id
      }, (err, club) => {
        if(err)
          res.send(err);
        else
          console.log('Club successfully deleted!');
        Club.find().populate('contact').exec((err, clubs) => {
          if(err)
            res.send(err);
          res.json(clubs);
        });
      });
    });
};
