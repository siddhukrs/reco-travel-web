var config = require('./config.js');
var express = require('express');
var app = express();
var ig = require('instagram-node').instagram();
ig.use({
    client_id: config.clientId,
    client_secret: config.clientSecret,
});

var redirectUri = 'http://localhost:8080/handleAuth';
var accessToken;


app.get('/authorize', function(req, res){
    res.redirect(ig.get_authorization_url(redirectUri, { scope : ['public_content','likes']}) );
});

app.get('/handleAuth', function(req, res){
    ig.authorize_user(req.query.code, redirectUri, function(err, result){
        if(err) res.send( err );
        accessToken = result.access_token;
        console.log(result.access_token);
        res.redirect('/');
    });
});

app.get('/', function(req, res){
    ig.use({
     access_token : accessToken
    });

    ig.user_media_recent(accessToken.split('.')[0], function(err, result, pagination, remaining, limit) {
        if(err) res.json(err);
        res.send(result);
    });
});

app.listen(8080);