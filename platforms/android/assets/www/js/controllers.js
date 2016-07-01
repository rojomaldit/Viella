angular.module('app.controllers', ['timer'])

//++++++++++++++++++++++++++++++++++++++++++++++++ CONTROLADOR DEL REPRODUCTOR +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++

.controller('reproducirCtrl', function($scope, $ionicPlatform, $fileFactory) {
  $scope.status = 0;
  $scope.images = [];
  var lonelyTracks = [];
  var size;
  var my_media;

document.addEventListener("deviceready", function() {
  var dirAlbums = [];
  var imagesAlbums = [];  
  var fs = new $fileFactory();
  var dirUrl = cordova.file.externalRootDirectory + "/AudioticaMusic/";

  screen.lockOrientation('portrait');
  window.requestFileSystem(LocalFileSystem.PERSISTENT, 0, firstFolder, null);
  window.requestFileSystem(LocalFileSystem.PERSISTENT, 0, secondFolder, null); 

  fs.getEntries(dirUrl).then(function(result) {

    size = Object.keys(result).length;

    for (var k in result){
      if (result.hasOwnProperty(k) && result[k].isDirectory == true ) {
        dirAlbums.push(result[k].nativeURL);
      }
      else if(result.hasOwnProperty(k) && result[k].isFile == true){
        lonelyTracks.push(result[k].nativeURL);
      }
    }

    for (var i = 0; i < dirAlbums.length; i++) {
      fs.getAlbumCover(dirAlbums[i]).then(function(result) {
        $scope.images.push({id:i, coverSrc:result[0], albumPath:result[1], trackCount: result[2]});
        //$scope.$apply();
      });      
    }

    //$scope.directories = result;
    //$scope.$apply();
  }); 
}, false);


function firstFolder(fileSystemOne) { 
  var firstEntry = fileSystemOne.root; 
  firstEntry.getDirectory("Audiotica", {create: true, exclusive: false}, successOne, failOne); 
}

function successOne(dirOne) { 
  console.log("Se a creado el directorio " + dirOne.name); 
} 

function failOne(errorOne) { 
  console.log("Error creando el directorio " + errorOne.code); 
} 

function secondFolder(fileSystemTwo) { 
  var secondEntry = fileSystemTwo.root; 
  secondEntry.getDirectory("AudioticaMusic", {create: true, exclusive: false}, successTwo, failTwo); 
}

function successTwo(dirTwo) { 
  console.log("Se a creado el directorio " + dirTwo.name); 
} 

function failTwo(errorTwo) { 
  console.log("Error creando el directorio " + errorTwo.code); 
}

//Reproduzco un audio grabado determinado
var flag = true;
$scope.playAudioTrack = function(fileUrl){
  if(flag){
    my_media = new Media(fileUrl, function(e) { 
    my_media.release();
    }, function(err) {
      console.log("media err", err);
    });
    my_media.play();
    flag=false;    
  }
  else{
    console.log("No se pueden reproducir 2 temas al mismo tiempo");
    my_media.stop();
    flag=true;
  }

}

//Freno la reproducción de un audio track
$scope.stopAudioTrack = function(){
  my_media.stop();
  flag=true;
}

var onSuccessCallback = function(entries){
  $scope.audioTracks = entries.length;
  $scope.files = entries;
  $scope.$apply();
}

var onFailCallback = function(){
  // In case of error
}

var onResolveSuccess = function(fileEntry){
  fileEntry.remove();
  window.resolveLocalFileSystemURL(dirUrl, function (dirEntry) {
  var directoryReader = dirEntry.createReader();
  directoryReader.readEntries(onSuccessCallback,onFailCallback);
  });
  window.plugins.toast.showWithOptions({
  	message: "Se ha eliminado correctamente el Audio " + fileEntry.name,
   	duration: 6000, // 5000 ms
   	position: "top",
   	styling: {
   		opacity: 0.75, // 0.0 (transparent) to 1.0 (opaque). Default 0.8
   		backgroundColor: '#333333', // make sure you use #RRGGBB. Default #333333
   		textColor: '#FFFFFF', // Ditto. Default #FFFFFF
   		textSize: 20.5, // Default is approx. 13.
   		cornerRadius: 16, // minimum is 0 (square). iOS default 20, Android default 100
   		horizontalPadding: 20, // iOS default 16, Android default 50
   		verticalPadding: 16 // iOS default 12, Android default 30
   	}
	}); 
  }

var fail = function(evt){
  console.log(evt.target.error.code);
}

function onConfirmDltRecordedAudio(buttonIndex, fileUrl) {
  if(buttonIndex == '1'){  //se confirma la eliminación del audio
    window.resolveLocalFileSystemURL(fileUrl, onResolveSuccess, fail);
  }
}

//Elimino un audio track
$scope.deleteAudioTrack = function(fileUrl){
  navigator.notification.confirm(
  '¿Desea eliminar este audio?',
  function(buttonIndex){
    onConfirmDltRecordedAudio(buttonIndex, fileUrl);
  },
  'Eliminando Audio',           
  ['Aceptar','Cancelar']     
  );
}

var readTracksScss = function(entries){
  $scope.music = entries;
  $scope.$apply();
}

var readTracksFail = function () {

}

$scope.openDir = function (dirUrl) {
  window.resolveLocalFileSystemURL(dirUrl, function (dirEntry) {
    var directoryReader = dirEntry.createReader();
    directoryReader.readEntries(readTracksScss,readTracksFail);
  });
  $scope.status = 1;
}

})
   
