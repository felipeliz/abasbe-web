var controller = function ($scope, $http, $location, Auth, $state, $ionicHistory) {

    $scope.form = {};

    $scope.init = function () {
        if (Auth.isLoggedIn()) {
            $scope.start();
        }
    }

    $scope.login = function () {
        $http({
            method: "POST",
            url: api.resolve("api/cliente/login"),
            data: $scope.form
        }).then(function mySuccess(response) {
            Auth.set(response.data);
            $scope.start();
        }, function myError(response) {
            console.log(response.data);
            toastr.error(response.data.ExceptionMessage);
        });
    }

    $scope.start = function(){
        $ionicHistory.nextViewOptions({
            disableBack: true
        });
        $state.go('menu.start');
    }
}
angular.module('app').controller('login', controller);