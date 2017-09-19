const express = require('express');
const jwt = require('jsonwebtoken');
const Card = require('mongoose').model('Card');
const router = new express.Router();
require('dotenv').config();

router.get('/all', (req, res) => {
    jwt.verify(req.headers.authorization, process.env.SECRET, (err, decoded) => {
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

router.post('/', (req, res) => {
    jwt.verify(req.headers.authorization, process.env.SECRET, (err, decoded) => {
        const request = {
            title: req.body.title,
            description: req.body.description,
            listId: req.body.listId,
            creator: decoded.sub
        };

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
    let query = {};
    
    if (req.body.title) {
        query.title = req.body.title;
    }

    if (req.body.description) {
        query.description = req.body.description;
    }

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
    jwt.verify(req.headers.authorization, process.env.SECRET, (err, decoded) => {
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
    jwt.verify(req.headers.authorization, process.env.SECRET, (err, decoded) => {
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

module.exports = router;