//++++++++++++++++++++++++++++++++++++++++++++++++++++ CONTROLADOR DE GRABAR AUDIO +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++     
.controller('grabarAudioCtrl', function($scope, $ionicPopup) {
  $scope.state = "record";
  $scope.audioFormat = "wav";
  var audio;

  $scope.start = function () {
    $scope.$broadcast('timer-start');
  };
  $scope.stop = function () {
    $scope.$broadcast('timer-stop');
  };

  //
  $scope.updateSelection = function(position, items, title) {
        angular.forEach(items, function(subscription, index) {
            if (position != index)
                subscription.checked = false;
                $scope.selected = title;
            }
        );
    }

  //Selección de formato de Grabación de un Audio 
  $scope.formatos = function(){
      $scope.devList = [{ text: "Amr", checked: false },{ text: "Mp3", checked: false },{ text: "M4a", checked: false },{ text: "Wav", checked: true  },{ text: "Wma", checked: false }];

      var prueba = '<ion-checkbox class="checkbox-assertive checkbox-circle" ng-repeat="item in devList" ng-model="item.checked" ng-checked="item.checked" ng-click="updateSelection($index, devList, item.text)">{{ item.text }}</ion-checkbox>'

    // Popup para seleccionar formáto de grabación
    var myPopup = $ionicPopup.show({
      template: prueba,
      title: 'Seleccione Formato de Grabación',
      subTitle: 'Recuerde comprobar la compatibilidad de su equipo móvil (Por defecto se recomienda Wav)',
      scope: $scope,
      buttons: [
        { text: 'Cerrar' },
        {
          text: '<b>Confirmar</b>',
          type: 'button-assertive',
          onTap: function(e) {
            for (var k in $scope.devList){
              if ($scope.devList.hasOwnProperty(k) && $scope.devList[k].checked == true ) {
                $scope.audioFormat = $scope.devList[k].text;
              }
            }
          }
        }
      ]
    });
  }

	//Grabación de un Audio 
	$scope.capturarAudio = function(){
		$scope.state = "recording";
   		var extension = "." + $scope.audioFormat;
   		filepart = new Date();
   		var day = filepart.getDate().toString();
   		var month = (filepart.getMonth()+1).toString();
   		var year = filepart.getFullYear().toString();
   		var hours = filepart.getHours().toString();
   		var minutes = filepart.getMinutes().toString();
   		var seconds = filepart.getSeconds().toString();
   		var sep = "-";
   		var filename = day + sep + month + sep + year + sep + hours + sep + minutes + sep + seconds + extension;
   		var src = cordova.file.externalRootDirectory + "/Audiotica/" + filename;
   		audio = new Media(src, function(e){console.log(e,"success");}, function(e){console.log(e,"error");});
   		audio.startRecord();
	}

  //Freno la grabación del Audio
	$scope.pararAudio = function(){
    	audio.stopRecord();
    	audio.release();
    	//var str = JSON.stringify(audio, null, 4);
    	$scope.state = "record";
    	window.plugins.toast.showWithOptions({
    		message: "El audio capturado ha sido agregado a la biblioteca de Grabaciones.",
    		duration: 5000, // 5000 ms
    		position: "top",
    		styling: {
      			opacity: 0.75, // 0.0 (transparent) to 1.0 (opaque). Default 0.8
      			backgroundColor: '#333333', // make sure you use #RRGGBB. Default #333333
      			textColor: '#FFFFFF', // Ditto. Default #FFFFFF
      			textSize: 20.5, // Default is approx. 13.
      			cornerRadius: 16, // minimum is 0 (square). iOS default 20, Android default 100
      			horizontalPadding: 20, // iOS default 16, Android default 50
      			verticalPadding: 16 // iOS default 12, Android default 30
    		}
  		});
	}

})

