var ejs = require("ejs");
var mysql = require('./connections');
var exce = require('./customExceptions');

/*******************************************************************************
 * 
 * Inserts sign up data into DB
 * 
 * 
 */
exports.insertUser = function(req, res) {

	var fname = req.param("fname"), lname = req.param("lname");
	var email = req.param("email"), pswd = req.param("pswd");
	if ((fname !== undefined && pswd !== undefined && lname !== undefined && email !== undefined)
			&& (fname !== "" && pswd !== "" && lname !== "" && email !== "")) {
		var data = {
			user_id : null,
			first_name : fname,
			last_name : lname,
			email_id : email,
			password : pswd,
			summary : null,
			lastLogin : null
		};
		var dbConn = mysql.getDBConn();
		var query = dbConn.query("INSERT INTO users set ? ", data, function(
				err, rows) {
			if (err) {
				console.log(err);
				exce.mySqlException(err, res);
			} else {

				res.send({
					"Status" : "Success"
				});
				console.log("succeess");
			}
			mysql.returnDBconn(dbConn);
		});
	} else {
		exce.customException('Please fill all the manidatory fields', res);
	}
};

/*******************************************************************************
 * 
 * Add Last login to users table while signing out
 * 
 * 
 */
// TODO both validations and sessions
exports.signout = function(req, res) {

	var userid = req.param("UserId");

	if ((userid !== undefined && userid !== "")) {
		var data = {
			lastLogin : new Date()
		};
		var dbConn = mysql.getDBConn();
		var query = dbConn.query("Update users set ? where user_id=? ", [ data,
				userid ], function(err, rows) {
			if (err) {
				console.log(err);
				exce.mySqlException(err,res);
				//If no sql specific ecxeption then control comes to below statement.
				exce.customException(
						'Something went wrond. Please try again later', res);
			} else {
				if (rows.affectedRows > 0)
					res.send({
						"Status" : "Success"
					});
				else {
					exce.customException('User already logged out.', res);

				}

			}
			mysql.returnDBconn(dbConn);
		});
		console.log(query);
	}
};

/**
 * For login
 */
// TODO sessions
exports.validateUser = function(req, res) {
	var pwd = req.param("password");
	var email = req.param("email");

	if ((pwd !== undefined && email !== undefined)
			&& (pwd !== "" && email !== "")) {
		var dbConn = mysql.getDBConn();
		var query = dbConn.query(
				"select user_id from users where email_id=? and password=?", [
						email, pwd ], function(err, rows) {
					console.log(rows)

					if (err) {
						console.log(err);
						exce.mySqlException(err,res);
						//If no sql specific ecxeption then control comes to below statement.
						exce.customException(
								'Something went wrond. Please try again later',
								res);
					} else {
						if (rows.length >= 1)
							res.send({
								"userId" : rows[0].user_id,
								"lastLogin" : rows[0].lastLogin
							});
						else
							exce.customException('Invalid login details', res);
					}
					mysql.returnDBconn(dbConn);
				});
	} else {
		exce.customException('Please fill all the manidatory fields', res);
	}
};

/*******************************************************************************
 * 
 * Inserts Summary Info into DB
 * 
 * 
 */

exports.insertSummary = function(req, res) {

	var summary = req.param("summary"); // getting parameter from http request
	var userId = req.param("userId"); // getting parameter from http request
	if ((summary !== undefined && userId !== undefined)
			&& (summary !== "" && userId !== "")) {
		var dbConn = mysql.getDBConn();
		var query = dbConn.query("update users set ? where user_id=?", [ {
			summary : summary
		}, userId ], function(err, rows) {
			if (err) {
				console.log(err);
				exce.mySqlException(err,res);
				//If no sql specific ecxeption then control comes to below statement.
				exce.customException(
						'Something went wrond. Please try again later', res);
			} else {
				if (rows.length >= 1)
					res.send({
						"Status" : "Success"
					});
				else
					res.send({
						"error" : "Invalid user_id"
					});
			}
			mysql.returnDBconn(dbConn);
		});
	} else {
		exce.customException('Please fill all the manidatory fields', res);
	}
};

