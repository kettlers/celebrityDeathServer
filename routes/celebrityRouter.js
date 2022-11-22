const express = require('express');
const Celebrity = require('../models/celebrity');
//const authenticate = require('../authenticate')

const celebrityRouter = express.Router();

celebrityRouter.route('/')
    .get((req, res, next) => {
        Celebrity.find()
            /*
                //.populate('comments.author')
                .then(celebrities => {
                    res.statusCode = 200;
                    res.setHeader('Content-Type', 'application/json');
                    res.json(celebrities);
                })
            */
            .then(celebrities => {
                res.render("celebrities", { title: "Celebrities", celebrities: celebrities })
            })
            .catch(err => next(err));
    })
    .post((req, res, next) => {
        Celebrity.create(req.body)
            .then(celebrity => {
                console.log('Celebrity created ', celebrity);
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json(celebrity);
            })
            .catch(err => next(err));
    })
    .put((req, res) => {
        res.statusCode = 403;
        res.end('PUT operation not supported on /celebrities');
    })
    .delete((req, res, next) => {
        res.statusCode = 403;
        res.end('DELETE operation not supported on /celebrities');
    });

celebrityRouter.route('/:celebrityId')
    .get((req, res, next) => {
        Celebrity.findById(req.params.celebrityId)
            //.populate('comments.author')
            .then(celebrity => {
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json(celebrity);
            })
            .catch(err => next(err));
    })
    .post((req, res) => {
        res.statusCode = 403;
        res.end(`POST operation not supported on /celebrities/${req.params.celebrityId}`);
    })
    .put((req, res, next) => {
        Celebrity.findByIdAndUpdate(req.params.celebrityId, {
            $set: req.body
        }, { new: true })
            .then(celebrity => {
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json(celebrity);
            })
            .catch(err => next(err));
    })
    .delete((req, res, next) => {
        Celebrity.findByIdAndDelete(req.params.celebrityId)
            .then(response => {
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json(response);
            })
            .catch(err => next(err));
    });

/*
celebrityRouter.route('/:celebrityId/comments')
    .get((req, res, next) => {
        Celebrity.findById(req.params.celebrityId)
            .populate('comments.author')
            .then(celebrity => {
                if (celebrity) {
                    res.statusCode = 200;
                    res.setHeader('Content-Type', 'application/json');
                    res.json(celebrity.comments);
                } else {
                    err = new Error(`Celebrity ${req.params.celebrityId} not found`)
                    err.status = 404
                    return next(err)
                }
            })
            .catch(err => next(err));
    })
    .post((req, res, next) => {
        Celebrity.findById(req.params.celebrityId)
            .then(celebrity => {
                if (celebrity) {
                    req.body.author = req.user._id
                    celebrity.comments.push(req.body)
                    celebrity.save()
                        .then(celebrity => {
                            res.statusCode = 200;
                            res.setHeader('Content-Type', 'application/json');
                            res.json(celebrity);
                        })
                        .catch(err => next(err));
                } else {
                    err = new Error(`Celebrity ${req.params.celebrityId} not found`)
                    err.status = 404
                    return next(err)
                }
            })
            .catch(err => next(err));
    })
    .put((req, res) => {
        res.statusCode = 403;
        res.end(`PUT operation not supported on /celebrities/${req.params.celebrityId}/comments`);
    })
    .delete((req, res, next) => {
        Celebrity.findById(req.params.celebrityId)
            .then(celebrity => {
                if (celebrity) {
                    for (let i = (celebrity.comments.length - 1); i >= 0; i--) {
                        celebrity.comments.id(celebrity.comments[i]._id).remove();
                    }
                    celebrity.save()
                        .then(celebrity => {
                            res.statusCode = 200;
                            res.setHeader('Content-Type', 'application/json');
                            res.json(celebrity);
                        })
                        .catch(err => next(err));
                } else {
                    err = new Error(`Celebrity ${req.params.celebrityId} not found`);
                    err.status = 404;
                    return next(err);
                }
            })
            .catch(err => next(err));
    });

celebrityRouter.route('/:celebrityId/comments/:commentId')
    .get((req, res, next) => {
        Celebrity.findById(req.params.celebrityId)
            .populate('comments.author')
            .then(celebrity => {
                if (celebrity && celebrity.comments.id(req.params.commentId)) {
                    res.statusCode = 200;
                    res.setHeader('Content-Type', 'application/json');
                    res.json(celebrity.comments.id(req.params.commentId));
                } else if (!celebrity) {
                    err = new Error(`Celebrity ${req.params.celebrityId} not found`);
                    err.status = 404;
                    return next(err);
                } else {
                    err = new Error(`Comment ${req.params.commentId} not found`);
                    err.status = 404;
                    return next(err);
                }
            })
            .catch(err => next(err));
    })
    .post((req, res) => {
        res.statusCode = 403;
        res.end(`POST operation not supported on /celebrities/${req.params.celebrityId}/comments/${req.params.commentId}`);
    })
    .put((req, res, next) => {
        Celebrity.findById(req.params.celebrityId)
            .then(celebrity => {
                if (celebrity && celebrity.comments.id(req.params.commentId)) {
                    if ((celebrity.comments.id(req.params.commentId).author._id).equals(req.user._id)) {
                        if (req.body.rating) {
                            celebrity.comments.id(req.params.commentId).rating = req.body.rating;
                        }
                        if (req.body.text) {
                            celebrity.comments.id(req.params.commentId).text = req.body.text;
                        }
                        celebrity.save()
                            .then(celebrity => {
                                res.statusCode = 200;
                                res.setHeader('Content-Type', 'application/json');
                                res.json(celebrity);
                            })
                            .catch(err => next(err));
                    } else {
                        err = new Error('You are not the author of this comment!')
                        err.status = 403
                        return next(err)
                    }
                } else if (!celebrity) {
                    err = new Error(`Celebrity ${req.params.celebrityId} not found`);
                    err.status = 404;
                    return next(err);
                } else {
                    err = new Error(`Comment ${req.params.commentId} not found`);
                    err.status = 404;
                    return next(err);
                }
            })
            .catch(err => next(err));
    })
    .delete((req, res, next) => {
        Celebrity.findById(req.params.celebrityId)
            .then(celebrity => {
                if (celebrity && celebrity.comments.id(req.params.commentId)) {
                    if ((celebrity.comments.id(req.params.commentId).author._id).equals(req.user._id)) {
                        celebrity.comments.id(req.params.commentId).remove();
                        celebrity.save()
                            .then(celebrity => {
                                res.statusCode = 200;
                                res.setHeader('Content-Type', 'application/json');
                                res.json(celebrity);
                            })
                            .catch(err => next(err));
                    } else {
                        err = new Error('You are not the author of this comment!')
                        err.status = 403
                        return next(err)
                    }
                } else if (!celebrity) {
                    err = new Error(`Celebrity ${req.params.celebrityId} not found`);
                    err.status = 404;
                    return next(err);
                } else {
                    err = new Error(`Comment ${req.params.commentId} not found`);
                    err.status = 404;
                    return next(err);
                }
            })
            .catch(err => next(err));
    });
*/

module.exports = celebrityRouter;