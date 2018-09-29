var controller = function ($scope, $http, $location, Validation, Auth) {

    $scope.form = {};

    $scope.salvar = function () {

        Validation.required("senha anterior", $scope.form.SenhaAnterior);
        Validation.required("nova senha", $scope.form.NovaSenha);
        Validation.required("confirmar senha", $scope.form.ConfirmarSenha);

        $http({
            method: "POST",
            url: "api/usuario/alterarsenha",
            data: $scope.form
        }).then(function mySuccess(response) {
            toastr.success("Sua senha foi alterada com sucesso!");
            $location.path("/dashboard");
        }, function myError(response) {
            toastr.error(response.data.ExceptionMessage);
        });
    }
}
angular.module('app').controller('senha', controller)