/*******************************************************************************
 * 
 * Inserts Experience Info into DB
 * 
 * 
 */

exports.insertExperience = function(req, res) {

	var company = req.param("companyName"); // getting company name parameter
	// from http request
	var title = req.param("title"); // getting job title from http request
	var location = req.param("location") === undefined ? null : req
			.param("location"); // not a manadatory field
	var strDate = req.param("startdate"), endDate = req.param("enddate");
	var desc = req.param("description") === undefined ? null : req
			.param("description"); // not a manadatory field
	var uid = req.param("userId");

	if ((company !== undefined && title !== undefined && strDate !== undefined && uid !== undefined)
			&& (company !== "" && title !== "" && strDate !== "" && uid !== "")) {
		var data = {
			idExperience : null,
			company_name : company,
			user_id : uid,
			title : title,
			location : location,
			start_date : strDate,
			end_date : endDate,
			description : desc
		};
		var dbConn = mysql.getDBConn();
		var query = dbConn.query("INSERT INTO experience set ? ", data,
				function(err, rows) {
					if (err) {
						console.log(err);
						exce.mySqlException(err, res);
					} else {
						res.send({
							"Status" : "Success"
						});
					}
					mysql.returnDBconn(dbConn);
				});

	} else {
		exce.customException('Please fill all the manidatory fields', res);
	}
};

/*******************************************************************************
 * 
 * Update Experience Info in DB
 * 
 * 
 */

exports.updateExperience = function(req, res) {

	var company = req.param("companyName"); // getting company name parameter
	// from http request
	var title = req.param("title"); // getting job title from http request
	var location = req.param("location") === undefined ? null : req
			.param("location"); // not a manadatory field
	var strDate = req.param("startdate"), endDate = req.param("enddate");
	var desc = req.param("description") === undefined ? null : req
			.param("description"); // not a manadatory field
	var uid = req.param("userId");
	var idExperience = req.param("expId");

	if ((company !== undefined && company !== "")
			&& (uid !== undefined && uid !== "")
			&& (title !== undefined && title !== "")
			&& (idExperience !== undefined && idExperience !== "")
			&& (strDate !== undefined && strDate !== "")) {

		var dbConn = mysql.getDBConn();
		var query = dbConn.query(
				"update experience set ? where idExperience=?", [ {
					company_name : company,
					title : title,
					location : location,
					start_date : strDate,
					end_date : endDate,
					description : desc
				}, idExperience ], function(err, rows) {

					if (err) {
						console.log(err);
						exce.mySqlException(err,res);
						//If no sql specific ecxeption then control comes to below statement.
						exce.customException(
								'Something went wrond. Please try again later',
								res);
					} else {
						console.log(rows);
						if (rows.affectedRows > 0)
							res.send({
								"Status" : "Success"
							});
						else
							exce
									.customException('Invalid exprerience id.',
											res);
					}
					mysql.returnDBconn(dbConn);
				});
	} else {
		exce.customException('Please fill all the manidatory fields', res);
	}
};

/*******************************************************************************
 * 
 * Inserts Education Info into DB
 * 
 * 
 */

/*******************************************************************************
 * 
 * Inserts Education Info into DB
 * 
 * 
 */

