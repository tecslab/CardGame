var express = require('express');
var router = express.Router();

/* GET home page. */
/*player.post('/', function(req, res) {
  res.render('game', { title: 'Game', id: req.params.id });
});*/

router.post('/', function(req, res, next) {
	var id = req.body["user[id]"];
	var ipServer=process.env.IPSERVER;
	var portServer=process.env.PORTSERVER;
	res.render('game', { title: 'Game', id: id, ip:ipServer, port:portServer});
});


// game.get('/', function(req, res) {
//   res.send('wooorking');
// });

module.exports = router;
