//var ejs= require('ejs');
//var mysql = require('mysql');
//
//function getConnection(){
//	var connection = mysql.createConnection({
//	    host     : 'localhost',
//	    user     : 'root',
//	    password : '',
//	    database : 'test'
//	});
//	return connection;
//}
//exports.getConnection=getConnection;


var mysql = require('mysql');
var queue = require('queue');
var conPool = require('./enableConnectionPooling');

var connPool = new queue();

function dbConnect()
{
	var dbCon = mysql.createConnection({
		host     : 'localhost',
		user     : 'root',
		password : '',
		database: 'test'
	});
//	if(dbCon === undefined)
//		throw
	dbCon.connect();
	return dbCon;
}

function addConnection(dbCon)
{
	if(connPool !== null)
	{
		connPool.push(dbCon);
	}
}

function getConnection()
{
	if(connPool.length >= 1)
	{
//		connPool.reverse();
		var dbConn = connPool.pop();
//		connPool.reverse();
		return dbConn;
	}
}

function initializeConnPool(poolSize)
{
	if(connPool !== null)
	{
		connPool.start();
		for(var cnt = 0; cnt < poolSize; cnt++)
		{
			addConnection(dbConnect());
		}
	}
}


function getPoolSize()
{
	if(connPool !== null)
	{
		return connPool.length;
	}
}

function updateConnPool(updateSize)
{
	if(connPool !== null)
	{
		for(var cnt = 0; cnt < updateSize; cnt++)
		{
			addConnection(dbConnect());
		}
	}
}

function terminateConnPool()
{
	if(connPool !== null)
	{
		connPool.stop();
	}
}

/*DB helper functions*/
/*
 * This function return a database connection.
 * either a fresh connection if connection is 
 * not enabled or existing connection from
 * the pool.
 * it checks if the connection pooling is
 * enabled or not using the "isConnPool" variable
 * 
 * */
function getDBConn()
{
	var dbConn;
	if(conPool.isConnPool === true)
	{
		if(getPoolSize() <= 0)
		{
			updateConnPool(100);
		}
		dbConn = getConnection();
	}
	else
	{
		dbConn = dbConnect();
	}
    return dbConn;
}

/*
 * This function returns DB connection instance
 * to the connection pool after the query is 
 * executed or ends the DB connection if 
 * connection pooling is not enabled.
 * it checks if the connection pooling is
 * enabled or not using the "isConnPool" variable
 * 
 * */
function returnDBconn(dbConn)
{
	console.log(conPool.isConnPool);
	if(conPool.isConnPool === true)
	{
		addConnection(dbConn);
	}
	else
	{
		dbConn.end();
	}
}


exports.initializeConnPool = initializeConnPool;
//exports.addConnection = addConnection;
//exports.getConnection = getConnection;
//exports.terminateConnPool = terminateConnPool;
//exports.dbConnect = dbConnect;
//exports.getPoolSize = getPoolSize;
//exports.updateConnPool = updateConnPool;
exports.getDBConn = getDBConn;
exports.returnDBconn = returnDBconn;