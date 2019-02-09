var controller = function ($http, $scope, $rootScope, $state, Validation, $ionicHistory) {

    $scope.form = {};

    $scope.init = function () {
        if($rootScope.cadastro == null){
            $ionicHistory.nextViewOptions({
                disableBack: true
            });
            $state.go("menu.cadastro");
        }
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
        Validation.required("Tipo de Certificado", $scope.form.Certificado);
        Validation.required("Descrição", $scope.form.Descricao);

        $rootScope.cadastro.Certificados = $rootScope.cadastro.Certificados == null ? [] : $rootScope.cadastro.Certificados;
        var certificado = JSON.parse(JSON.stringify($scope.form));
        $rootScope.cadastro.Certificados.push(certificado);
        $state.go("menu.cadastro");
    }

}

angular.module('app.controllers', []).controller('certificados', controller)