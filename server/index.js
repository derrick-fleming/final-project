require('dotenv/config');
const pg = require('pg');
const express = require('express');
const ClientError = require('./client-error');
const staticMiddleware = require('./static-middleware');
const errorMiddleware = require('./error-middleware');
const uploadsMiddleware = require('./uploads-middleware');

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

app.get('/api/parksCache/:parkCode', (req, res, next) => {
  const parkCode = req.params.parkCode;
  if (!parkCode) {
    throw new ClientError(400, 'Park Code must be provided');
  }
  const sql = `
    select avg("rating") as "rating"
    from "parksCache"
    join "reviews" using ("parkCode")
    where "parkCode" = $1`;
  const params = [parkCode];
  db.query(sql, params)
    .then(result => {
      const [rating] = result.rows;
      if (!rating) {
        res.status(404).json({
          error: `Cannot find park with "parkCode" ${parkCode}`
        });
      }
      res.status(200).json(rating);
    })
    .catch(err => next(err));
});

app.post('/api/reviews', uploadsMiddleware, (req, res, next) => {
  const { accountId, parkCode, rating, datesVisited, recommendedActivities, recommendedVisitors, tips, generalThoughts, parkDetails, stateCode } = req.body;
  if (!accountId) {
    throw new ClientError(400, 'User account required to post review');
  }
  if (!rating | !datesVisited | !recommendedActivities | !recommendedVisitors | !tips) {
    throw new ClientError(400, 'Required information missing: rating, dates, activities, visitors, or tips');
  }
  const dates = `[${datesVisited}]`;
  let url = null;
  if (req.file !== undefined) {
    url = `/images/${req.file.filename}`;
  }

  const sqlSelect = `
    select "parkCode"
    from "parksCache"
    where  "parkCode" = $1`;

  const paramsSelect = [parkCode];

  const parksCacheSql = `
  insert into "parksCache" ("parkCode", "details", "stateCode")
  values ($1, $2, $3) `;

  const reviewSql = `
  insert into "reviews" ("accountId", "parkCode", "rating", "datesVisited", "recommendedActivities", "recommendedVisitors", "tips", "generalThoughts", "imageUrl")
  values ($1, $2, $3, $4, $5, $6, $7, $8, $9)
     `;
  const parksParams = [parkCode, parkDetails, stateCode];
  const reviewParams = [accountId, parkCode, rating, dates, recommendedActivities, recommendedVisitors, tips, generalThoughts, url];

  db.query(sqlSelect, paramsSelect)
    .then(result => {
      const park = result.rows[0];
      if (!park) {
        db.query(parksCacheSql, parksParams)
          .then(result => {
            db.query(reviewSql, reviewParams)
              .then(result => {
                res.status(201).json(result);
              })
              .catch(err => next(err));
          })
          .catch(err => next(err));
      } else {
        db.query(reviewSql, reviewParams)
          .then(result => {
            res.status(201).json(result);
          })
          .catch(err => next(err));
      }
    })
    .catch(err => next(err));
});

app.use(errorMiddleware);

app.listen(process.env.PORT, () => {
  process.stdout.write(`\n\napp listening on port ${process.env.PORT}\n\n`);
});
