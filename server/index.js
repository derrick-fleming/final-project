require('dotenv/config');
const pg = require('pg');
const express = require('express');
const ClientError = require('./client-error');
const staticMiddleware = require('./static-middleware');
const errorMiddleware = require('./error-middleware');
const uploadsMiddleware = require('./uploads-middleware');
const jwt = require('jsonwebtoken');
const authorizationMiddleware = require('./authorization-middleware');
const argon2 = require('argon2');

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

app.post('/api/auth/sign-up', (req, res, next) => {
  const { username, password } = req.body;
  if (!username || !password) {
    throw new ClientError(400, 'username and password are required fields');
  }

  argon2
    .hash(password)
    .then(hashedPassword => {
      const sql = `
      insert into "accounts" ("username", "hashedPassword")
      values ($1, $2)
      on conflict ("username")
      do nothing
      returning "accountId", "username", "joinedAt"`;
      const params = [username, hashedPassword];
      return db.query(sql, params);
    })
    .then(result => {
      if (!result.rows[0]) {
        throw new ClientError(409, 'username is already in use');
      }
      const [user] = result.rows;
      res.status(201).json(user);
    })
    .catch(err => next(err));
});

app.post('/api/auth/sign-in', (req, res, next) => {
  const { username, password } = req.body;
  if (!username || !password) {
    throw new ClientError(401, 'invalid login');
  }
  const sql = `
    select "accountId",
           "hashedPassword"
    from "accounts"
    where "username" = $1`;
  const params = [username];
  db.query(sql, params)
    .then(result => {
      const [user] = result.rows;
      if (!user) {
        throw new ClientError(401, 'invalid login');
      }
      const { accountId, hashedPassword } = user;
      return argon2
        .verify(hashedPassword, password)
        .then(isMatching => {
          if (!isMatching) {
            throw new ClientError(401, 'invalid login');
          }
          const payload = { accountId, username };
          const token = jwt.sign(payload, process.env.TOKEN_SECRET);
          res.json({ token, user: payload });
        });
    })
    .catch(err => next(err));
});

app.use(authorizationMiddleware);

app.get('/api/accounts/:accountId', (req, res, next) => {
  const accountId = req.params.accountId;
  const total = `select count(*) as "reviews"
  from "reviews"
  where "accountId" = $1
  group by "accountId"`;

  const sql = `
    select "stateCode",
    count(*) as "visits"
    from "accounts"
    join "reviews" using ("accountId")
    join "parksCache" using ("parkCode")
    where "accountId" = $1
    group by "stateCode"
    order by "visits" desc`;

  const params = [accountId];
  db.query(sql, params)
    .then(result => {
      const visits = result.rows;
      db.query(total, params)
        .then(response => {
          const amount = response.rows;
          res.status(200).json([visits, amount]);
        })
        .catch(err => next(err));
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
