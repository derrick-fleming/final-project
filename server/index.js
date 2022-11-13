require('dotenv/config');
const pg = require('pg');
const express = require('express');
const ClientError = require('./client-error');
const staticMiddleware = require('./static-middleware');
const errorMiddleware = require('./error-middleware');

const db = new pg.Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false
  }
});

const app = express();
const jsonMiddleWare = express.json();

app.use(staticMiddleware);
app.use(jsonMiddleWare);

app.get('/api/hello', (req, res) => {
  res.json({ hello: 'world' });
});

app.get('/api/parksCache/:parkCode', (req, res, next) => {
  const parkCode = req.params.parkCode;
  const { accountId } = req.body;
  if (!parkCode) {
    throw new ClientError(400, 'Park Code must be provided');
  }
  const sql = `
    select "rating"
    from "parksCache"
    join "reviews" using ("parkCode")
    where "parkCode" = $1
    and "accountId" = $2`;
  const params = [parkCode, accountId];
  db.query(sql, params)
    .then(result => {
      const [rating] = result.rows;
      if (!rating) {
        res.status(404).json({
          error: `Cannot find park with "parkCode" ${parkCode}`
        });
      }
      res.json(rating);
    })
    .catch(err => next(err));
});

app.post('/api/parksCache', (req, res, next) => {
  const { parkCode, details, stateCode } = req.body;
  if (!parkCode || !details || !stateCode) {
    throw new ClientError(400, 'Park information: parkCode, details, and stateCode are required fields');
  }
  const sql = `
    insert into "parksCache" ("parkCode", "details", "stateCode")
    values ($1, $2, $3)`;
  const params = [parkCode, details, stateCode];
  db.query(sql, params)
    .then(result => {
      const [park] = result.rows;
      res.status(201).json(park);
    })
    .catch(err => next(err));
});

app.post('/api/reviews', (req, res, next) => {
  const { accountId, parkCode, rating, datesVisited, recommendedActivities, recommendedVisitors, tips, generalThoughts, imageUrl } = req.body;
  if (!accountId) {
    throw new ClientError(400, 'User account required to post review');
  }
  if (!rating | !datesVisited | !recommendedActivities | !recommendedVisitors | !tips) {
    throw new ClientError(400, 'Required information missing: rating, dates, activities, visitors, or tips');
  }
  const sql = `
    insert into "reviews" ("accountId", "parkCode", "rating", "datesVisited", "recommendedActivities", "recommendedVisitors", "tips", "generalThoughts", "imageUrl")
    values ($1, $2, $3, $4, $5, $6, $7, $8, $9) `;
  const params = [accountId, parkCode, rating, datesVisited, recommendedActivities, recommendedVisitors, tips, generalThoughts, imageUrl];
  db.query(sql, params)
    .then(result => {
      const [review] = result.rows;
      res.status(201).json(review);
    })
    .catch(err => next(err));
});

app.use(errorMiddleware);

app.listen(process.env.PORT, () => {
  process.stdout.write(`\n\napp listening on port ${process.env.PORT}\n\n`);
});
