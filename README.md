![Fellow](https://i.imgur.com/lW87eyU.png)

Welcome to Fellow (because it's Penn LABs - badum tss) - a trello API clone.

## Stack

This project was mostly written using ES6 features on top of a Node environment.

### Front end

1. Bulma for making forms look pretty.

## Back end

1. [Express](https://expressjs.com) for server (npm has a great ecosystem).
2. [MongoDB](https://www.mongodb.com/) for database (although the data is technically relational, NoSQL is fast to develop with and the schema dictates document-level references anyway).
3. [JWT/Passport](https://jwt.io/) for authentication (extra feature talked about at length in Documentation section).

## Notable changes and additions

1. The `id`s of cards and lists are immutable strings (not `int`s) as per MongoDB's standard schemas.
2. The `edit` routes have been changed to `/card/edit/:cardId` and `/list/edit/:listId` for consistency.
3. Added a `/card/all` route to return all cards made by the user.
4. Added a `/list/all` route to return all lists made by the user (useful for debugging).
5. Added timestamps using a `createdAt` field to all documents.
6. Added an author field using `creator` to all documents.
7. Built middleware in `/server/auth/middleware.js` to check if token exists.

## DevOps

Server hosted on Ubuntu instance on AWS (so you don't have to clone the repo - but you can still `yarn && yarn start` if you want). Link in repo description. Database hosted using MLab free tier.

All environment variables are located in `.env` (I know this is isn't safe but I trust you guys), including `PORT`, `DB_URI` and `SECRET` (key used to sign tokens).

## Documentation

The code is commented but this section aims to provide a high-level overview of the project structure. Use this guide while exploring the codebase.

### Server Behaviour

0. Project is split into `/server` and `/client` folders. Project starts at `server/index.js` when running `yarn start`. 
1. Schemas for users, cards, and lists are in the `/server/models` folder with their own respective files linked together `/server/models/index.js` when connecting to the MongoDB instance.
2. Routes are refactored into routers of their respective schema (and authentication protocol) in `server/routes`. 
3. CRUD operations within routes are standard with the exception of re-ordering lists in which other are moved around according instead of simple swapping (similar to Trello's actual behavior).

### Security

Tokens are used to authenticate routes in a stateless manner and are signed using the 256 bit secret found in `.env` (can be set to arbitrary length). The procedure for token authentication in Fellow is as follows:

1. User creates account using `/signup` route. Password is hashed using bcrypt and is stored.
2. User signs in using `/login` route. Provided password is hashed using bcrypt and is compared. If match, then token is generated by signing a payload of user's `_id` and username using a 256 bit secret.
4. An `Authorization` header MUST be set to a signed token in order for protected routes (`/card/*` and `/list/*`) to be accessed when using the API. However, when using the static front end pages I've added a default token to be sent so that you don't have to worry about it when using the web form.
5. Upon logout (or after 2 hours if you uncomment the comment in the signature line in `/server/auth/login.js`) tokens must be regenerated.