exports.insertEducation = function(req, res) {

	var level = req.param("level") === undefined ? null : req.param("univName");
	var univ_name = req.param("univName");
	var field = req.param("studyfield") === undefined ? null : req
			.param("studyfield"); // not a manadatory field
	var grade = req.param("grade") === undefined ? null : req.param("grade"); // not
	// a
	// manadatory
	// field
	var strDate = req.param("startdate"), endDate = req.param("enddate");
	var desc = req.param("description") === undefined ? null : req
			.param("description"); // not a manadatory field
	var uid = req.param("userId");

	if ((univ_name !== undefined && uid !== undefined && strDate !== undefined)
			&& (univ_name !== "" && uid !== "" && strDate !== "")) {
		var data = {
			idEducation : null,
			level : level,
			univ_name : univ_name,
			field : field,
			grade : grade,
			start_date : strDate,
			end_date : endDate,
			description : desc,
			user_id : uid
		};
		var dbConn = mysql.getDBConn();
		var query = dbConn.query("INSERT INTO education set ? ", data,
				function(err, rows) {
					if (err) {
						console.log(err);
						exce.mySqlException(err,res);
						//If no sql specific ecxeption then control comes to below statement.
						exce.mySqlException(err, res);
					} else {
						if (rows.affectedRows > 0)
							res.send({
								"Status" : "Success"
							});
						else
							exce.customException('Invalid user id.', res);
					}
					mysql.returnDBconn(dbConn);
				});

	} else {
		exce.customException('Please fill all the manidatory fields', res);
	}
};

/*******************************************************************************
 * 
 * Update Eduction Info in DB
 * 
 * 
 */

exports.updateEducation = function(req, res) {

	var level = req.param("level") === undefined ? null : req.param("level");
	var univ_name = req.param("univName");
	var field = req.param("studyfield") === undefined ? null : req
			.param("studyfield"); // not a manadatory field
	var grade = req.param("grade") === undefined ? null : req.param("grade"); // not
	// a
	// manadatory
	// field
	var strDate = req.param("startdate"), endDate = req.param("enddate");
	var desc = req.param("description") === undefined ? null : req
			.param("description"); // not a manadatory field
	var uid = req.param("userId");
	var idEducation = req.param("educationId");

	if ((univ_name !== undefined && idEducation !== undefined)
			&& (univ_name !== "" && idEducation !== "")) {
		var dbConn = mysql.getDBConn();
		var query = dbConn
				.query(
						"Update education set ? where idEducation=? ",
						[ {
							level : level,
							univ_name : univ_name,
							field : field,
							grade : grade,
							start_date : strDate,
							end_date : endDate,
							description : desc
						}, idEducation ],
						function(err, rows) {
							if (err) {
								console.log(err);
								exce.mySqlException(err, res);
							} else {
								if (rows.affectedRows > 0)
									res.send({
										"Status" : "Success"
									});
								else
									exce
											.customException(
													'Something went wrond. Please try again later.',
													res);
							}
							mysql.returnDBconn(dbConn);
						});
	} else {
		exce.customException('Please fill all the manidatory fields', res);
	}
};

/*******************************************************************************
 * 
 * send invitations
 * 
 * 
 */

exports.sendinvitation = function(req, res) {

	var toId = req.param("receiver");
	var fromId = req.param("sender");

	if ((toId !== undefined && fromId !== undefined)
			&& (toId !== "" && fromId !== "")) {
		if (checkConnectionSttus(req, res) === -1) {
			var data = {
				idConnection : null,
				to_user_id : toId,
				from_user_id : fromId
			};
			var dbConn = mysql.getDBConn();
			var query = dbConn
					.query(
							"INSERT INTO connections set ? ",
							data,
							function(err, rows) {
								if (err) {
									console.log(err);
									exce.mySqlException(err,res);
									//If no sql specific ecxeption then control comes to below statement.
									exce
											.customException(
													'Something went wrond. Please try again later',
													res);
								} else {
									res.send({
										"Status" : "Success"
									});
								}
								mysql.returnDBconn(dbConn);
							});
		} else {
			exce.customException('Conncetion request already sent.', res);
		}

	} else {
		exce.customException('Please fill all the manidatory fields', res);
	}
};

/**
 * Checks for duplicate invitations.
 * 
 * @param req
 * @param res
 */
