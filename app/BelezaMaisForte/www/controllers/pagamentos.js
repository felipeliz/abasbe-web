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

    $scope.pagar = function (id) {
        $http({
            method: "GET",
            url: api.resolve("api/pagamento/Pagar/" + id),
            loading: true
        }).then(function (response) {
            if(response.data != null) {
                window.open(response.data, '_system', 'location=yes');
            }
            else {
                toastr.error("Tivemos um problema ao gerar seu link de pagamento, tente novamente");
            }
        }, function (response) {
            toastr.error(response.data.ExceptionMessage);
        });
    }
}

angular.module('app.controllers', []).controller('pagamentos', controller)