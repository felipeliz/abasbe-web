var controller = function ($scope, $http, Validation, Auth, $state, $ionicHistory) {

    $scope.form = { email: "", senha: ""};

    $scope.init = function () {
        if (Auth.isLoggedIn()) {
            $scope.start();
        }
    }

    $scope.login = function () {
        Validation.required("E-mail", $scope.form.email);
        Validation.required("Senha", $scope.form.senha);

        $http({
            method: "POST",
            url: api.resolve("api/cliente/login"),
            data: $scope.form,
            loading: true
        }).then(function mySuccess(response) {
            Auth.set(response.data);
            $scope.start();
        }, function myError(response) {
            console.log(response.data);
            toastr.error(response.data.ExceptionMessage);
        });
    }

    $scope.esqueci = function () {
        Validation.required("E-mail", $scope.form.email);

        $http({
            method: "POST",
            url: api.resolve("api/cliente/esqueceu"),
            data: $scope.form
        }).then(function mySuccess(response) {
            toastr.success("Enviaremos sua senha ao seu e-mail!");
        }, function myError(response) {
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