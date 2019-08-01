var express = require('express');
var router = express.Router();
var models = require('./models');
var User = models.User;
var Goal = models.Goal; 
var Message = models.Message; 
var Rec = models.Rec;
var Score = models.Score; 
var mongoose = require('mongoose');


router.use(function(req, res, next){
    if (!req.user) {
      res.json({success: false, error: 'Not logged in user'});
    } 
    else { 
        return next(); 
    }
  });

router.post('/newgoal', function(req, res, next){
    let userId = req.user._id; 
    let newGoal = new Goal({
        user: userId, 
        content: req.body.content, 
        createdAt: new Date(), 
        recs: []
    }); 
    newGoal.save(function(err, result){
        if (err) {res.json({success: false, error : err})}
        if (!err) { 
            User.find({_id: userId}, function(err, user){
                if (err) {console.log(err) }
                if (!err) { 
                    user.goals.push(newGoal._id); 
                }
            })
            res.json({success: true, error: ''})}
    })
})

router.post('/:goalId/newrec', function(req, res, next){
    let goalId = req.params.goalId; 
    let newRec = new Rec ({
        user: req.user._id, 
        content: req.body.content, 
        date: new Date(), 
        goal: goalId, 
        likes: 0
    }); 

    newRec.save(function(err, res) {
        if (err) {res.json({success: false, error: err})}
        if (!err) {
            Goal.find({_id: goalId }, function(err, goal){
                if (err) { console.log(err)}
                if (!err) {
                    goal.recs.push(newRec._id);
                }
            })
            res.json({success: true, error: ''})}
    })
})


router.post('/:recId/addLike', function(err, res){
    let recId = req.params.recId; 
    Rec.findOne({_id: recId}, function(err, rec){
        if (err) {res.json({success: false, error: err}) } 
        if (!err){
            rec.likes = rec.likes + 1
            res.json({success: true, error: ''}); 
        }
    })
})

router.post('/:userId/newMessage', function(err, res){
    let recipientId = req.params.userId; 
    let senderId = req.user._id; 
    let newMessage = new Message({
        to: recipientId, 
        from: senderId, 
        sentAt: new Date(), 
        content: req.body.content
    }); 

    newMessage.save(function(err, res) {
        if (err) {
            res.json({success: false, error: err})
        }
        if (!err) {
            res.json({success: true, error: err})
        }
    }); 
})


router.post('/:userId/score', function(err, res){

    let user1 = req.user._id; 
    let user2 = req.params.userId; 

 
    Score.find({user1: user1 , user2: user2}, function(err, score){
        if (err) { 
            let newScore = new Score ({
            user1: req.user._id, 
            user2: req.params.userId, 
            score: 1}); 

            newScore.save(function(error, success){
                if (error) {res.json({success: false, error: error})}
                if (!error) { res.json({success: true, error:''})}
            })

        }
        if (!err) {
            score.score = score.score + 1
            res.json({success: true, error: ''})
        }
    })
})

module.exports = router; 