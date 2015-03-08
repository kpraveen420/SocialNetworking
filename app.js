/**
 * Module dependencies.
 */

var express = require('express'), routes = require('./routes'), user = require('./routes/user'), http = require('http'), path = require('path');

var app = express();

// all environments
app.set('port', process.env.PORT || 3000);
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.bodyParser());
app.use(express.methodOverride());
app.use(app.router);
app.use(express.static(path.join(__dirname, 'public')));

// development only
if ('development' === app.get('env')) {
	app.use(express.errorHandler());
}

app.post('/signup', user.insertUser);

app.post('/signout', user.signout);

app.post('/login', user.validateUser);
app.post('/summary', user.insertSummary);
app.post('/experience', user.insertExperience);
app.post('/updateexperience', user.updateExperience);
app.post('/education', user.insertEducation);

app.post('/updateeducation', user.updateEducation);
// app.post('/sanitycheck',user.sanitycheck);
app.post('/sendinvitation', user.sendinvitation);
app.post('/acceptinvitation', user.acceptinvitation);
app.post('/rejectinvitation', user.rejectinvitation);
app.post('/removeconnection', user.removeconnection);
app.post('/search', user.searchMember);
app.post('/Connections', user.displayConnections);
app.post('/Invitations', user.dispalyInvitations);

var connPool = require('./routes/connections');
// initializing the pool size to 10 connections.
connPool.initializeConnPool(10);

http.createServer(app).listen(app.get('port'), function() {
	console.log('Express server listening on port ' + app.get('port'));
});
