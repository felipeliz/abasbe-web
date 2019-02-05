var controller = function ($scope, $http, $state, $rootScope) {

    $scope.profissoes = [];
    $scope.disponibilidades = [];
    $scope.cidades = [];

    if ($rootScope.busca == null) {
        $rootScope.busca = {
            profissao: "",
            disponibilidade: "",
            sexo: "",
            cidade: "",
            experiencia: 0,
            bairro: ""
        }
    }

    $scope.init = function () {
        $scope.carregar();
    }

    $scope.carregar = function (image) {
        $http({
            method: "GET",
            url: api.resolve("api/profissao/usados")
        }).then(function (response) {
            $scope.profissoes = response.data;
        }, function (response) {
            toastr.error(response.data.ExceptionMessage);
        });

        $http({
            method: "GET",
            url: api.resolve("api/disponibilidade/usados")
        }).then(function (response) {
            $scope.disponibilidades = response.data;
        }, function (response) {
            toastr.error(response.data.ExceptionMessage);
        });

        $http({
            method: "GET",
            url: api.resolve("api/estado/cidadesUsados")
        }).then(function (response) {
            $scope.cidades = response.data;
        }, function (response) {
            toastr.error(response.data.ExceptionMessage);
        });
    }

    $scope.buscar = function () {
        $state.go("menu.profissionais")
    }

}

angular.module('app.controllers', []).controller('buscar', controller)