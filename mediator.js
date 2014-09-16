var http = require('http'),
fs = require('fs');

// Mediator opening the port 1338 for allowing access to static resource as a normal web server
	var connect = require('connect');
	connect().use(connect.static('client')).listen(1338);
	console.log('Listening for web page request at http://10.19.6.64/:1338/');

/*// Mediator opening the port 1340 to have communication with clients who wants to display the clients-to-be-intercepted list
	var viewClientListApp = http.createServer(function (request, response) {}).listen(1340);
	console.log('Server running at http://10.19.6.64/:1340/');

	var viewClientListIO = require('socket.io').listen(viewClientListApp);
	viewClientListIO.sockets.on('connection', function(socket) {
		viewClientListIO.sockets.emit("client_added", observableAppUniqueIdArray);
	});*/

	var observableAppUniqueIdArray = [];

// Mediator opening Port 1339 to listen for the connection request coming from observable apps
	var channelToObservableApp = http.createServer(function (request, response) {}).listen(1339);
	console.log('Mediator is listening at port 1339 for the incoming connection from Observable web app..');
	var observableAppIO = require('socket.io').listen(channelToObservableApp);

// Mediator opening Port 1337 to send data to Observer app
	var channelToObserver = http.createServer(function (request, response) {}).listen(1340);
	console.log('Mediator opened port 1340 in order to send data to Observer..');
	var observerIO = require('socket.io').listen(channelToObserver);

	observableAppIO.sockets.on('connection', function(socket) {
	    // Whenever observable app loads, it sends the unique id to mediator in order to register self
	    socket.on('unique_id_from_observable_to_mediator', function(uniqueId) {
	    	if(uniqueId == undefined){
	    		uniqueId = socket.handshake.address.address;
	    	}
 			var doesIdExist = false;
			//var connectionRequestFromId = socket.handshake.address.address;
			for(var i=0; i<observableAppUniqueIdArray.length; i++){
				if(observableAppUniqueIdArray[i][0] === uniqueId){
					doesIdExist = true;
					break;
				}
			}
			if(!doesIdExist){
				observableAppUniqueIdArray.push(new Array(uniqueId));
				//Notify Show_All_Client page that one Client_To_Be_Monitored has been added..
				//viewClientListIO.sockets.emit("client_added", observableAppUniqueIdArray);
			}	    	
	    });
	    
	    // Whenever console.log happens in observable app, it sends the message to mediator
	    socket.on('console_log_from_observable_to_mediator', function(data) {
			observerIO.sockets.emit("data_from_mediator_to_observer" + data["uniqueId"], { uniqueId: data["uniqueId"], message: data["message"] });
			console.log(data["uniqueId"]+'  '+data["message"]);
	    });		
	});