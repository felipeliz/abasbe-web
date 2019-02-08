var controller = function ($http, $scope, $rootScope, $state) {

    $scope.form = {};

    $scope.init = function () {
        $scope.carregarCertificados();
    }

    $scope.carregarCertificados = function () {
        $http({
            method: "GET",
            url: api.resolve("api/certificado/todos")
        }).then(function mySuccess(response) {
            $scope.certificados = response.data;
        }, function myError(response) {
            toastr.error(response.data.ExceptionMessage);
        });
    }

    $scope.adicionarCertificados = function () {
        $rootScope.cadastro.Certificados = $rootScope.cadastro.Certificados == null ? [] : $rootScope.cadastro.Certificados;
        var certificado = JSON.parse(JSON.stringify($scope.form));
        $rootScope.cadastro.Certificados.push(certificado);
        $state.go("menu.cadastro");
    }

}

angular.module('app.controllers', []).controller('certificados', controller)