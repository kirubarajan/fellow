const express = require('express');
const jwt = require('jsonwebtoken');
const List = require('mongoose').model('List');
const Card = require('mongoose').model('Card');
const router = new express.Router();
require('dotenv').config();

router.post('/', (req, res) => {\
    
    // if not provided with authorization header then use default header

    const token = (req.headers.authorization) ? req.headers.authorization : req.body.token;

    // decoding token

    jwt.verify(token, process.env.SECRET, (err, decoded) => {
        List.count({}, (err, count) => {
            const request = {
                title: req.body.title,
                order: req.body.order,
                creator: decoded.sub,
                order: count
            };

            // creating new list

            const new_list = new List(request);

            new_list.save((err, list) => {
                if (err) {
                    res.send(err);
                } else {
                    res.status(200).json({
                        list,
                        message: 'New list successfully created!'
                    });
                }
            });
        });
    });
});

// note: this one is a doozy

router.post('/edit/:listId', (req, res) => {

    // getting requested list

    List.findById(req.params.listId, (err, list) => {

        // keeping track of current card ordering

        const old_order = list.order;
        
        // generating update query

        let query = {};
        
        if (req.body.title) {
            query.title = req.body.title;
        }

        if (req.body.order) {
            query.order = req.body.order;
        }

        // if moving card up then pushing rest of cards down

        if (query.order < old_order) {
            for (let i = query.order; i < old_order; i++) {
                List.findOneAndUpdate({order: i}, {$inc: {order: 1}}, (err, moved_list) => {
                    last_moved = moved_list._id;
                    if (err) {
                        res.send(err);
                    }
                });
            }
        }

        // if moving card down then pushing rest of cards up

        if (query.order >= old_order) {
            for (let i = old_order; i <= query.order; i++) {
                List.findOneAndUpdate({order: i}, {$inc: {order: -1}}, (err, moved_list) => {
                    if (err) {
                        res.send(err);
                    }
                });
            }
        }

        // updating requested list using update query

        List.findByIdAndUpdate(req.params.listId, {$set: query}, (err, list) => {
            if (err) {
                res.send(err);
            }

            res.status(200).json({
                list: list._id,
                message: "List sucessfully updated!"
            });
        });
    });
});

router.get('/:listId', (req, res) => {

    // decoding token

    jwt.verify(req.headers.authorization, process.env.SECRET, (err, decoded) => {
        
        // returning requested list

        List.findById(req.params.listId, (err, list) => {
            if (err) {
                res.send(err);
            }

            res.status(200).json({
                title: list.title,
                order: list.order
            });
        });
    });
});

router.delete('/:listId', (req, res) => {
    
    // decoding token

    jwt.verify(req.headers.authorization, process.env.SECRET, (err, decoded) => {
        
        // removing requested list

        List.findByIdAndRemove(req.params.listId, (list_err, list) => {

            if (list_err) {
                res.send(list_err);
            }

            // finding every associated card and deleting each

            Card.find({listId: req.params.listId}, (cards_err, cards) => {
                cards.forEach(card => {
                    Card.findByIdAndRemove(card._id, (err, card_err) => {
                        if (err) {
                            res.send(err);
                        }
                    });
                });
            });

            res.status(200).json({
                message: "List successfully deleted!"
            });
        });
    });
});

router.get('/all', (req, res) => {

    // decoding token

    jwt.verify(req.headers.authorization, process.env.SECRET, (err, decoded) => {

        // returning all lists created by user

        List.find({creator: decoded.sub}, (err, lists) => {
            if (err) {
                res.send(err)
            }

            res.status(200).json({
                lists
            });
        });
    });
});

module.exports = router;