function checkDuplicateInvi(req, res) {

	var toId = req.param("receiver");
	var fromId = req.param("sender");

	if ((toId !== undefined && fromId !== undefined)
			&& (toId !== "" && fromId !== "")) {
		var data = {
			to_user_id : fromId,
			from_user_id : toId
		};
		var dbConn = mysql.getDBConn();
		var query = dbConn
				.query(
						"SELECT * FROM connections set ? ",
						data,
						function(err, rows) {
							if (err) {
								console.log(err);
								exce.mySqlException(err,res);
								//If no sql specific ecxeption then control comes to below statement.
								exce
										.customException(
												'Something went wrond. Please try again later',
												res);
							} else {
								if (rows.length !== 0) {
									exce
											.customException(
													'Conection request pending. Another request can\'t be sent now.',
													res);
								}
							}
							mysql.returnDBconn(dbConn);
						});
	} else {
		exce.customException('Please fill all the manidatory fields', res);
	}
}

/**
 * Checks for duplicate invitations.
 * 
 * @param req
 * @param res
 */
function checkConnectionSttus(req, res) {

	var toId = req.param("receiver");
	var fromId = req.param("sender");
	console.log(toId);
	if ((toId !== undefined && fromId !== undefined)
			&& (toId !== "" && fromId !== "")) {
		var data = {
			to_user_id : toId,
			from_user_id : fromId
		};
		var dbConn = mysql.getDBConn();
		var query = dbConn
				.query(
						"SELECT * FROM connections where set ? ",
						data,
						function(err, rows) {
							console.log(509);
							if (err) {
								console.log(err);
								exce.mySqlException(err,res);
								//If no sql specific ecxeption then control comes to below statement.
								exce
										.customException(
												'Something went wrond. Please try again later',
												res);
							} else {
								console.log(rows);
								if (rows.length > 0) {
									mysql.returnDBconn(dbConn);
									return rows[0].connection_status;
								} else {

									var data = {
										to_user_id : fromId,
										from_user_id : toId
									};
									var query = dbConn
											.query(
													"SELECT * FROM connections where set ? ",
													data,
													function(err, rows) {
														if (err) {
															console.log(err);
															exce.mySqlException(err,res);
															//If no sql specific ecxeption then control comes to below statement.
															exce
																	.customException(
																			'Something went wrond. Please try again later',
																			res);
														} else {
															mysql
																	.returnDBconn(dbConn);
															if (rows.length > 0) {
																return rows[0].connection_status;
															} else {
																return -1;
															}
														}
													});
								}
							}
							mysql.returnDBconn(dbConn);
						});
	} else {
		exce.customException('Please fill all the manidatory fields', res);
	}
}

/*******************************************************************************
 * 
 * Accept invitations
 * 
 * 
 */

exports.acceptinvitation = function(req, res) {

//	var idConnection = req.param("ConnectionId");
	var toId = req.param("receiver");
	var fromId = req.param("sender");

	if ((toId !== undefined && fromId !== undefined)
			&& (toId !== "" && fromId !== "")) {
		var connectionStatus = checkConnectionSttus(req, res);
		console.log(connectionStatus);
		if (connectionStatus === 0) {
			var data = {
				connection_status : 1
			};
			
			var conn = {
					to_user_id : toId,
					from_user_id : fromId
				};
			var dbConn = mysql.getDBConn();
			var query = dbConn
					.query(
							"Update connections set ? where set ? ",
							[ data, conn ],
							function(err, rows) {
								if (err) {
									console.log(err);
									exce.mySqlException(err,res);
									//If no sql specific ecxeption then control comes to below statement.
									exce
											.customException(
													'Something went wrond. Please try again later',
													res);
								} else {
									res.send({
										"Status" : "Success"
									});
								}
								mysql.returnDBconn(dbConn);
							});
		} else if (connectionStatus === -1){
			exce.customException('No connection request is pending. Please send a connection request.', res);
		} else{
			exce.customException('User already in your connections.', res);
		}
	} else {
		exce.customException('Please fill all the manidatory fields', res);
	}
};

/*******************************************************************************
 * 
 * Remove Invitation
 * 
 * 
 */

