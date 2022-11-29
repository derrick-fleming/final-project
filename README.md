# Park-Advisor

A full stack web application for travelers who want to search, review, and track their vists to different national parks & monuments.

## Why I Built This

My parents helped inspire this project. They recently have made it a goal to visit each state and compete in a half marathon. While there, they will go to different parks/monuments near the race. Their trips inspired me to create something that could track people's visits to each state in a fun and interactive visual. I had seen different tools where people can track their visits to countries on various scratch-off maps, and I wanted to make something similar where people could not only mark that they've visited but also record their thoughts on a park visit.

## Live Demo

Try the application live at [https://park-advisor.derrickfleming.com/](https://park-advisor.derrickfleming.com/)

## Technologies Used

- React.js
- Webpack
- Bootstrap 5
- PostgeSQl
- Node.js
- Express.js
- Argon2
- Multer & Multer-S3
- D3.js
- TopoJSON
- Escape-HTML
- JavaScript (ES6)
- HTML5
- CSS3
- National Parks Service API: [Documentation](https://www.nps.gov/subjects/developer/api-documentation.htm)
- Google Maps Platform: [Documentation](https://developers.google.com/maps)
- MediaWiki API: [Documentation](https://www.mediawiki.org/wiki/API:Main_page)

## Features

- Users can search for a park
- Users can view a map of park locations
- Users can filter parks through categories: states & activities
- Users can view details about a park
- Users can create a review of a park
- Users can view an infographic map of states visited
- Users can view a list of their reviews for parks by state
- Users can edit their reviews
- Users can create an account
- Users can sign in

## Preview

### Users can view an infographic map of states visited
![view an infographic map of states visited](/server/public/images/user-view-infographic.gif)

### Users can create a review of a park
![create a review](/server/public/images/user-write-reviews.gif)

## Stretch Features
- Users can delete their reviews
- Users can log out
- Users can view other people's reviews

## Getting Started
1. Clone the repository
    ```shell
    git clone https://github.com/derrick-fleming/final-project.git
    ```
2. Install all dependencies with NPM
    ```shell
    npm install
    ```
3. Create a local .env file from provided example file
    ```shell
    cp .env.example .env
    ```
4. Set the TOKEN_SECRET from *randomtext123789* on your .env file
    ```shell
    TOKEN_SECRET=randomtext123789
    ```
5. Create an account with National Parks Service to obtain an API Key: https://www.nps.gov/subjects/developer/get-started.htm

6. Update **PARKS_API** key with token you received from National Parks Service
    ```shell
    PARKS_API=nationalParksKey
    ```

7. Create an account with Google Maps Platform and retreive API Key: https://developers.google.com/maps


8. Update **Google_MAPS_API_KEY** with token you received from Google Maps Platform
    ```shell
    GOOGLE_MAPS_API_KEY=googleMapsKey
    ```

9. Create Simple Storage Solution for file uploads using AWS:
    -  Create an account with AWS: https://aws.amazon.com/free/
    -  Open **IAM service** in AWS console:  https://console.aws.amazon.com/iam/home.
    - Click **Users** link and then **Add Users**
    - In **Set Permissions** select **Attach existing policies directly**
    - Filter policies for **AmazonS3FullAccess** policy.
    - Copy the access key id and secret access key

10. Update **AWS_ACCESS_KEY_ID** and **AWS_SECRET_ACCESS_KEY** with the provided *access key id* and *secret access key* from AWS.

    ```shell
    AWS_ACCESS_KEY_ID=XXXXXXXXXXXXXXXXXXXX
    AWS_SECRET_ACCESS_KEY=xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
    ```

10. Create a bucket to store file uploads:
    - Go to https://console.aws.amazon.com/s3/home
    - Click **Create bucket**
    - Choose a unique name
    - Under Object Ownership Select **ACLs enabled** and **Bucket owner preffered**
    - Uncheck option to **Block all public access**

10. Update **AWS_S3_REGION** and **AWS_S3_BUCKET**
    ```shell
    AWS_S3_REGION=us-east-2
    AWS_S3_BUCKET=some-bucket-name
    ```

5. Start PostgreSQL
    ```shell
    sudo service postgresql start
    ```

6. Create a database. Choose your own name for the database.
    ```shell
    createdb name-of-database
    ```

7. Update the DATABASE_URL in your .env file. Revise *changeMe* to the name you picked above.
    ```shell
    DATABASE_URL=postgres://dev:dev@localhost/changeMe?sslmode=disable
    ```

8. Start pgweb to view database information
    ```shell
    pgweb --db=name-of-database
    ```

9. Initalize the database and import any starting data from data.sql
    ```shell
    npm run db:import
    ```

10. Start the project! Once started, you can view the application by opening http://localhost:3000 in your browser.
    ```shell
    npm run dev
    ```
