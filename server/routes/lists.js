const express = require('express');
const jwt = require('jsonwebtoken');
const List = require('mongoose').model('List');
const Card = require('mongoose').model('Card');
const router = new express.Router();
require('dotenv').config();

router.get('/all', (req, res) => {
    jwt.verify(req.headers.authorization, process.env.SECRET, (err, decoded) => {
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

router.post('/', (req, res) => {
    let token = req.body.token;

    if (req.headers.authorization) {
        token = req.headers.authorization;
    }

    jwt.verify(token, process.env.SECRET, (err, decoded) => {
        List.count({}, (err, count) => {
            const request = {
                title: req.body.title,
                order: req.body.order,
                creator: decoded.sub,
                order: count
            };

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

router.post('/edit/:listId', (req, res) => {
    List.findById(req.params.listId, (err, list) => {
        const old_order = list.order;
        let last_moved = "";
        let query = {};
        
        if (req.body.title) {
            query.title = req.body.title;
        }

        if (req.body.order) {
            query.order = req.body.order;
        }

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

        if (query.order >= old_order) {
            for (let i = old_order; i <= query.order; i++) {
                List.findOneAndUpdate({order: i}, {$inc: {order: -1}}, (err, moved_list) => {
                    if (err) {
                        res.send(err);
                    }
                });
            }
        }

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
    jwt.verify(req.headers.authorization, process.env.SECRET, (err, decoded) => {
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
    jwt.verify(req.headers.authorization, process.env.SECRET, (err, decoded) => {
        List.findByIdAndRemove(req.params.listId, (list_err, list) => {
            Card.find({listId: req.params.listId}, (cards_err, cards) => {
                cards.forEach(card => {
                    Card.findByIdAndRemove(card._id, (err, card_err) => {
                        if (err) {
                            res.send(err);
                        }
                    });
                });
            });

            if (list_err) {
                res.send(list_err);
            }

            res.status(200).json({
                message: "List successfully deleted!"
            });
        });
    });
});

module.exports = router;
