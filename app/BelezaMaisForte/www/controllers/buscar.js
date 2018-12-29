var controller = function ($scope, $http, $state, $rootScope) {

    $scope.profissoes = [];
    $scope.disponibilidades = [];
    $scope.cidades = [];

    $scope.filtro = {
        profissao: "",
        disponibilidade: "",
        sexo: "",
        cidade: "",
        experiencia: 0,
        bairro: ""
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
        $rootScope.busca = $scope.filtro;
        $state.go("menu.profissionais")
    }

}

angular.module('app.controllers', []).controller('buscar', controller)