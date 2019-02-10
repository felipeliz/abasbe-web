var controller = function ($http, $scope, $rootScope, $state, Validation, $ionicHistory) {

    $scope.form = {};

    $scope.init = function () {
        if($rootScope.cadastro == null){
            $ionicHistory.nextViewOptions({
                disableBack: true
            });
            $state.go("menu.cadastro");
        }
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
        Validation.required("Equipamentos", $scope.form.Equipamento);

        $rootScope.cadastro.Equipamentos = $rootScope.cadastro.Equipamentos == null ? [] : $rootScope.cadastro.Equipamentos;
        var equipamento = JSON.parse(JSON.stringify($scope.form));
        $rootScope.cadastro.Equipamentos.push(equipamento);
        console.log(equipamento);
        $state.go("menu.cadastro");
    }

}

angular.module('app.controllers', []).controller('equipamentos', controller)