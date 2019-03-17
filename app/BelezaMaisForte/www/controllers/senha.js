var controller = function ($scope, $http, Validation, Auth, $state, $ionicHistory) {

    $scope.form = { anterior: "", nova: "", confirmar: "" };

    $scope.alterar = function () {
        Validation.required("Senha Anterior", $scope.form.anterior);
        Validation.required("Nova Senha", $scope.form.nova);
        Validation.required("Confirmar Senha", $scope.form.confirmar);

        $http({
            method: "POST",
            url: api.resolve("api/cliente/senha"),
            data: $scope.form,
            loading: true
        }).then(function mySuccess(response) {
            toastr.success("Sua senha foi alterada com sucesso");
            $scope.start();
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
angular.module('app').controller('senha', controller);