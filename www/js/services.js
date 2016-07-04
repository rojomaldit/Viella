angular.module('app.services', [])

.factory('BlankFactory', [function(){

}])

.service('sharedFlags', [function(){
	var flag = true;
	this.getFlag = function () {
		return flag;
	}

	this.setFlag = function (value) {
		flag = value;
	}
}]);

