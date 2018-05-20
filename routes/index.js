var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', {
    title: 'STEEM-Ray',
    dev: req.app.get('env') === 'development'
  });
});

module.exports = router;