exports.rejectinvitation = function(req, res) {

	var idConnection = req.param("ConnectionId");

	if ((idConnection !== undefined && idConnection !== "")) {
		var data = {
			flag_connection : 0
		};
		var dbConn = mysql.getDBConn();
		var query = dbConn.query(
				"DELETE FROM connections  WHERE idConnection = ? ", [ data,
						idConnection ], function(err, rows) {
					if (err) {
						console.log(err);
						exce.mySqlException(err,res);
						//If no sql specific ecxeption then control comes to below statement.
						exce.customException(
								'Something went wrond. Please try again later',
								res);
					} else {
						res.send({
							"Status" : "Success"
						});
					}
					mysql.returnDBconn(dbConn);
				});

	} else {
		exce.customException('Please fill all the manidatory fields', res);
	}
};

/*******************************************************************************
 * 
 * Remove Connection
 * 
 * 
 */

exports.removeconnection = function(req, res) {

	var idConnection = req.param("ConnectionId");

	if ((idConnection !== undefined && idConnection !== "")) {
		var data = {
			connection_status : 0,
			flag_connection : 0
		};
		var dbConn = mysql.getDBConn();
		var query = dbConn.query(
				"DELETE FROM connections  WHERE idConnection = ? ", [ data,
						idConnection ], function(err, rows) {
					if (err) {
						console.log(err);
						exce.mySqlException(err,res);
						//If no sql specific ecxeption then control comes to below statement.
						exce.customException(
								'Something went wrond. Please try again later',
								res);
					} else {
						res.send({
							"Status" : "Success"
						});
					}
					mysql.returnDBconn(dbConn);
				});

	} else {
		exce.customException('Please fill all the manidatory fields', res);
	}
};

exports.searchMember = function(req, res) {

	var text = req.param("enteredText");

	var data = {
		connection_status : 0,
		flag_connection : 0
	};
	var dbConn = mysql.getDBConn();
	var query = dbConn
			.query(
					"select * FROM users  WHERE first_name = ? or last_name=? or email_id=? ",
					[ text + "%", text + "%", text + "%" ],
					function(err, rows) {
						if (err) {
							console.log(err);
							exce.mySqlException(err,res);
							//If no sql specific ecxeption then control comes to below statement.
							exce
									.customException(
											'Something went wrond. Please try again later',
											res);
						} else {
							res.send({
								"SearchResult" : rows
							});
						}
						mysql.returnDBconn(dbConn);
					});

};

exports.displayConnections = function(req, res) {

	var id = req.param("userid");

	var data = {
		connection_status : 0,
		flag_connection : 0
	};
	var dbConn = mysql.getDBConn();
	var query = dbConn
			.query(
					"select * FROM connections WHERE to_user_id  = ? and flag_connection=? and connection_status=?",
					[ id, 1, 1 ],
					function(err, rows) {
						if (err) {
							console.log(err);
							exce.mySqlException(err,res);
							//If no sql specific ecxeption then control comes to below statement.
							exce
									.customException(
											'Something went wrond. Please try again later',
											res);
						} else {
							res.send({
								"CoonectionsList" : rows
							});
						}
						mysql.returnDBconn(dbConn);
					});

};

exports.dispalyInvitations = function(req, res) {

	var id = req.param("userid");
	var data = {
		connection_status : 0,
		flag_connection : 0
	};
	var dbConn = mysql.getDBConn();
	var query = dbConn
			.query(
					"select * FROM connections WHERE to_user_id  = ? and flag_connection=? and connection_status=?",
					[ id, 1, 0 ],
					function(err, rows) {
						if (err) {
							console.log(err);
							exce.mySqlException(err,res);
							//If no sql specific ecxeption then control comes to below statement.
							exce
									.customException(
											'Something went wrond. Please try again later',
											res);
						} else {
							res.send({
								"CoonectionsList" : rows
							});
						}
						mysql.returnDBconn(dbConn);
					});

};
