
$scope.stopRecordedAudio = function () {
      media.stop();
   }


function dltRecAudio (buttonIndex, name) {

   	if (buttonIndex == 2) {
   		window.resolveLocalFileSystemURL (myPath + name,function(fileEntry) {

			fileEntry.remove();
			
		});	
   	}

   	else {
   		return;
   	}
   }

   $scope.deleteRecordedAudio = function (name) {

      navigator.notification.confirm (
         '¿Desea eliminar la grabacion?',
         function (buttonIndex) {
            dltRecAudio (buttonIndex , name)
         },
         'Eliminando grabacion . . .',
         ["Cancel","Accept"],
         );
   }

