var controller = function ($scope, $rootScope, utils, $http, $location, Auth, Validation, $stateParams, $loading, $window) {
    $scope.lista = {};
    $scope.detalheContabillidade = {};
    $scope.filter = {
        Nome: "",
        Status: 0
    };


    $scope.init = function () {
        if (typeof ($stateParams.id) == "string") {
            $scope.carregarEditar($stateParams.id);
        }
        else if (!$location.path().endsWith('/form')) {
            $scope.filtrar(0, true);
        }
    }

    $scope.getStatus = function (sts) {
        $scope.filter.Status = sts;
        $scope.filtrar(0, false);
    }

    $scope.filtrar = function (page, silent) {
        $loading.show();
        $scope.filter.page = page == null ? 0 : page;
        $http({
            method: "POST",
            url: "api/ServicoContabil/lista",
            data: $scope.filter
        }).then(function mySuccess(response) {
            $loading.hide();
            $scope.lista = response.data;
            if ((silent == null || silent == false) && $scope.lista.list.length == 0) {
                toastr.info('A pesquisa não retornou resultado');
            }
        }, function myError(response) {
            $loading.hide();
            toastr.error(response.data.ExceptionMessage);
        });
    }

    $scope.detalhe = function (id) {
        $loading.show();
        $scope.detalheContabillidade = {};
        $http({
            method: "GET",
            url: "api/ServicoContabil/obter/" + id
        }).then(function mySuccess(response) {
            $loading.hide();
            UIkit.modal("#detalhe").show();
            $scope.detalheContabillidade = response.data;
        }, function myError(response) {
            $loading.hide();
            toastr.error(response.data.ExceptionMessage);
        });
    }


    $scope.changeStatus = function (contabilidade) {
        $loading.show();
        $http({
            method: "POST",
            url: "api/ServicoContabil/mudarStatus",
            data: contabilidade
        }).then(function mySuccess(response) {
            $loading.hide();
            toastr.success("Status atualizado com sucesso");
            var page = $scope.filter.page == null ? 0 : $scope.filter.page;
            $scope.filtrar(page, false);
        }, function myError(response) {
            $loading.hide();
            toastr.error(response.data.ExceptionMessage);
        });
    }

}
angular.module('app').controller('contabilidade', controller);