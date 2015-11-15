(function(){
	var app = angular.module('OrganizationApp',['ui-router']);
	//console.log("[app.js loaded.]");
	app.factory("DataFactory", function('$scope'){
		function getProjects(sort){
			
		};
		

		return {
			"getProjects":getProjects
		};
	});
})()