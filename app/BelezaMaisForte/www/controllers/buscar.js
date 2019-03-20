var controller = function ($scope, $http, $state, $rootScope) {

    $scope.profissoes = [];
    $scope.disponibilidades = [];
    $scope.cidades = [];
    
    $scope.init = function () {
        $scope.carregar();
    }

    $scope.carregar = function (image) {
        $http({
            method: "GET",
            url: api.resolve("api/profissao/usados"),
            loading: true
        }).then(function (response) {
            $scope.profissoes = response.data;
        }, function (response) {
            toastr.error(response.data.ExceptionMessage);
        });

        $http({
            method: "GET",
            url: api.resolve("api/disponibilidade/usados"),
            loading: true
        }).then(function (response) {
            $scope.disponibilidades = response.data;
        }, function (response) {
            toastr.error(response.data.ExceptionMessage);
        });

        $http({
            method: "GET",
            url: api.resolve("api/estado/cidadesUsados"),
            loading: true
        }).then(function (response) {
            $scope.cidades = response.data;
        }, function (response) {
            toastr.error(response.data.ExceptionMessage);
        });
    }

    $scope.buscar = function () {
        $state.go("menu.profissionais")
    }

    $scope.getExperiencia = function (val) {
        switch (val)
        {
            case "1": return "Iniciante";
            case "2": return  "Intermediário"; 
            case "3": return  "Avançado"; 
            case "4": return  "Especialista"; 
            default: return  ""; 
        }
    }

}

angular.module('app.controllers', []).controller('buscar', controller)