angular.module('app.controllers', [])
  
.controller('reproducirCtrl', function($scope) {
$scope.images = [];

$scope.loadImages = function(){
	for (var i = 0; i < 100; i++) {
		if(i % 3 === 0){
			$scope.images.push({id:i, src:"img/metallica.jpg"});
		}
		else if (i % 2 === 0){
			$scope.images.push({id:i, src:"img/thepolice.jpg"});
		}
		else{
			$scope.images.push({id:i, src:"img/vanhalen.jpg"});
		}
		
	};
}

})
   
.controller('grabarAudioCtrl', function($scope) {
	var audioFile;
	var media;
	var myMedia;

	//Asigno los valores de las variables si la grabación anduvo bien 
	var captureSuccess = function(mediaFiles) {
      var file = mediaFiles[0].localURL;
      var extension = file.split(".").pop();
      var filepart = Date.now();
      var filename = filepart + "." + extension;

      var path = cordova.file.externalRootDirectory + "/sonidosproa";  
      window.resolveLocalFileSystemURL(path, function(dirEntry) {
        window.resolveLocalFileSystemURL(file, function(fileEntry) {
          fileEntry.moveTo(dirEntry, filename, function(e){
            audioFile = e.fullPath;
          }, function(e) {
            alert('Error durante la copia del archivo de audio');
          });
        }); 
	    });
  	}
	// Capturo errores si falló la grabación del audio
	var captureError = function(error) {
    	//navigator.notification.alert('Error code: ' + error.code, null, 'Capture Error');
	};

	$scope.reproducirAudioGrabado = function(){
		if (typeof audioFile === "undefined") {
    		navigator.notification.alert("Primero debe grabar un Audio.", null, "Atención", "Aceptar");
			return; 
    	}
    	else if(Media.MEDIA_NONE == 0){
        	media = new Media(audioFile, function(e) {  //solo crear objeto cuando no grabé ningún sonido
        	media.release();
        	}, function(err) {
        	console.log("media err", err);
        });
    	}
    	media.play();
	}


	onSuccessRecord = function() {
    	alert("recordAudio():Audio Success");
	}


	onErrorRecord = function(error) {
    	alert('code: '    + error.code    + '\n' + 'message: ' + error.message + '\n');
	}

	gotFileSystem = function(fileSystem){
    	fileSystem.root.getFile("filename",{create:false,exclusive:false}, gotFileEntry, fileFail);
	}

	gotFileEntry = function(fileEntry){
    	fileEntry.file(gotFile,fileFail);
	}

	gotFile = function(file){
    	file.type='audio/wav';
    	readAsDataURL(file);
	}

	readAsDataURL = function(file){
    	console.log('reading as url');
    	var reader = new FileReader();
    	reader.onloadend=function(evt){
        	alert("Read as data url");
          	alert('base64 of audio'+evt.target.result)                  
        };
    	reader.readAsDataURL(file);
	}

	fileFail = function(error){
    	alert(error.code);
    	alert("fail " +  error.code);
	}

	// file reading
	getAudioBase = function(){
		window.requestFileSystem(LocalFileSystem.PERSISTENT,0,gotFileSystem,fileFail); 
	};

	//Capturo audio 
	$scope.capturarAudio = function(){
		var audioSrc = "migrabacion.wav";
    	myMedia = new Media(audioSrc, onSuccessRecord, onErrorRecord);
    	// Record audio
    	myMedia.startRecord();
	}

	function pararAudio(){
		alert("Frenando grabación");
    	myMedia.stopRecord();  
        //function to read file and get base64
		  getAudioBase();
	}


	window.requestFileSystem(LocalFileSystem.PERSISTENT, 0, onRequestFileSystemSuccess, null); 

	function onRequestFileSystemSuccess(fileSystem) { 
    	var entry=fileSystem.root; 
        entry.getDirectory("sonidosproa", {create: true, exclusive: false}, onGetDirectorySuccess, onGetDirectoryFail); 
	}

	function onGetDirectorySuccess(dir) { 
    	console.log("Se a creado el directorio " + dir.name); 
	} 

	function onGetDirectoryFail(error) { 
    	console.log("Error creando el directorio " + error.code); 
	} 
})
   
.controller('grabacionesCtrl', function($scope) {
    /*$scope.myFilter = function(file){
      
    };*/

    var onSuccessCallback = function(entries){
      //var str = JSON.stringify(entries, null, 4);
      $scope.files = entries;
      $scope.$apply();
    }

    var onFailCallback = function(){
    // In case of error
    }

    

    var myPath = cordova.file.externalRootDirectory + "/sonidosproa";
    window.resolveLocalFileSystemURL(myPath, function (dirEntry) {
    var directoryReader = dirEntry.createReader();
    directoryReader.readEntries(onSuccessCallback,onFailCallback);
    });      

    /*$scope.$watch('files', function (newValue, oldValue) {

      if(newValue!=oldValue){
        $scope.files.push(entries);
      }
      else{
        //alert('Cargando listado de grabaciones');

      }
    });*/
    //reproduzco un audio grabado determinado
    $scope.playRecordedAudio = function(name){

        my_media = new Media(cordova.file.externalRootDirectory + "/sonidosproa/" + name, function(e) { 
          my_media.release();
        }, function(err) {
          console.log("media err", err);
        });
        my_media.play();


    }

    var onResolveSuccess = function(fileEntry){
      fileEntry.remove();
      window.resolveLocalFileSystemURL(myPath, function (dirEntry) {
      var directoryReader = dirEntry.createReader();
      directoryReader.readEntries(onSuccessCallback,onFailCallback);
      }); 
    }

    var fail = function(evt){
      alert(evt.target.error.code);
    }


    function onConfirmDltRecordedAudio(buttonIndex, name) {
      if(buttonIndex == '1'){  //se confirma la eliminación del audio
        //window.requestFileSystem(LocalFileSystem.PERSISTENT, 0, onFileSystemSuccess, fail);
        window.resolveLocalFileSystemURL(cordova.file.externalRootDirectory + "/sonidosproa/" + name, onResolveSuccess, fail);

      }
    }

    //elimino un audio grabado determinado
    $scope.deleteRecordedAudio = function(name){
      navigator.notification.confirm(
      '¿Desea eliminar este audio?',
      function(buttonIndex){
        onConfirmDltRecordedAudio(buttonIndex, name);
      },
      'Eliminando Audio',           
      ['Aceptar','Cancelar']     
      );
    }
})
       