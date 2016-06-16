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
  var audio =null;

	//Capturo audio 
	$scope.capturarAudio = function(){
    var extension = ".wav";
    filepart = new Date();
    var day = filepart.getDate().toString();
    var month = (filepart.getMonth()+1).toString();
    var year = filepart.getFullYear().toString();
    var hours = filepart.getHours().toString();
    var minutes = filepart.getMinutes().toString();
    var seconds = filepart.getSeconds().toString();
    var filename = day + "-" + month + "-" + year + "_" + hours + ":" + minutes + ":" + seconds;
    var src = cordova.file.externalRootDirectory + "/sonidosproa/" + filename + extension;

    audio = new Media(src, function(e){console.log(e,"success");}, function(e){console.log(e,"error");});
    audio.startRecord();
	}

	$scope.pararAudio = function(){
    audio.stopRecord();
    audio.release();
    audio=null;
	}


})
   
.controller('grabacionesCtrl', function($scope) {

    var onSuccessCallback = function(entries){
      //var str = JSON.stringify(entries, null, 4);

      $scope.files = entries;
      $scope.$apply();
    }

    var onFailCallback = function(){
    // In case of error
    }

    var myPath = cordova.file.externalRootDirectory + "/sonidosproa/";
    window.resolveLocalFileSystemURL(myPath, function (dirEntry) {
      var directoryReader = dirEntry.createReader();
      directoryReader.readEntries(onSuccessCallback,onFailCallback);
    });      

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
      var str = JSON.stringify(fileEntry, null, 4);
      alert(str);
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
        alert(cordova.file.externalRootDirectory + "/sonidosproa/" + name);
        window.resolveLocalFileSystemURL(cordova.file.externalRootDirectory + "/sonidosproa/" + name, onResolveSuccess, fail);
      }
    }

    $scope.stopRecordedAudio = function(){

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
       