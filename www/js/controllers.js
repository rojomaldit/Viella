
angular.module('app.controllers', ['timer'])

//++++++++++++++++++++++++++++++++++++++++++++++++ CONTROLADOR DEL REPRODUCTOR +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++

.controller('reproducirCtrl', function($scope, $ionicPlatform, $fileFactory, $ionicPopup) {
  $scope.status = 0;
  $scope.isPlaying = false;
  $scope.trackStatus = 1;
  $scope.toggleStatus = 0;
  $scope.images = [];
  $scope.cover = "";
  $scope.currentPosition = -1;
  $scope.currentName = "Reproducir";

  var my_media;
  var lonelyTracks = [];
  var size;
  var flag = true;
  var mode = false; //representa secuencial

  

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

    $scope.audioDirs = size;

    for (var k in result){
      if (result.hasOwnProperty(k) && result[k].isDirectory) {
        dirAlbums.push(result[k].nativeURL);
      }
      else if(result.hasOwnProperty(k) && result[k].isFile){
        lonelyTracks.push(result[k].nativeURL);
      }
    }


    for (var i = 0; i < dirAlbums.length; i++) {
      fs.getAlbumCover(dirAlbums[i]).then(function(result) {
        $scope.images.push({id:i, coverSrc:result[0], albumPath:result[1], trackCount:result[2]});
      });      
    }
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

$scope.playAudioTrack = function(fileUrl,fileName){
  $scope.trackStatus = 1;
  $scope.currentPosition = $scope.tracksPositions.indexOf(fileUrl);


  if(flag){
    my_media = new Media(fileUrl, function(e) { 
    }, function(err) {
      console.log("media err", err);
    });
    my_media.play();
    flag=false;


    $scope.currentName = fileName;
    
    // Update media position every second
    var mediaTimer = setInterval(function () {
    my_media.getCurrentPosition(
        // success callback
        function (position) {
            if (position <= -0.0001) {
                $scope.nextTrack();
            }
        },
        // error callback
        function (e) {
            alert("Error getting pos=" + e);
        }
    );
    }, 1000); 


  
  }
  else{
    console.log("No se pueden reproducir 2 temas al mismo tiempo");
    my_media.stop();
    my_media.release();
    flag = true;
    $scope.playAudioTrack(fileUrl,fileName);
  }

}

$scope.backTrack = function(){
	my_media.stop();
	flag = true;
	if( $scope.currentPosition != 0){
		$scope.currentPosition = $scope.currentPosition - 1;
	}
	else{
		$scope.currentPosition = $scope.tracksPositions.length - 1;
	}

	$scope.playAudioTrack($scope.tracksPositions[$scope.currentPosition],$scope.tracksPositionsNames[$scope.currentPosition]);
}

$scope.nextTrack = function(fileName){
	my_media.stop();
	flag = true;
  if(!mode){
    if($scope.currentPosition != ($scope.tracksPositions.length) - 1){
      $scope.currentPosition = $scope.currentPosition + 1;
    }
    else{
      $scope.currentPosition = 0;
    }
  }
  else{
    $scope.currentPosition = Math.floor(Math.random() * $scope.tracksPositions.length);
  }

  $scope.setSequential = function(){
    mode = false;
    $scope.toggleStatus = 0;
  }

  $scope.setRandom = function(){
    mode = true;
    $scope.toggleStatus = 1;
  }  
	$scope.playAudioTrack($scope.tracksPositions[$scope.currentPosition],$scope.tracksPositionsNames[$scope.currentPosition]);
}


//Freno la reproducción de un audio track
$scope.pauseAudioTrack = function(){
  $scope.trackStatus = 0;
  my_media.pause();
  flag=true;
}

$scope.resumeAudioTrack = function(){
  $scope.trackStatus = 1;
  my_media.play();
  flag=true;
}

$scope.backAlbums = function(){
  $scope.status = 0;
  $scope.$apply();
}


$scope.setRandom = function(){
  $scope.toggleStatus = 1;
}

$scope.setSequential = function(){
  $scope.toggleStatus = 0;
}


$scope.info = function(){
   var alertPopup = $ionicPopup.alert({
     title: 'Información del sistema',
     okText:'Cerrar',
     template:'<h6>Música:' + "AudioticaMusic (en SDcard)" + '</h6>' +  '<h6>Grabaciones:' + "Audiotica (en SDcard)" +'</h6>' +'<h6>Versión Audiotica :' + '0.100001' + '</h6>' + '<h6>Modelo equipo:'+ device.model +'</h6>' + '<h6>Plataforma equipo:'+ device.platform +'</h6>' + '<h6>Android equipo:'+ device.version +'</h6>' +'<h6>Fabricante equipo:'+ device.manufacturer +'</h6>' + '<h6>Audiotica es un proyecto educativo realizado por 6to año de la escuela experimental Proa Córdoba Capital - Argentina. </h6>' 
   });
}


var tracksOptionTemplate = '<div class="list"><a class="item item-icon-left" href="#"><i class="icon ion-trash-b"></i>Eliminar</a><a class="item item-icon-left" href="#"><i class="icon ion-clipboard"></i>Detalles</a></div>';
$scope.trackOptions = function(fileUrl){
   var alertPopup = $ionicPopup.alert({
     title: 'Opciones',
     okText:'Cerrar',
     template:tracksOptionTemplate
   });
}

var onSuccessCallback = function(entries){
  //var str = JSON.stringify(entries, null, 4);
  $scope.audioTracks = entries.length;
  var coverFormats = ["jpg","png", "jpeg", "bmp", "gif", "tiff"];
  for (var k in entries){
    if (entries.hasOwnProperty(k) && entries[k].isFile) {
      var extension = entries[k].name.split(".").pop();
      if((coverFormats.indexOf(extension)) != -1){
        delete entries[k];
      }
    }
  }

  $scope.music = entries;
  $scope.$apply();
}

var onFailCallback = function(){
  // In case of error
}

var onResolveSuccess = function(fileEntry){
  var fileUrl = fileEntry.nativeURL;
  var n = fileUrl.lastIndexOf("/");
  var fileDir = fileUrl.substring(0,n);
  fileEntry.remove();

  window.resolveLocalFileSystemURL(fileDir, function (dirEntry) {
    var directoryReader = dirEntry.createReader();
    directoryReader.readEntries(onSuccessCallback,onFailCallback);
  });

  window.plugins.toast.showWithOptions({
    message: "Se ha eliminado correctamente el audio " + fileEntry.name,
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
  }) 

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
  'Eliminando audio',           
  ['Aceptar','Cancelar']     
  );
}

var readTracksScss = function(entries){
  /*var str = JSON.stringify(entries, null, 4);
  alert(str);*/
  var tracks = [];
  var tracksNames = [];
  var index = 0;
  var coverFormats = ["jpg","png", "jpeg", "bmp", "gif", "tiff"];
  for (var k in entries){
    if (entries.hasOwnProperty(k) && entries[k].isFile) {
      var extension = entries[k].name.split(".").pop();
      if((coverFormats.indexOf(extension)) == -1){
        tracks[index] = entries[k].nativeURL;
        tracksNames[index] = entries[k].name;
        index++;
      }
      else{
        delete entries[k];
      }
    }
  }

  $scope.music = entries;
  $scope.tracksPositions = tracks;
  $scope.tracksPositionsNames = tracksNames;
  $scope.$apply();
}

var readTracksFail = function () {

}

$scope.openDir = function (dirUrl,cover) {
  window.resolveLocalFileSystemURL(dirUrl, function (dirEntry) {
    var directoryReader = dirEntry.createReader();
    directoryReader.readEntries(readTracksScss,readTracksFail);
  });
  $scope.cover = cover;


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
      title: 'Seleccione formato de grabación',
      subTitle: 'Recuerde comprobar la compatibilidad de su equipo móvil (Por defecto se recomienda Wav)',
      scope: $scope,
      buttons: [
        { text: 'Cerrar' },
        {
          text: '<b>Confirmar</b>',
          type: 'button-assertive',
          onTap: function(e) {
            for (var k in $scope.devList){
              if ($scope.devList.hasOwnProperty(k) && $scope.devList[k].checked ) {
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
    		message: "El audio capturado ha sido agregado a la biblioteca de grabaciones.",
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
    	message: "Se ha eliminado correctamente el audio " + fileEntry.name,
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

  // this is the complete list of currently supported params you can pass to the plugin (all optional)
  var options = {
    message: 'Compartir esto', // not supported on some apps (Facebook, Instagram)
    subject: 'Asunto', // fi. for email
    files: ['', ''], // an array of filenames either locally or remotely
    url: 'https://www.website.com/foo/#bar?a=b',
    chooserTitle: 'Seleccionar servicio' // Android only, you can override the default share sheet title
  }

  var onSuccessShare = function(result) {
    alert("Envio completado? " + result.completed); // On Android apps mostly return false even while it's true
    alert("Enviado al servicio: " + result.app); // On Android result.app is currently empty. On iOS it's empty when sharing is cancelled (result.completed=false)
  }

  var onErrorShare = function(msg) {
    alert("Sharing failed with message: " + msg);
  }

  

  $scope.shareAudio = function(name,nativeURL){
    //window.plugins.socialsharing.shareWithOptions(options, onSuccessShare, onErrorShare);
    window.plugins.socialsharing.share('Acá está tu grabación', name, nativeURL);
  }

})
       