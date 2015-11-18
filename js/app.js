strict:true;

(function(){
	var app = angular.module('OrganizationApp',['ui.router', 'ui.bootstrap','FactoryModule']);
	//console.log("[app.js loaded.]");

	// Notice! I am using Angular Moment. This is purely for asthetics 
	// and in no way is it used to sort things, 
	// I just like plain text time messages. 

	app.config(function($stateProvider, $urlRouterProvider){
		$urlRouterProvider.otherwise('/departments');
		$stateProvider
		//Department States
			.state('departments',{
				url:'/departments',
				views:{
					'@':{
						templateUrl:'partials/departments/all-departments-regular.html',
						controller: 'DepartmentsController'
					}
				}
			}).state('departments.resources',{
				url:'/resources',
				views:{
					'@':{
						templateUrl:'partials/departments/all-departments-resource.html',
						controller: 'DepartmentsController'
					}
				}
			})
		//Deadline States
			.state('deadlines',{
				url:'/deadlines',
				views:{
					'@':{
						templateUrl:'partials/deadlines/all-deadlines-time.html',
						controller:'DeadlinesController'
					}
				}
			})
		//Project States
			.state('projects',{
				url:'/projects',
				views:{
					'@':{
						templateUrl:'partials/projects/all-projects-view.html',
						controller: 'ProjectsController'
					}

				}
			})
			.state('project',{
				url:'/project/{id:int}',
				views:{
					'@':{
						templateUrl:'partials/projects/single-project.html',
						controller:'ProjectController'
					}
				}
			})
	});

// Department Controllers:
	app.controller('DepartmentsController',	['$scope', 'DataFactory', '$state', function($scope,DataFactory, $state){
		$scope.departments = DataFactory.listAllDepartments();
		$scope.targetName = "Departments";

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
	app.controller('DepartmentController', 	['$scope', 'DataFactory', '$stateParams', function($scope,DataFactory,$stateParams){
		$scope.department = DataFactory.getDepartment($stateParams.id);
		}]);
// Project Controllers:
	app.controller('ProjectsController', ['$scope', 'DataFactory',  function($scope,DataFactory){
		$scope.projects = DataFactory.listAllProjects();
		$scope.getDepartment = function(department_id){
			return DataFactory.getDepartment(department_id);
		};
		$scope.getResource = function(resource_Id){
			return DataFactory.getResource(resource_Id);
		};
		$scope.getDeadline = function(deadline_Id){
			return DataFactory.getDeadline(deadline_Id);
		};
		}]);
	app.controller('ProjectController',  ['$scope', 'DataFactory', '$stateParams', function($scope,DataFactory,$stateParams){
		$scope.project = DataFactory.getProject($stateParams.id);
		}]);
// Resource Controllers:
	app.controller('ResourcesController', ['$scope', 'DataFactory',  function($scope,DataFactory){
		$scope.resources = DataFactory.listAllResources();
		$scope.getDepartment = function(department_id){
			return DataFactory.getDepartment(department_id);
		};
		$scope.getProject = function(project_id){
			return DataFactory.getProject(project_id);
		};
		$scope.getDeadline = function(deadline_Id){
			return DataFactory.getDeadline(deadline_Id);
		};
		}]);
	app.controller('ResourceController',  ['$scope', 'DataFactory', '$stateParams', function($scope,DataFactory,$stateParams){
		$scope.resource = DataFactory.getResource($stateParams.id);
		}]);
// Deadline Controllers:
	app.controller('DeadlinesController', ['$scope', 'DataFactory',  function($scope,DataFactory){
		$scope.deadlines = DataFactory.listAllDeadlines();
		$scope.getDepartment = function(department_id){
			return DataFactory.getDepartment(department_id);
		};
		$scope.getResource = function(resource_Id){
			return DataFactory.getResource(resource_Id);
		};
		$scope.getProject = function(project_id){
			return DataFactory.getProject(project_id);
		};
		}]);
	app.controller('DeadlineController',  ['$scope', 'DataFactory', '$stateParams', function($scope,DataFactory,$stateParams){
		$scope.deadline = DataFactory.getDeadline($stateParams.id);
		}]);

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