angular.module('app.controllers', [])
  
.controller('reproducirCtrl', function($scope) {

	$scope.createSoundsDir = function () {
		alert("hola ");
	}

})
   
.controller('grabarAudioCtrl', function($scope) {
	
    $scope.fileAudio;
    var pathAudio;
    var media;


	function captureSuccess(mediaFiles){

        fileAudio = mediaFiles[0].localURL;
        var extension = fileAudio.split(".").pop();
        var filepart = Date.now();
        var filename = filepart + "." + extension;

        var path = cordova.file.externalRootDirectory + "/Media";

        window.resolveLocalFileSystemURL(path, function(dirEntry) {
        	window.resolveLocalFileSystemURL(file,function(fileEntry) {
        		fileEntry.moveTo(dirEntry, filename, function(e) {
        			fileAudio = e.fullPath;
        			
        		}, function(e) {
        			alert("Error in move");
        		});
        	});
        });
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

	
	var myPath = cordova.file.externalRootDirectory + "/Media/";


	


	function readSuccess (entries) {
		
		var str = JSON.stringify(entries,null,4);
		alert(str);


		$scope.files = entries;
		$scope.$apply();

	}

	function readErr () {

		// in case of error
	}

	window.resolveLocalFileSystemURL (myPath,function(dirEntry) {

		var directoryReader = dirEntry.createReader();
		directoryReader.readEntries(readSuccess,readErr);

	});

	
	$scope.playRecordedAudio = function (name) {
		
		
		var recordAuxiliar = new Media(myPath + name, function(e) {  //solo crear objeto cuando no grabé ningún sonido
	        recordAuxiliar.release();
	        }, function(err) {
	        console.log("media err", err);
	        });
		recordAuxiliar.play();
   }


	function dltRecAudio (buttonIndex, name) {

	   	if (buttonIndex == 2) {
	   		window.resolveLocalFileSystemURL (myPath + name, function(fileEntry) {
				fileEntry.remove();
				window.resolveLocalFileSystemURL (myPath,function(dirEntry) {
					var directoryReader = dirEntry.createReader();
					directoryReader.readEntries(readSuccess,readErr);
				});
			});	
	   	}

	   	else {
	   		return;
	   	}
   }


	$scope.deleteRecordedAudio = function (name) {

	    navigator.notification.confirm(
	       '¿Estas Seguro?', 
	        function (buttonIndex) {
	            dltRecAudio(buttonIndex, name);
	        },            
	       'Confirmacion',           
	       ['Cancel','Aceptar']     
   		);
   }


   $scope.stopRecordedAudio = function (name) {
   		media.stop();
   }


















})

	


       