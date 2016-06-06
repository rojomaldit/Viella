    var fileAudio;
    var pathAudio;
    var fileImg;
    var pathImg;


	//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    function onLoad() {
        document.addEventListener("deviceready", onDeviceReady, false);
    }

	//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    function onDeviceReady() {
        alert("Hola!");
    }
	//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
	function alertDismissed() {
	    //
	}

	//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
	function seeNot() {
	    navigator.notification.alert('error 404  not found',  alertDismissed,  'Fatal Error','Accept');
	}
	//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
	function onDialog (){
		navigator.notification.prompt ('¿Como te Llamas?', onPrompt, 'Im a Title', ["Cancel","Accept"], 'Inserte su nombre aqui'  );

	}
	//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////77
	function onPrompt (results){
		var btn = results.buttonIndex;
		if (btn==2) {	

			alert("Hola " + results.input1);	
		}
		else
		{
			alert (" Al cabo que ni queria... ");
		}
	}
	//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
	function vibrate (){
		navigator.vibrate(5000);
	}
	//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
	function captureSuccess(mediaFiles){
		var i, lenAudio;

    	for (i = 0, lenAudio = mediaFiles.length; i < lenAudio; i += 1) {
        	fileAudio = mediaFiles[0].localURL;
        	pathAudio = mediaFiles[i].fullPath;
    	}	
	}
	
	function captureError(){
 		alert("Grabado Exitoso");
	}
	function Record(){
		navigator.device.capture.captureAudio(captureSuccess, captureError);
	}

	function mediaPlay(){
		
		var media = new Media (pathAudio);
		media.play;
	}


	//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////	


	var pictureSuccess = function(mediaFiles) {
	    var j, lenImg;
	    for (j = 0, lenImg = mediaFiles.length; j < lenImg; j += 1) {
        	fileImg = mediaFiles[0].localURL;	        
	        pathImg = mediaFiles[j].fullPath;
	    }

	    $("#imgSource").attr("src" , pathImg);

	};

	
	var pictureError = function(error) {
		navigator.notification.alert('error 404  not found',  alertDismissed,  'Fatal Error','Accept');
	};

	
	function takePicture(){
		navigator.device.capture.captureImage(pictureSuccess, pictureError);
	}

	function deviceFeatures(){
		$("#OperativeSystem").html(device.platform);
		$("#SystemVersion").html( device.version );
		$("#DeviceModel").html( device.model );
		$("#SystemSerial").html(device.serial );
	}


	///////////////////////////////////////////////////////////////////////////////////////////////////////////////////	
	function onSuccess(acceleration) 
	{
    	$("#AccelerationX").html(acceleration.x );
		$("#AccelerationY").html(acceleration.y );
		$("#AccelerationZ").html(acceleration.z );
		$("#Timestamp").html(acceleration.timestamp );
	}

	function onError() {
    	alert('onError!');
	}

	function options (){
		//
	}


	function deviceMotion() {
		var options = { frequency: 300 };
		navigator.accelerometer.watchAcceleration(onSuccess, onError, options);
	}

///////////////////////////////////////////////////////////////////////////////////////

	function initMap() {
	  // Create a map object and specify the DOM element for display.
	  var map = new google.maps.Map(document.getElementById('map'), {
	    center: {lat: -34.397, lng: 150.644},
	    scrollwheel: false,
	    zoom: 8
	  });
	}







