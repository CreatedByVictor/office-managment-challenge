strict:true;

(function(){
	var app = angular.module('OrganizationApp',['ui.router', 'ui.bootstrap','FactoryModule', 'angularMoment']);
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
					'root':{
						templateUrl:'partials/view-root.html',
					},
					'title@departments':{
						template:"<h1>All Departments <small>By Project Count</small></h1>"
					},
					'main@departments':{
						templateUrl:'partials/departments/all-departments-project.html',
						controller: 'DepartmentsController'
					}
				}
			})
			.state('departments.by-project',{
				url:'/by-project',
				views:{
					'title@departments':{
						template:"<h1>All Departments <small>By Project Count</small></h1>"
					},
					'main@departments':{
						templateUrl:'partials/departments/all-departments-project.html',
						controller: 'DepartmentsController',
					}
				}
			})
			.state('departments.by-resource',{
				url:'/by-resource',
				views:{
					'title@departments':{
						template:"<h1>All Departments <small>By Resource Count</small></h1>"
					},
					'main@departments':{
						templateUrl:"partials/departments/all-departments-resource.html",
						controller: 'DepartmentsController'
					}
				}
			})
			.state('departments.by-deadline',{
				url:'/by-deadline',
				views:{
					'title@departments':{
						template:"<h1>All Departments <small>By Deadline Date</small></h1>"
					},
					'main@departments':{
						templateUrl:'partials/departments/all-departments-deadline.html',
						controller: 'DepartmentsController'
					}
				}
			})
			//Single Department:
			.state('department',{
				url:'/department/{id:int}',
				views:{
					'root':{
						templateUrl:'partials/view-root.html',
					},
					'title@department':{
						template:"<h1>{{department.name || ''}} <small>Department</small></h1>",
						controller:'DepartmentController'

					},
					"main@department":{
						templateUrl:'partials/departments/single-department.html',
						controller:'DepartmentController'
					}
				}
			})
			//End of Departments.

		//Deadline States
			.state('deadlines',{
				url:'/deadlines',
				templateUrl:'partials/deadlines/all-deadlines-view.html'
			})
			.state('deadline',{
				url:'/deadline/{id:int}',
				templateUrl:'partials/deadlines/single-deadline-view.html'
			})

		//Resource States
			.state('resources',{
				url:'/resources',
				templateUrl:'partials/resources/all-resources-view.html'
			})
			.state('resource',{
				url:'/resource/{id:int}',
				templateUrl:'partials/resources/single-resource-view.html'
			})

		//Project States
			.state('projects',{
				url:'/projects',
				templateUrl:'partials/projects/all-projects-view.html'
			})
			.state('project',{
				url:'/project/{id:int}',
				templateUrl:'partials/projects/single-project-view.html'
			});
	});

// Department Controllers:
	app.controller('DepartmentsController', ['$scope', 'DataFactory',  function($scope,DataFactory){
		$scope.departments = DataFactory.listAllDepartments();
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
	app.controller('ProjectsController', ['$scope', 'DataFactory', '$stateParams', function($scope,DataFactory,$stateParams){
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
	app.controller('ResourceController', ['$scope', 'DataFactory', '$stateParams', function($scope,DataFactory,$stateParams){
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
	app.controller('DeadlineController', ['$scope', 'DataFactory', '$stateParams', function($scope,DataFactory,$stateParams){
		$scope.deadline = DataFactory.getDeadline($stateParams.id);
		}]);

	app.directive('sortBar', function(){
		// Runs during compile
		return {
			controller: function($scope, $element, $attrs, $transclude, $state) {
				$scope.currentSort = "";
			},
			restrict: 'A', // E = Element, A = Attribute, C = Class, M = Comment
			templateUrl: 'partials/view-sorting.html',
			replace: true,
		};
	});

})()