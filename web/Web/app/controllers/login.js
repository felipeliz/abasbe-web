var controller = function ($scope, $rootScope, utils, $http, $location, Auth) {

    $scope.form = {};

    $scope.init = function () {
        if (Auth.isLoggedIn()) {
            $location.path('/dashboard');
        }
    }

    $scope.login = function () {
        $http({
            method: "POST",
            url: "api/usuario/login",
            data: $scope.form
        }).then(function mySuccess(response) {
            Auth.set(response.data);
            $location.path('/dashboard');
        }, function myError(response) {
            toastr.error(response.data.ExceptionMessage);
        });
    }
}
angular.module('app').controller('login', controller);