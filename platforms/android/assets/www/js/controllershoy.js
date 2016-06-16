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
	var audio;
  var filepart;

  $scope.state = "record";

  //Asigno los valores de las variables si la grabación anduvo bien 
  var captureSuccess = function(mediaFiles) {
    console.log("grabación de audio exitosa");
  }
  // Capturo errores si falló la grabación del audio
  var captureError = function(error) {
    console.log("Error durante la grabación");
      //navigator.notification.alert('Error code: ' + error.code, null, 'Capture Error');
  }

	//Capturo audio 
	$scope.capturarAudio = function(){
    $scope.state = "recording";
    var extension = ".wav";
    filepart = new Date();
    var day = filepart.getDate();
    var month = filepart.getMonth()+1;
    var year = filepart.getFullYear();
    var hours = filepart.getHours();
    var minutes = filepart.getMinutes();
    var seconds = filepart.getSeconds();
    var clock = hours + ":" + minutes + ":" + seconds;
    filepart = day + "-" + month + "-" + year + "_" + clock + extension;
    audio = new Media(cordova.file.externalRootDirectory + "sonidosproa/" + filepart, captureSuccess, captureError);
    audio.startRecord();
	}

  $scope.pausarAudio = function(){
    state = "pause";
    audio.pauseRecord();
  } 

	$scope.pararAudio = function(){
    audio.stopRecord();
    audio.release();
    $scope.state = "record";
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
       