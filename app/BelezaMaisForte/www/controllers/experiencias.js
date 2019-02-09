var controller = function ($http, $scope, $rootScope, $state, Validation, $ionicHistory) {

    $scope.profissoes = [];
    $scope.disponibilidades = [];
    $scope.form = {};

    $scope.init = function () {
        if($rootScope.cadastro == null){
            $ionicHistory.nextViewOptions({
                disableBack: true
            });
            $state.go("menu.cadastro");
        }
        $scope.carregarListas();
    }
    
    $scope.carregarListas = function () {
        $http({
            method: "GET",
            url: api.resolve("api/profissao/todos")
        }).then(function mySuccess(response) {
            $scope.profissoes = response.data;
        }, function myError(response) {
            toastr.error(response.data.ExceptionMessage);
        });
    }
    $scope.adicionarExperiencia = function () {
        Validation.required("Nome do Estabelecimento", $scope.form.Empresa);
        Validation.required("Profissão", $scope.form.Profissao);
        Validation.required("Telefone", $scope.form.Telefone);
        Validation.required("Data Inicial", $scope.form.DataInicial);

        $rootScope.cadastro.Experiencias = $rootScope.cadastro.Experiencias == null ? [] : $rootScope.cadastro.Experiencias;
        var experiencia = JSON.parse(JSON.stringify($scope.form));
        $rootScope.cadastro.Experiencias.push(experiencia);
        $state.go("menu.cadastro");
    }

}

angular.module('app.controllers', []).controller('experiencias', controller)