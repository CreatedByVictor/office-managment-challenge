strict:true;

(function(){
	var app = angular.module('OrganizationApp',['ui.router', 'ui.bootstrap']);
	//console.log("[app.js loaded.]");

	app.controller('DepartmentsController', ['$scope', 'DataFactory', '$stateParams',  function($scope,DataFactory,$stateParams){
		$scope.departments = DataFactory.listAllDepartments();
		$scope.sortByProjects = {
			"LevelA":"project in dept.projects",
			"LevelB":"resource in project.resources"
		};
		$scope.getProject = function(project_id){
			return DataFactory.getProject(project_id);
		};
		$scope.getResource = function(resource_Id){
			return DataFactory.getResource(resource_Id);
		};
		$scope.getDeadline = function(deadline_Id){
			return DataFactory.getDeadline(deadline_Id);
		};
	}]);
	app.controller('DepartmentController', ['$scope', 'DataFactory', '$stateParams', function($scope,DataFactory,$stateParams){
		$scope.department = DataFactory.getDepartment($stateParams.id);

	}])

	app.config(function($stateProvider, $urlRouterProvider){
		$urlRouterProvider.otherwise('/departments');
		$stateProvider
			.state('departments',{
				url:'/departments',
				templateUrl:'partials/all-departments-view.html',
				controller: 'DepartmentsController'
			})
			.state('deadlines',{
				url:'/deadlines',
				templateUrl:'partials/all-deadlines-view.html'
			})
			.state('resources',{
				url:'/resources',
				templateUrl:'partials/all-resources-view.html'
			})
			.state('projects',{
				url:'/projects',
				templateUrl:'partials/all-projects-view.html'
			})
			.state('department',{
				url:'/department/{id:int}',
				templateUrl:'partials/single-department-view.html',
				controller:'DepartmentController'
			})
			.state('deadline',{
				url:'/deadline/{id:int}',
				templateUrl:'partials/single-deadline-view.html'
			})
			.state('resource',{
				url:'/resource/{id:int}',
				templateUrl:'partials/single-resource-view.html'
			})
			.state('project',{
				url:'/project/{id:int}',
				templateUrl:'partials/single-project-view.html'
			});
	});

	app.directive('sortBar', function(){
		// Runs during compile
		return {
			// name: '',
			// priority: 1,
			// terminal: true,
			// scope: {}, // {} = isolate, true = child, false/undefined = no change
			// controller: function($scope, $element, $attrs, $transclude) {},
			// require: 'ngModel', // Array = multiple requires, ? = optional, ^ = check parent elements
			restrict: 'A', // E = Element, A = Attribute, C = Class, M = Comment
			// template: '',
			templateUrl: 'partials/view-sorting.html',
			// replace: true,
			// transclude: true,
			// compile: function(tElement, tAttrs, function transclude(function(scope, cloneLinkingFn){ return function linking(scope, elm, attrs){}})),
			//link: function($scope, iElm, iAttrs, controller) {}
		};
	});

	app.factory('DataFactory', function(){

		/////////////////////////////////////////
		// The Dataset (converted to use keys) //
		// and organized by the challenge info //
		/////////////////////////////////////////

		var ConvertedDataset = {
			"projects" :[
				{
					"id" : 1,
					"name" : "Show Three Lists",
					"resources" : [1,2,3,4,5,6,7],
					"deadlineId" : 4,
					"departmentId" : 1
				},
				{
					"id" : 2,
					"name" : "Make Stepped List",
					"resources" : [7],
					"deadlineId" : 4,
					"departmentId" : 2
					},
				{
					"id" : 3,
					"name" : "Add UI-Router Rules",
					"resources" : [3,4,5,6],
					"deadlineId" : 2,
					"departmentId" : 5
				},
				{
					"id" : 4,
					"name" : "Create Filters",
					"resources" : [2,6],
					"deadlineId" : 1,
					"departmentId" : 4
				},
				{
					"id" : 5,
					"name" : "Sum Up Subtotals",
					"resources" : [1],
					"deadlineId" : 1,
					"departmentId" : 5
				}
			],
			"departments" : [
				{
					"id":1,
					"name":"App Engineering"
				},
				{
					"id":2,
					"name":"Marketing"
				},
				{
					"id":3,
					"name":"DBAdmin"
				},
				{
					"id":4,
					"name":"SysOps"
				},
				{
					"id":5,
					"name":"Embedded"
				},
				{
					"id":6,
					"name":"GroceryOps"
				}
			],
			"deadlines" : [
				{
					"id":1,
					"date":"April 01, 2016 12:00:00"
				},
				{
					"id":2,
					"date":"March 15, 2016 12:00:00"
				},
				{
					"id":3,
					"date":"May 01, 2016 12:00:00"
				},
				{
					"id":4,
					"date":"January 01, 2016 12:00:00"
				},
				{
					"id":5,
					"date":"July 01, 2016 12:00:00"
				},
			],
			"resources" : [
				{
					"id":1,
					"name":"Kirk Middleton"
				},
				{
					"id":2,
					"name":"Spenser Estrada"
				},
				{
					"id":3,
					"name":"Kierra Buckner"
				},
				{
					"id":4,
					"name":"Hunter Luna"
				},
				{
					"id":5,
					"name":"Ahmad Justice"
				},
				{
					"id":6,
					"name":"Breana Medina"
				},
				{
					"id":7,
					"name":"Shelbie Cervantes"
				}
			]};
		
		//////////////////////
		// Internal Helpers //
		//////////////////////

		function _getIndexOfId(){
			var targetIndex = -1;
			for (var i = 0; i < ConvertedDataset[arrayName].length; i++){
				if (ConvertedDataset[arrayName][i].id == id){
					targetIndex = id;
				}
			}
			return targetIndex;
		};
		function _remove(id, arrayName){
			var index = _getIndexOfId();
			if (index >= 0){
				ConvertedDataset[arrayName].splice(index,1);
				console.log("removed object with id "+ id +" from "+ arrayName);
			}
			else{
				console.error("Could not remove the item from " + arrayName + " with id of " + id);
			}
		};
		function _getById(id, arrayName){
			var output = null;
			for( var i = 0; i < ConvertedDataset[arrayName].length; i++){
				if (ConvertedDataset[arrayName][i].id == id){
					output = ConvertedDataset[arrayName][i];
				}
			}
			if (output){
				return output;
			}
			else {
				return null;
				console.error("Could not retreve an object with the id " + id + " from " + arrayName);
			}
		};
		function _addOneToLargestId(array){
			var output = 1;
			for (var i = 0; i < array.length; i++){
				if (output <= array[i].id){
					output = array[i].id + 1;
				}
			}
			return output;
		};
		function _update(id, arrayName, newData){
			var index = _getIndexOfId(id, arrayName);
			if (index >=0){
				var oldObject = ConvertedDataset[arrayName][index];
				var oldObjectKeys = Object.keys(oldObject);
				for (var i = 0; i < oldObjectKeys.length; i++){
					key = oldObjectKeys[i];
					if (key !== "id"){        //The id cannot be reassigned. 
						ConvertedDataset[arrayName][index][key] = newData[key];
					}
					else{
						console.log("The id cannot be reassigned.");
					}
				}
			}
			else{
				console.error("had trouble updating the object with id " + id +" in the array " + arrayName);
				console.error("newdata:",newData);
			}
			
		};
		function _pushIfUnique(inputArray, TestValue){
			var outputArray = inputArray;
			var isUnique = true;
			for (var i = 0; i < outputArray.length; i++){
				if(outputArray[i] === TestValue){
					isUnique = false;
				}
			}
			if (isUnique){
				outputArray.push(TestValue);
			}
			return outputArray;
		};

		///////////////
		// Additions //
		///////////////

		function addProject(inputObject){
			var output = inputObject;
			output["id"] = _addOneToLargestId(ConvertedDataset['projects']);
			
			ConvertedDataset["projects"].push(object);
		};
		function addDepartment(name){
			var output = {
				"id": _addOneToLargestId(ConvertedDataset['departments']),
				"name":name
			}
			ConvertedDataset["departments"].push(output);
		};
		function addResource(name){
			var output = {
				"id": _addOneToLargestId(ConvertedDataset['resources']),
				"name":name
			}
			ConvertedDataset["resources"].push(output);
		};
		function addDeadline(date){
			var output = {
				"id": _addOneToLargestId(ConvertedDataset['deadlines']),
				"date":date
			}
			ConvertedDataset["deadlines"].push(output);
		};

		//////////////
		// Removals //
		//////////////

		function removeProject(id){ 	_remove(id, "projects");    };
		function removeDepartment(id){ 	_remove(id, "departments"); };
		function removeResource(id){	_remove(id, "resources");   };
		function removeDeadline(id){	_remove(id, "deadlines");   };

		////////////////////////
		// Many Happy Returns //
		////////////////////////

		function getProject(id){
			var output = _getById(id,"projects");
			if (output){
				return output;
			}
		};
		function getProject_Full(id){
			var output = {};
			var project = getProject(id);
			output.id = project.id;
			output.name = project.name;
			output.deadline = getDeadline(project.deadlineId);
			output.department = getDepartment(project.departmentId);
			var pResources = function(resourceArray){
				var res = [];
				for (var i = 0; i < resourceArray.length; i++){
					res.push(getResource(resourceArray[i]));
				}
				return res;
			}
			output.resources = pResources(project.resources);
			return output;
		};

		function getDepartment(id){
			return _getById(id, "departments");
		};
		function getDepartment_Full(id){
			var output = {};
			var dept = getDepartment(id);
			output.id = dept.id;
			output.name = dept.name;
			output.projects = getAllDepartmentProjectIds(dept.id).map(function(projectId){
				return getProject(projectId);
			});
			output.resources = getAllDepartmentResourceIds(dept.id).map(function(resourceId){
				return getResource(resourceId);
			});
			output.deadlines = getAllDepartmentDeadlineIds(dept.id).map(function(deadlineId){
				return getDeadline(deadlineId);
			});
			return output;
		};

		function getResource(id){
			return _getById(id, "resources");
		};
		function getResource_Full(id){
			var output = {};
			var resource = getResource(id);
			output.id = resource.id;
			output.name = resource.name;
			output.projects = getAllResourcesProjectIds(resource.id).map(function(project_id){
				return getProject(project_id);
			});
			output.departments = getAllResourceDepartmentIds(resource.id).map(function(dept_id){
				return getDepartment(dept_id);
			});
			output.deadlines = getAllResourceDeadlineIds(resource.id).map(function(deadline_id){
				return getDeadline(deadline_id);
			});
			return output;
		};

		function getDeadline(id){
			var output = _getById(id,"deadlines");
			if(output){
				return output;				
			}
		};
		function getDeadline_Full(id){
			var output = {};
			var deadline = getDeadline(id);
			output.id = deadline.id;
			output.date = deadline.date;
			output.projects = getAllDeadlineProjectIds(deadline.id).map(function(project_id){
				return getProject(project_id);
			});
			output.departments = getAllDeadlineDepartmentIds(deadline.id).map(function(dept_id){
				return getDepartment(dept_id);
			});
			output.resources = getAllDeadlineResourceIds(deadline.id).map(function(res_id){
				return getResource(res_id);
			});
			return output;
		};

		function getProjectDeadlineId(id){
			var output = getProject(id)
			if (output){
				return output.deadlineId;;
			}
			else{
				return null;
			}
		};
		function getProjectDepartmentId(id){
			var output = getProject(id)
			if (output){
				return output.departmentId;;
			}
			else{
				return null;
			}
		};
		function getProjectResourcesArray(id){
			var output = getProject(id)
			if (output){
				return output.resources;;
			}
			else{
				return null;
			}
		};

		//	Resource Sorting
		function getAllResourcesProjectIds(resourceId){
			var output = [];
			var currentProjects = listAllProjects();
			for (var i = 0; i < currentProjects.length; i++){
				var resources = getProjectResourcesArray(currentProjects[i].id);
				if (resources){
					for (var x = 0; x < resources.length; x++){
						if (resourceId === resources[x]){
							output.push(currentProjects[i].id);
						}
					}
				}
			}
			return output;		
		};
		function getAllResourceDeadlineIds(resourceId){
			var output = [];

			var resourcesProjects = getAllResourcesProjectIds(resourceId);
			for (var i = 0; i < resourcesProjects.length; i ++){
				var currentDeadline = getProjectDeadlineId(resourcesProjects[i]);
				output = _pushIfUnique(output, currentDeadline);
			}

			return output;
		};
		function getAllResourceDepartmentIds(resourceId){
			var output = [];

			var resourcesProjectIds = getAllResourcesProjectIds(resourceId);
			for (var i = 0; i < resourcesProjectIds.length; i++){
				var department = getProjectDepartmentId(resourcesProjectIds[i]);
				output = _pushIfUnique(output, department);
			}

			return output;
		};
		// Department Sorting
		function getAllDepartmentProjectIds(departmentId){
			var output = [];
			var currentProjects = listAllProjects();
			for (var i = 0; i < currentProjects.length; i++){
				if (currentProjects[i].departmentId == departmentId){
					output.push(currentProjects[i].id);
				}
			}
			return output;	
		};
		function getAllDepartmentResourceIds(departmentId){
			var output = [];

			var deptProjects = getAllDepartmentProjectIds(departmentId);
			for (var i = 0; i < deptProjects.length; i++){
				var resources = getProjectResourcesArray(deptProjects[i].id);
				if (resources){
					for (var x = 0; x < resources.length; x++){
						output = _pushIfUnique(output, resources[x]);
					}
				}
			}

			return output;
		};
		function getAllDepartmentDeadlineIds(departmentId){
			var output = [];

			var deptProjects = getAllDepartmentProjectIds(departmentId);
			for (var i = 0; i < deptProjects.length; i++){
				var currentProjectDeadline = getProjectDeadlineId(deptProjects[i]);
				output = _pushIfUnique(output, currentProjectDeadline);
			}

			return output;
		};
		//Deadline Sorting
		function getAllDeadlineProjectIds(deadlineId){
			var output = [];
			var currentProjects = listAllProjects();
			for (var i = 0; i < currentProjects.length; i++){
				if (currentProjects[i].deadline == deadlineId){
					output.push(project.id);
				}
			}
			return output;	
		};
		function getAllDeadlineResourceIds(deadlineId){
			var output = [];

			var deadlineProjects = getAllDeadlineProjectIds(deadlineId);

			for (var i = 0; i < deadlineProjects.length; i++){
				var resources = getProjectResourcesArray(deadlineProjects[i]);
				for (var x = 0; x < resources.length; x++){
					var resource = resources[x];
					output = _pushIfUnique(output,resource);
				}
			}

			return output;
		};
		function getAllDeadlineDepartmentIds(deadlineId){
			var output = [];

			var deadlineProjects = getAllDeadlineProjectIds(deadlineId);

			for (var i = 0; i < deadlineProjects.length; i++){
				var dept = getProjectDepartmentId(deadlineProjects[i]);
				output = _pushIfUnique(output, dept);
			}

			return output;
		};

		//List Alls:
		function getAllData(){
			return ConvertedDataset;
		};
		function listAllProjects(){
			return ConvertedDataset["projects"];
		};
		function listAllDepartments(){
			return ConvertedDataset["departments"];
		};
		function listAllResources(){
			return ConvertedDataset["resources"];
		};
		function listAllDeadlines(){
			return ConvertedDataset["deadlines"];
		};

		function listAllProjects_Full(){
			return listAllProjects().map(function(projectObj){
				return getProject_Full(projectObj.id);
			});
		};
		function listAllDepartments_Full(){
			return listAllDepartments().map(function(deptObj){
				return getDepartment_Full(deptObj.id);
			});
		};
		function listAllResources_Full(){
			return listAllResources().map(function(resObj){
				return getResource_Full(resObj.id);
			});
		};
		function listAllDeadlines_Full(){
			return listAllDeadlines().map(function(deadObj){
				return getDeadline_Full(deadObj.id);
			});
		};

		/////////////
		// Updates //
		/////////////

		function updateProject(id, newdata){
			_update(id, "projects", newdata);
		};
		function updateDepartment(id, newdata){
			_update(id, "departments", newdata);
		};
		function updateResource(id, newdata){
			_update(id, "resources", newdata);
		};
		function updateDeadline(id, newdata){
			_update(id, "deadlines", newdata);
		};


		/////////////////////
		// The Holy Return //
		/////////////////////

		return {

			// Additions //
			"addProject": 					addProject,
			"addDeadline": 					addDeadline,
			"addResource": 					addResource,
			"addDepartment": 				addDepartment,

			// Removals //
			"removeProject": 				removeProject,
			"removeDeadline": 				removeDeadline,
			"removeResource": 				removeResource,
			"removeDepartment": 			removeDepartment,

			// Updates //
			"updateProject": 				updateProject,
			"updateDeadline": 				updateDeadline,
			"updateResource": 				updateResource,
			"updateDepartment": 			updateDepartment,

			// Returns //
			"getAllData": 					getAllData,

			/*
			"listAllProjects": 				listAllProjects,
			"listAllDeadlines": 			listAllDeadlines,
			"listAllResources": 			listAllResources,
			"listAllDepartments": 			listAllDepartments,
			*/
			
			"listAllProjects": 				listAllProjects_Full,
			"listAllDeadlines": 			listAllDeadlines_Full,
			"listAllResources": 			listAllResources_Full, 
			"listAllDepartments": 			listAllDepartments_Full, 
			
			/*
			"getProject": 					getProject,
			"getDeadline": 					getDeadline,
			"getResource": 					getResource,
			"getDepartment": 				getDepartment, 
			*/
			
			"getProject": 					getProject_Full,
			"getDeadline": 					getDeadline_Full,
			"getResource": 					getResource_Full,
			"getDepartment": 				getDepartment_Full, 
			
			/*
			"getProjectDeadlineId": 		getProjectDeadlineId,
			"getProjectResourcesArray": 	getProjectResourcesArray,
			"getProjectDepartmentId": 		getProjectDepartmentId,

			"getAllDeadlineProjectIds": 	getAllDeadlineProjectIds,
			"getAllDeadlineResourceIds": 	getAllDeadlineResourceIds,
			"getAllDeadlineDepartmentIds": 	getAllDeadlineDepartmentIds,

			"getAllResourcesProjectIds": 	getAllResourcesProjectIds,
			"getAllResourceDepartmentIds": 	getAllResourceDepartmentIds,
			"getAllResourceDeadlineIds": 	getAllResourceDeadlineIds,

			"getAllDepartmentProjectIds": 	getAllDepartmentProjectIds,
			"getAllDepartmentDeadlineIds": 	getAllDepartmentDeadlineIds,
			"getAllDepartmentResourceIds":  getAllDeadlineResourceIds
			*/
		};
	});
})()