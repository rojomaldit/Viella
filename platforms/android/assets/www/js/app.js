// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.services' is found in services.js
// 'starter.controllers' is found in controllers.js
angular.module('app', ['ionic', 'app.controllers', 'app.routes', 'app.services', 'app.directives'])

.run(function($ionicPlatform) {
  $ionicPlatform.ready(function() {

  	 // Disable BACK button on home
  	$ionicPlatform.registerBackButtonAction(function(event) {
    if (true) { // your check here
      console.log("Se ha presionado back button");
    }
  	}, 100);
    // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
    // for form inputs)
    if (window.cordova && window.cordova.plugins && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
      cordova.plugins.Keyboard.disableScroll(true);
      
    }
    if (window.StatusBar) {
      // org.apache.cordova.statusbar required
      StatusBar.styleDefault();
    }
  });
})

.filter('dirClean', function () {
  return function (item) {
    var str = JSON.stringify(item, null, 4);
    alert(str);
    var extension = item.name.split(".").pop();
    var coverFormats = ["jpg","png", "jpeg", "bmp", "gif", "tiff"];
    if((coverFormats.indexOf(extension)) == -1){
      return item;
    }
  };
})

.factory("$fileFactory", function($q) {

    var File = function() { };

    File.prototype = {
        //obtengo todas las grabaciones de audio capturadas por el usuario
        getEntries: function(path) {
            var deferred = $q.defer();
            window.resolveLocalFileSystemURI(path, function(fileSystem) {
                var directoryReader = fileSystem.createReader();
                directoryReader.readEntries(function(entries) {
                    deferred.resolve(entries);
                }, function(error) {
                    deferred.reject(error);
                });
            }, function(error) {
                deferred.reject(error);
            });
            return deferred.promise;
        },
        getAlbumCover: function(path) {
            var albumPath = [];
            var flag = true;
            var coverFormats = ["jpg","png", "jpeg", "bmp", "gif", "tiff"];
            var deferred = $q.defer();
            window.resolveLocalFileSystemURI(path, function(fileSystem) {
                var directoryReader = fileSystem.createReader();
                directoryReader.readEntries(function(entries) {
                for (var k in entries){
                    if (entries.hasOwnProperty(k) && entries[k].isFile) {
                        var extension = entries[k].name.split(".").pop();
                        if((coverFormats.indexOf(extension)) != -1){
                            albumPath[0] = entries[k].nativeURL;
                            albumPath[1] = path;
                            albumPath[2] = Object.keys(entries).length - 1;
                            flag = false;
                        }
                        else if (flag) {
                            albumPath[0] = "img/UnkownAlbum.png";
                            albumPath[1] = path;
                            albumPath[2] = Object.keys(entries).length;
                        }
                    }
                }
                    deferred.resolve(albumPath);
                }, function(error) {
                    deferred.reject(error);
                });
            }, function(error) {
                deferred.reject(error);
            });
            return deferred.promise;
        }
    };
    return File;
});