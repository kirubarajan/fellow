![Fellow](https://i.imgur.com/lW87eyU.png)

Welcome to Fellow (because it's Penn LABs - badum tss) - a trello API clone built using Node and ES6.

## Stack

### Front-end

Bulma for making forms look pretty.

## Back-end

1. Express for server .
2. MongoDB for database (although the data is technically relational, the schema dictates document-level references anyway).
3. JWT/Passport for authentication (extra feature).

## Notable changes

1. The `id`s of cards and lists are immutable strings (not `int`s) as per MongoDB's standard schemas.
2. The `edit` routes have been changed to `/card/edit/:cardId` and `/list/edit/:listId` for consistency.

## Documentation

### Server Behaviour

### Security

TBD