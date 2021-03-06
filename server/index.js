/* eslint-disable prefer-destructuring */
const newrelic = require('newrelic');
const express = require('express');
const compression = require('compression');
const cors = require('cors');
const bodyParser = require('body-parser');
const path = require('path');
const db = require('../database/index.js');


const app = express();

app.use(compression());
app.use(cors());
// app.use(bodyParser.json());
// app.use(bodyParser.urlencoded({
//   extended: true,
// }));

const port = 3008;

const jsonParser = bodyParser.json();

// bundle
app.use(express.static(`${__dirname}/../client/dist`));

// Get all reviews with images for a specific product at :productId
app.get('/api/reviews/images/:productId', (req, res) => {
  const {
    productId,
  } = req.params;
  db.getReviewImages(parseInt(productId, 10), (err, reviews) => {
    if (err) {
      res.status(400).send();
    }
    res.status(200).send(reviews.rows);
  });
});

// Get all reviews for a specific product at :productId
app.get('/api/reviews/:productId', (req, res) => {
  const {
    productId,
  } = req.params;
  db.getReviews(parseInt(productId, 10), (err, reviews) => {
    if (err) {
      res.status(400).send();
    }
    res.status(200).send(reviews.rows);
  });
});

// Post a review to a specific product
app.post('/api/reviews/', jsonParser, (req, res) => {
  const {
    body,
  } = req;
  db.addOneReview(body, (err) => {
    if (err) {
      res.status(400).send(err);
    }
    res.status(201).send(body);
  });
});

// Post an image on a review to a product
app.post('/api/reviews/images', jsonParser, (req, res) => {
  const {
    body,
  } = req;
  db.addOneImage(body, (err) => {
    if (err) {
      res.status(400).send(err);
      return;
    }
    res.status(201).send(body);
  });
});


// Update a review for a specific product at :productId
app.put('/api/reviews/:reviewsId', jsonParser, (req, res) => {
  const {
    reviewsId,
  } = req.params;
  const {
    body,
  } = req;
  db.updateOneReview(parseInt(reviewsId, 10), body, (err) => {
    if (err) {
      res.status(400).send();
    }
    res.status(200).send(body);
  });
});

// Delete a review for a specific product at :productId
app.delete('/api/reviews/:reviewsId', (req, res) => {
  const {
    reviewsId,
  } = req.params;
  db.deleteOneReview(parseInt(reviewsId, 10), (err) => {
    if (err) {
      res.status(400).send();
    }
    db.deleteImages(parseInt(reviewsId, 10), (err) => {
      if (err) {
        res.status(400).send();
      }
      res.status(200).send(reviewsId);
    });
  });
});

// the index.html
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../client/dist', 'index.html'));
});

app.listen(port, () => console.log(`Now listening on port ${port}!`));
