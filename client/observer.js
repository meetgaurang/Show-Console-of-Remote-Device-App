// Open connection with server
var socketio = io.connect("10.19.6.64:1340");

$(document).ready(function(){
	if(localStorage){
		var observableAppId = localStorage.getItem('observableAppId')
		if(observableAppId !== ''){
			$('#statusMessage').html('Observing app with Id#' + observableAppId);
			$("#observableAppIdInput").val(observableAppId);
		}
	}
	setObservableAppId();
});

function setObservableAppId(){
	var observableAppId = $("#observableAppIdInput").val();
	if(observableAppId && observableAppId !== ''){
		$('#statusMessage').html('Observing app with Id#' + observableAppId);
		// Our socket.io code goes here
		socketio.on("data_from_mediator_to_observer"+observableAppId, function(data) {
			var currentTime = new Date();
			var timeStamp = '[' + currentTime.getHours() + ':' + currentTime.getMinutes() + ':' + currentTime.getSeconds() + ']';
			var message = timeStamp + ' ' + data['message'];
			$('#consolelog').html($('#consolelog').html() + '<br/>' + message);
		});
	}

	// Set ID into storage so that it can be used even when the page is refreshed..
	if(localStorage){
		localStorage.setItem('observableAppId', observableAppId);
	}
};