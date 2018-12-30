var controller = function ($scope, $http) {

    $scope.loading = false;
    $scope.pagamentos = {};

    $scope.init = function () {
        $scope.carregar();
    }

    $scope.carregar = function () {
        $scope.loading = true;
        $http({
            method: "GET",
            url: api.resolve("api/cliente/MeusPagamentos")
        }).then(function (response) {
            $scope.loading = false;
            $scope.pagamentos = response.data;
        }, function (response) {
            $scope.loading = false;
            toastr.error(response.data.ExceptionMessage);
        });
    }
}

angular.module('app.controllers', []).controller('pagamentos', controller)