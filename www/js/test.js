
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

      navigator.notification.confirm(
       '¿Estas Seguro?', // message
        function (buttonIndex) {
            dltRecAudio(buttonIndex, name);
        },            // callback to invoke with index of button pressed
       'Confirmacion',           // title
       ['Cancel','Aceptar']     // buttonLabels
   );
   }

