var http = require('http'),
    fs = require('fs'),
    url = require('url'),
    bodyParser = require('body-parser');

//  choices = ["hello world", "goodbye world"];

var express = require('express');
var app = express();
app.use(express.static(__dirname + '/build/'));
app.use(bodyParser.urlencoded({
extended: false
}));

app.use(bodyParser.json());

app.set('view engine', 'pug');
//app.use(express.bodyParser());


var router = express.Router();
var path    = require("path");


function addPlayer(player, scor) {
	var mysql = require('mysql');


	var con = mysql.createConnection({
			host: "localhost",
			user: "root",
			password: "test1234",
			database: "joc"
	});

	console.log("Adding player %s", player);

	con.connect(function(err) {

		if (err) throw err;
		console.log("Connected!");
		var sql = 'INSERT IGNORE INTO player_scors (player, scor) VALUES ("' + player + '", ' + scor + ')';
			con.query(sql, function (err, result) {
				if (err) throw err;
				console.log("1 record inserted");
			});
		});

}

function getPlayerScores () {

	var MySql = require('sync-mysql');

	var con = new MySql({
			host: "localhost",
			user: "root",
			password: "test1234",
			database: "joc"
	});

	var sql = 'SELECT * FROM player_scors LIMIT 10';
	var result = con.query(sql);

	return result;
}

function updateScore(player) {

	console.log("Update score for %s", player);

	var MySql = require('sync-mysql');

	var con = new MySql({
			host: "localhost",
			user: "root",
			password: "test1234",
			database: "joc"
	});

	var sql = 'UPDATE player_scors SET scor = scor + 1 WHERE player = "' + player + '"';

	var result = con.query(sql);

	return result;
}

function getPlayerScoresHTML () {

	var scores = getPlayerScores();
	console.log("Here");
	console.log(scores);
	console.log("Here");

	var result = "";
	

	for (var i = 0, len = scores.length; i < len; i++) {
		result = result + ("<p>" + scores[i].player + " " +  scores[i].scor + "</p>");
	}

	return result;
}


router.get('/', function(req, res){
		res.render('login', {
title: 'Home'
});
		console.log("Miau");
		});


app.post('/login', function(req, res){
		var player1Name = req.body.player1name;
		var player2Name = req.body.player2name;
		console.log("post received: %s", player1Name);
		console.log("post received: %s", player2Name);
		addPlayer(player1Name, 0);
		addPlayer(player2Name, 0);
                return res.redirect(url.format({
                       pathname:"/play",
                       query: {
                          "player1name": player1Name,
                          "player2name": player2Name
                        }
                     }));
		});

app.get('/play', function (req, res) {

	var player1Name = req.query.player1name;
	var player2Name = req.query.player2name;
        console.warn('Play Page!');
        console.warn(player1Name);
        console.warn(player2Name);
        //res.sendFile(path.join(__dirname+'/build/play.html'));
        res.render('play', { player1: player1Name, player2: player2Name});

});



app.get('/get-score', function(req, res){

		result = getPlayerScoresHTML();

		res.send(result);
});

app.post('/update-score', function(req, res){
		var player = req.body.player;
		updateScore(player);
});


app.listen(80, function () {
		console.log('Enter http://localhost:80!');
		});
