var controller = function ($scope, $http, Auth, $location, $state, $ionicHistory, $stateParams) {
   
    $scope.user = null;
    $scope.id = $stateParams.id == null ? Auth.get().Id : $stateParams.id;

    $scope.init = function () {
        $http({
            method: "GET",
            url: api.resolve("api/profissional/obter/" + $scope.id)
        }).then(function (response) {
            $scope.user = response.data;
        }, function (response) {
            toastr.error(response.data.ExceptionMessage);
        });
    }

}

angular.module('app.controllers', []).controller('perfil', controller)