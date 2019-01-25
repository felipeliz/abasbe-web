var controller = function ($http, $scope, $rootScope, $state) {

    $scope.profissoes = [];
    $scope.disponibilidades = [];
    $scope.form = {};

    $scope.init = function () {
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
        $rootScope.cadastro.Experiencias = $rootScope.cadastro.Experiencias == null ? [] : $rootScope.cadastro.Experiencias;
        var experiencia = JSON.parse(JSON.stringify($scope.form));
        $rootScope.cadastro.Experiencias.push(experiencia);
        $state.go("menu.cadastro");
    }

}

angular.module('app.controllers', []).controller('experiencias', controller)