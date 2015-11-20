strict:true;






(function(){
	var app = angular.module('OrganizationApp',['ui.router', 'ui.bootstrap','FactoryModule']);
	
	app.config(function($stateProvider, $urlRouterProvider){
		$urlRouterProvider.otherwise('/departments');
		var projectStateBody = function(parentName){

				var obj = {
				parent:parentName,
				url:'/project/{id:int}',
				views:{
					'@':{
						templateUrl:'partials/projects/single-project.html',
						controller:'ProjectController'
						}
					}
				}

				return obj;
			}
		$stateProvider
		//Department States
			.state({
				name:'departments',
				url:'/departments',
				views:{
					'@':{
						templateUrl:'partials/departments/all-departments-regular.html',
						controller: 'DepartmentsController',
					}
				}

				})
			.state('departments.project',projectStateBody('departments'))
			.state({
				name:'departments.resources',
				url:'/resources',
				views:{
					'@':{
						templateUrl:'partials/departments/all-departments-resource.html',
						controller: 'DepartmentsController',
					}
				}
				})
			.state("departments.resources.project",projectStateBody('departments.resources'))
		//Deadline States
			.state({
				name:'deadlines',
				url:'/deadlines',
				templateUrl:'partials/deadlines/all-deadlines-time.html',
				controller:'DeadlinesController'
				})
		//Project States
			.state({
				name:'projects',
				url:'/projects',
				templateUrl:'partials/projects/all-projects-view.html',
				controller: 'ProjectsController'
				})
			//.state('project',projectStateBody)
	});

// Department Controllers:
	app.controller('DepartmentsController',	['$scope', 'DataFactory', '$state', function($scope,DataFactory, $state){
		$scope.departments = DataFactory.listAllDepartments_Full();
		$scope.targetName = "Departments";
		$scope.state = $state.current.name;
		
		$scope.addBadger = function(name, dept_id){
			var newProject = {
				"name":name + "Badger",
				"departmentId":dept_id,
				"deadlineId": 1,
				"resources":[1,3,5]
			};
			var result = DataFactory.getProject(DataFactory.addProject(newProject).id);
			//console.log("Added a Project?");
			var index = DataFactory.getIndexOfId(dept_id,"departments");
			$scope.departments[index].projects.push(newProject);
			//console.log($scope.departments[index].projects);
			//console.log(result);
		}
		
		$scope.getProject_Raw = function(project_id){
			return DataFactory.getProject(project_id);
		};
		$scope.getResource_Raw = function(resource_Id){
			return DataFactory.getResource(resource_Id);
		};
		$scope.getDeadline_Raw = function(deadline_Id){
			return DataFactory.getDeadline(deadline_Id);
		};

		$scope.getDepartment_Full = function(department_id){
			return DataFactory.getDepartment_Full(department_id);
		};
		$scope.getResource_Full = function(resource_Id){
			return DataFactory.getResource_Full(resource_Id);
		};
		$scope.getDeadline_Full = function(deadline_Id){
			return DataFactory.getDeadline_Full(deadline_Id);
		};
		}]);
// Project Controllers:
	app.controller('ProjectController',  ['$scope', 'DataFactory', '$stateParams','$state', function($scope,DataFactory,$stateParams,$state){
		$scope.project = DataFactory.getProject($stateParams.id);
		$scope.state = $state.current;

		$scope.getResource_Raw = function(resource_Id){
			return DataFactory.getResource(resource_Id);
		};
		$scope.getDeadline_Raw = function(deadline_Id){
			return DataFactory.getDeadline(deadline_Id);
		};
		$scope.getDepartment_Raw = function(department_id){
			return DataFactory.getDepartment(department_id);
		};

		$scope.getDepartment_Full = function(department_id){
			return DataFactory.getDepartment_Full(department_id);
		};
		$scope.getResource_Full = function(resource_Id){
			return DataFactory.getResource_Full(resource_Id);
		};
		$scope.getDeadline_Full = function(deadline_Id){
			return DataFactory.getDeadline_Full(deadline_Id);
		};
		}]);
// Resource Controllers:

	app.directive('sortBar', function(){
		// Runs during compile
		return {
			controller: function($scope, $element, $attrs, $transclude, $state) {
				$scope.currentSort = "";
			},
			restrict: 'E', // E = Element, A = Attribute, C = Class, M = Comment
			templateUrl: 'partials/view-sorting.html',
			replace: true,
		};
	});

})()