![Fellow](https://i.imgur.com/lW87eyU.png)

Welcome to Fellow (because it's Penn LABs - badum tss) - a trello API clone built using Node and ES6.

## Stack

### Front-end

1. Bulma for making forms look pretty.

## Back-end

1. Express for server (npm has a great ecosystem).
2. MongoDB for database (although the data is technically relational, NoSQL is fast to develop with and the schema dictates document-level references anyway).
3. JWT/Passport for authentication (extra feature talked about at length in Documentation section).

## Notable changes

1. The `id`s of cards and lists are immutable strings (not `int`s) as per MongoDB's standard schemas.
2. The `edit` routes have been changed to `/card/edit/:cardId` and `/list/edit/:listId` for consistency.

## DevOps

Server hosted on Ubuntu instance on AWS (so you don't have to clone the repo - but you can still `yarn && yarn start` if you want).
Database hosting using MLab.

## Documentation

### Server Behaviour

### Security

TBD