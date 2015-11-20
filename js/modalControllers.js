(function(){
	var app = angular.module('ModalModule', ['ui.bootstrap', 'FactoryModule']);
	//var app = angular.module('FactoryModule', ['ui.bootstrap', 'ModalModule']);

	app.controller('UpdateModalController', ['$scope', '$uibModalInstance', 'dataModel', 'DataFactory', function($scope, $uibModalInstance ,dataModel, DF){
		$scope.dataModel = dataModel;
		
		$scope.uniqueDept = false;
		$scope.uniqueRes = false;
		$scope.addResourceObj = undefined;

		var departmentList = DF.listAllDepartments();
		var resourceList = DF.listAllResources();
		var deadlineList = DF.listAllDeadlines();

		$scope.departments = departmentList;
		$scope.resources = resourceList;
		$scope.deadlines = deadlineList;

		var brandNewDeadline = undefined;
		$scope.brandNewResources = [];

		$scope.resourcesNotInProject = function(){
			//console.info("resourcesNotInProject Called!");
			var output = [];
			for (var i = resourceList.length - 1; i >= 0; i--) {
				
				var masterListPerson = resourceList[i];			
				var isProjectPerson = false;
				
				for (var j = dataModel.resources.length - 1; j >= 0; j--) {
					
					var currentModelListPersonId = dataModel.resources[j];
					
					if (masterListPerson.id == currentModelListPersonId){
						isProjectPerson = true;
						break;
					}
				}
				if (isProjectPerson == false){
					output.push(masterListPerson);
				}
			}
			return output;
		}
		$scope.insertResourceInCorrectList = function(){
			if ($scope.addResourceObj !== undefined){
				//console.log("ResourceObj",$scope.addResourceObj);
				if($scope.uniqueRes){
					$scope.brandNewResources.push($scope.addResourceObj);
					$scope.uniqueRes = false;
				}
				else{
					$scope.dataModel.resources.push($scope.addResourceObj);
				}
				$scope.addResourceObj = undefined;

			}
		}
		$scope.removeResourceFromProject =function(id){
			var index = dataModel.resources.indexOf(id);
			//console.log("removal",index);
			dataModel.resources.splice(index, 1);
		}
		$scope.removeResourceFromStagingArea = function(id){
			var index = $scope.brandNewResources.indexOf(id);
			$scope.brandNewResources.splice(index,1);
		}

		$scope.getDepartment = function(deptID){
			return DF.getDepartment(deptID);
		};
		$scope.getResource = function(resID){
			return DF.getResource(resID);
		};
		$scope.getDeadline = function(deadID){
			return DF.getDeadline(deadID);
		};


		//hacks to fix the typeaheads
		$scope.formatDeptLabel = function(model){
			var foundALabel = undefined;
			for (var i = 0; i < $scope.departments.length; i++){
				if (model == $scope.departments[i].id){
					foundALabel = $scope.departments[i].name;
				}
			}
			if (foundALabel){ 
				return foundALabel; 
			}
			else{
				return null;
			}
		}
		$scope.formatResLabel = function(model){
			var foundALabel = undefined;
			for (var i = 0; i < $scope.resourcesNotInProject(dataModel.resources).length; i++){
				if (model == $scope.resourcesNotInProject(dataModel.resources)[i].id){
					foundALabel = $scope.resourcesNotInProject(dataModel.resources)[i].name;
				}
			}
			if (foundALabel){
				return foundALabel;
			}
			else{
				return null;
			}
		}

		$scope.ok = function(){
			// Ok, lets assess the damage here...

			if ($scope.uniqueDept){
				//console.log("Unique Dept",dataModel.departmentId);
				var newDept = DF.addDepartment(dataModel.departmentId);
				if (newDept){
					dataModel.departmentId = newDept.id;
				}
			}
			if($scope.brandNewResources.length > 0){
				//TODO: Add the new ones to the regestrey, and then to the project.
				for (var i = 0; i < $scope.brandNewResources.length; i++){
					var newResource = DF.addResource($scope.brandNewResources[i]);
					if (newResource){
						dataModel.resources.push(newResource.id);
					}
				}
			}

			//Then, once all our eyes are crossed and teas are dotted, we pass this baby onward.
			$uibModalInstance.close(dataModel);
		};

		$scope.cancel = function(){
			// No harm, no foul. Reset everything to the backup model.
			$uibModalInstance.dismiss();
		};
	}]);
})()