//+++++++++++++++++++++++++++++++++++++++++ CONTROLADOR DE LAS GRABACIONES +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++

.controller('grabacionesCtrl', function($scope, $ionicPlatform, $fileFactory) {

  var fs = new $fileFactory();
  var path = cordova.file.externalRootDirectory + "/Audiotica/";
  
  fs.getEntries(path).then(function(result) {
    $scope.audioTracks = result.length;
    $scope.files = result;
  });

  var my_media;
      


  //Reproduzco un audio grabado determinado
  $scope.playRecordedAudio = function(name){
    my_media = new Media(cordova.file.externalRootDirectory + "/Audiotica/" + name, function(e) { 
    my_media.release();
    }, function(err) {
      console.log("media err", err);
    });
    my_media.play();
  }

  var onResolveSuccess = function(fileEntry){
    fileEntry.remove();
    fs.getEntries(path).then(function(result) {
      $scope.audioTracks = result.length;
      $scope.files = result;
    });

    window.plugins.toast.showWithOptions({
    	message: "Se ha eliminado correctamente el Audio " + fileEntry.name,
    	duration: 6000, // 5000 ms
    	position: "top",
    	styling: {
    		opacity: 0.75, // 0.0 (transparent) to 1.0 (opaque). Default 0.8
    		backgroundColor: '#333333', // make sure you use #RRGGBB. Default #333333
    		textColor: '#FFFFFF', // Ditto. Default #FFFFFF
      		textSize: 20.5, // Default is approx. 13.
    		cornerRadius: 16, // minimum is 0 (square). iOS default 20, Android default 100
    		horizontalPadding: 20, // iOS default 16, Android default 50
    		verticalPadding: 16 // iOS default 12, Android default 30
    	}
  	}); 
  }

  var fail = function(evt){
    console.log(evt.target.error.code);
  }


  function onConfirmDltRecordedAudio(buttonIndex, name) {
    if(buttonIndex == '1'){  //se confirma la eliminación del audio
      window.resolveLocalFileSystemURL(cordova.file.externalRootDirectory + "/Audiotica/" + name, onResolveSuccess, fail);
    }
  }

  //Freno la reproducción de un audio
  $scope.stopRecordedAudio = function(){
    my_media.stop();
  }

  //Elimino un audio grabado determinado
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
       