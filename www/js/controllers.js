angular.module('app.controllers', ['timer'])

//CONTROLADOR DEL REPRODUCTOR   
.controller('reproducirCtrl', function($scope) {

	document.addEventListener("deviceready", function() { 
	  window.requestFileSystem(LocalFileSystem.PERSISTENT, 0, firstFolder, null); 
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

	document.addEventListener("deviceready", function() { 
	  window.requestFileSystem(LocalFileSystem.PERSISTENT, 0, secondFolder, null); ;
	}, false);

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

	
  var readMusicScss = function(entries){
  	str = JSON.stringify(entries, null, 4);	
  	alert(str);
  	$scope.tracks = entries;
    $scope.$apply();

    
  }

  var readMusicFail = function(){
  	// In case of error
  }

  $scope.music = function () {
	  var myPath = cordova.file.externalRootDirectory + "/AudioticaMusic/";
	  window.resolveLocalFileSystemURL(myPath, function (dirEntry) {
	    var directoryReader = dirEntry.createReader();
	    directoryReader.readEntries(readMusicScss,readMusicFail);
	  }); 
  }
  



	

        

    



})
   
//CONTROLADOR DE GRABAR AUDIO     
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
    		message: "El audio capturado a sido agregado a la biblioteca de Grabaciones.",
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

//CONTROLADOR DE LAS GRABACIONES   
.controller('grabacionesCtrl', function($scope) {

  var my_media;
  var onSuccessCallback = function(entries){
    //var str = JSON.stringify(entries, null, 4);
    $scope.files = entries;
    $scope.$apply();
  }

  var onFailCallback = function(){
  // In case of error
  }

  var myPath = cordova.file.externalRootDirectory + "/Audiotica/";
  window.resolveLocalFileSystemURL(myPath, function (dirEntry) {
    var directoryReader = dirEntry.createReader();
    directoryReader.readEntries(onSuccessCallback,onFailCallback);
  });      

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
    window.resolveLocalFileSystemURL(myPath, function (dirEntry) {
    var directoryReader = dirEntry.createReader();
    directoryReader.readEntries(onSuccessCallback,onFailCallback);
    });
    window.plugins.toast.showWithOptions({
    	message: "Se a eliminado correctamente el Audio " + fileEntry.name,
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
       