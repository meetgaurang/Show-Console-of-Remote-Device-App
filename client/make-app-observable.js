function onPageLoad(){
	// Open connection with server
	var socketio = io.connect("10.19.6.64:1339");

	// Intercept console.log statements
	var originalConsole = {};
	originalConsole.log = console.log;
	var uniqueId = document.getElementsByName("gp-unique-tracker-id")[0].value;

	console.log = function (arg) {
		socketio.emit("console_log_from_observable_to_mediator", {uniqueId: uniqueId, message : arg});
		originalConsole.log.call(this, arg);
	};

	socketio.emit("unique_id_from_observable_to_mediator", uniqueId);
}

function logMessage(){
	var msg = document.getElementById("message_input").value;
	console.log(msg);
}

window.onload = onPageLoad;