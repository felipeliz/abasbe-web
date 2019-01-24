var controller = function ($http, $scope, $rootScope, $state) {

    $scope.estados = [];
    $scope.form = {};

    $scope.init = function () {
        $scope.carregarEquipamentos();
    }

    $scope.carregarEquipamentos = function () {
        $http({
            method: "GET",
            url: api.resolve("api/equipamento/todos")
        }).then(function mySuccess(response) {
            $scope.equipamentos = response.data;
        }, function myError(response) {
            toastr.error(response.data.ExceptionMessage);
        });
    }

    $scope.adicionarEquipamentos = function () {
        $rootScope.cadastro.Equipamentos = $rootScope.cadastro.Equipamentos == null ? [] : $rootScope.cadastro.Equipamentos;
        var equipamento = JSON.parse(JSON.stringify($scope.form.Equipamento));
        $rootScope.cadastro.Equipamentos.push(equipamento);
        console.log(equipamento);
        $state.go("menu.cadastro");
    }

}

angular.module('app.controllers', []).controller('equipamentos', controller)