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

app.get('/api/parksCache/:parkCode', async (req, res, next) => {
  try {
    const parkCode = req.params.parkCode;
    const sql = `
      select avg("rating") as "rating"
      from "parksCache"
      join "reviews" using ("parkCode")
      where "parkCode" = $1`;
    const params = [parkCode];
    const result = await db.query(sql, params);
    const [rating] = result.rows;
    if (!rating) {
      res.status(404).json({
        error: `Cannot find park with "parkCode" ${parkCode}`
      });
    }
    res.status(200).json(rating);
  } catch (err) {
    next(err);
  }
});

app.post('/api/auth/sign-up', async (req, res, next) => {
  const { username, password } = req.body;
  if (!username || !password) {
    throw new ClientError(400, 'username and password are required fields');
  }
  try {
    const hashedPassword = await argon2.hash(password);
    const sql = `
      insert into "accounts" ("username", "hashedPassword")
      values ($1, $2)
      on conflict ("username")
      do nothing
      returning "accountId", "username", "joinedAt"`;
    const params = [username, hashedPassword];
    const result = await db.query(sql, params);
    if (!result.rows[0]) {
      throw new ClientError(409, 'username is already in use');
    }
    const [user] = result.rows;
    res.status(201).json(user);
  } catch (err) {
    next(err);
  }
});

app.post('/api/auth/sign-in', async (req, res, next) => {
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
  try {
    const result = await db.query(sql, params);
    const [user] = result.rows;
    if (!user) {
      throw new ClientError(401, 'invalid login');
    }
    const { accountId, hashedPassword } = user;
    const isMatching = await argon2.verify(hashedPassword, password);
    if (!isMatching) {
      throw new ClientError(401, 'invalid login');
    }
    const payload = { accountId, username };
    const token = jwt.sign(payload, process.env.TOKEN_SECRET);
    res.json({ token, user: payload });
  } catch (err) {
    next(err);
  }
});

app.use(authorizationMiddleware);

app.get('/api/accounts/', async (req, res, next) => {
  const { accountId } = req.user;

  const sql = `
    select "stateCode",
    count(*) as "visits"
    from "reviews"
    join "parksCache" using ("parkCode")
    where "accountId" = $1
    group by "stateCode"
    order by "visits" desc`;

  const params = [accountId];
  try {
    const result = await db.query(sql, params);
    const visits = result.rows;
    const total = `
        select count(*) as "reviews"
        from "reviews"
        where "accountId" = $1`;
    const totalResult = await db.query(total, params);
    const amount = totalResult.rows;
    res.status(200).json([visits, amount]);
  } catch (err) {
    next(err);
  }
});

app.post('/api/reviews', uploadsMiddleware, async (req, res, next) => {
  const { parkCode, rating, datesVisited, recommendedActivities, recommendedVisitors, tips, generalThoughts, parkDetails, stateCode } = req.body;
  const { accountId } = req.user;
  if (!rating | !datesVisited | !recommendedActivities | !recommendedVisitors | !tips) {
    throw new ClientError(400, 'Required information missing: rating, dates, activities, visitors, or tips');
  }
  const dates = `[${datesVisited}]`;
  let url = null;
  if (req.file !== undefined) {
    url = req.file.location;
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
  try {
    const result = await db.query(sqlSelect, paramsSelect);
    const park = await result.rows[0];
    if (!park) {
      const parksCache = await db.query(parksCacheSql, parksParams);
      if (parksCache.length === 3) {
        const insertReview = await db.query(reviewSql, reviewParams);
        res.status(201).json(insertReview);
      }
    } else {
      const postReview = await db.query(reviewSql, reviewParams);
      res.status(201).json(postReview);
    }
  } catch (err) {
    next(err);
  }
});

app.get('/api/reviews/:stateCode', async (req, res, next) => {
  const { accountId } = req.user;
  const stateCode = req.params.stateCode;
  const sql = `
    select *
    from "reviews"
    join "parksCache" using ("parkCode")
    where "stateCode" = $1 and "accountId" = $2`;
  const params = [stateCode, accountId];
  try {
    const result = await db.query(sql, params);
    const reviews = result.rows;
    res.status(200).json(reviews);
  } catch (err) {
    next(err);
  }
});

app.get('/api/edit/:parkCode', async (req, res, next) => {
  const { accountId } = req.user;
  const parkCode = req.params.parkCode;
  const sql = `
    select *
    from "reviews"
    where "accountId" = $1 and "parkCode" = $2`;
  const params = [accountId, parkCode];
  try {
    const result = await db.query(sql, params);
    const park = result.rows;
    res.status(200).json(park);
  } catch (err) {
    next(err);
  }
});

app.put('/api/reviews', uploadsMiddleware, async (req, res, next) => {
  const { accountId } = req.user;
  const { parkCode, rating, datesVisited, recommendedActivities, recommendedVisitors, tips, generalThoughts } = req.body;

  if (!rating | !datesVisited | !recommendedActivities | !recommendedVisitors | !tips) {
    throw new ClientError(400, 'Required information missing: rating, dates, activities, visitors, or tips');
  }
  const dates = `[${datesVisited}]`;
  let url = null;
  if (req.file !== undefined) {
    url = req.file.location;
  }

  const sql = `
  update "reviews"
  set "rating" = $3,
      "datesVisited" = $4,
      "recommendedActivities" = $5,
      "recommendedVisitors" = $6,
      "tips" = $7,
      "generalThoughts" = $8,
      "imageUrl" = coalesce($9, "imageUrl")
  where "parkCode" = $2 and "accountId" = $1
  returning *`;
  const params = [accountId, parkCode, rating, dates, recommendedActivities, recommendedVisitors, tips, generalThoughts, url];
  try {
    const result = await db.query(sql, params);
    const update = result.rows[0];
    res.status(200).json(update);
  } catch (err) {
    next(err);
  }
});

app.delete('/api/reviews/:parkCode', async (req, res, next) => {
  const { accountId } = req.user;
  const parkCode = req.params.parkCode;
  const sql = `
    delete from "reviews"
    where "accountId" = $1
      and "parkCode" = $2
    returning *`;
  const params = [accountId, parkCode];
  try {
    const result = await db.query(sql, params);
    res.json(result);
  } catch (err) {
    next(err);
  }
});

app.use(errorMiddleware);

app.listen(process.env.PORT, () => {
  process.stdout.write(`\n\napp listening on port ${process.env.PORT}\n\n`);
});
