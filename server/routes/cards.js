const express = require('express');
const jwt = require('jsonwebtoken');
const Card = require('mongoose').model('Card');
const router = new express.Router();
require('dotenv').config();

router.post('/', (req, res) => {
    
    // if not provided with authorization header then use default header

    const token = (req.headers.authorization) ? req.headers.authorization : req.body.token;

    // decoding token

    jwt.verify(token, process.env.SECRET, (err, decoded) => {
        const request = {
            title: req.body.title,
            description: req.body.description,
            listId: req.body.listId,
            creator: decoded.sub
        };

        // creating new card

        const new_card = new Card(request);

        new_card.save((err, card) => {
            if (err) {
                return done(err);
            } else {
                res.status(200).json({
                    card,
                    message: 'New card successfully created!'
                });
            }
        });
    });
});

router.post('/edit/:cardId', (req, res) => {

    // generating update query

    let query = {};
    
    if (req.body.title) {
        query.title = req.body.title;
    }

    if (req.body.description) {
        query.description = req.body.description;
    }

    // updating card

    Card.findByIdAndUpdate(req.params.cardId, {$set: query}, (err, card) => {
        if (err) {
            res.send(err);
        }

        res.status(200).json({
            card: card._id,
            message: "Card sucessfully updated!"
        });
    });
});

router.get('/:cardId', (req, res) => {

    // decoding token

    jwt.verify(req.headers.authorization, process.env.SECRET, (err, decoded) => {

        // finding respective card and returning

        Card.findById(req.params.cardId, (err, card) => {
            if (err) {
                res.send(err);
            }

            res.status(200).json({
                title: card.title,
                description: card.description,
                creator: card.creator,
                listId: card.listId
            });
        });
    });
});


router.delete('/:cardId', (req, res) => {

    // decoding token

    jwt.verify(req.headers.authorization, process.env.SECRET, (err, decoded) => {
        
        // removing card

        Card.findByIdAndRemove(req.params.cardId, (err, card) => {
            if (err) {
                res.send(err);
            }

            res.status(200).json({
                message: "Card sucessfully deleted!"
            });
        });
    });
});

router.get('/all', (req, res) => {

    // decoding token

    jwt.verify(req.headers.authorization, process.env.SECRET, (err, decoded) => {
        
        // returning all cards created by current user

        Card.find({creator: decoded.sub}, (err, cards) => {
            if (err) {
                res.send(err)
            }

            res.status(200).json({
                cards
            });
        });
    });
});

module.exports = router;
