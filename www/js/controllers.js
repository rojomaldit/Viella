angular.module('app.controllers', [])
  
.controller('reproducirCtrl', function($scope) {

})
   
.controller('grabarAudioCtrl', function($scope) {
	
    var fileAudio;
    var pathAudio;
    var media;


	function captureSuccess(mediaFiles){
		var i, lenAudio;

    	for (i = 0, lenAudio = mediaFiles.length; i < lenAudio; i += 1) {
        	fileAudio = mediaFiles[0].localURL;
        	pathAudio = mediaFiles[i].fullPath;
    	}	
	}

	function captureError () {
		// Nothing for now . . .
	}



	$scope.recordAudio = function() {
		navigator.device.capture.captureAudio(captureSuccess, captureError);
	}

	$scope.playAudio = function () {
		if (typeof fileAudio === "undefined") {
			navigator.notification.alert("Debe de grabar un audio primero . . .", null,"Error","Aceptar");
			return;
		}
		else if(Media.MEDIA_NONE == 0){
	        media = new Media(fileAudio, function(e) {  //solo crear objeto cuando no grabé ningún sonido
	        media.release();
	        }, function(err) {
	        console.log("media err", err);
	        });
    	}	

		media.play();
	}

	$scope.stopAudio = function () {
		media.stop();
	}

	$scope.pauseAudio = function () {
		media.pause();
	}
	
})
   
.controller('grabacionesCtrl', function($scope) {

   
})
       