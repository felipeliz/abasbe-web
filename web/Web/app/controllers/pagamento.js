﻿var controller = function ($scope, $rootScope, utils, $http, $location, Auth, Validation, $stateParams, $loading) {

    $scope.IsAdmin = (Auth.isLoggedIn() ? Auth.get().FlagAdministrador : false);

    $scope.lista = {};
    $scope.filter = {
        Data: "",
        Cliente: "",
        TipoPlano: "",
    };
    $scope.edicao = false;

    $scope.init = function () {
            $scope.filtrar(0, true);
            $scope.carregarListas();
        
    }

    $scope.filtrar = function (page, silent) {
        $loading.show();
        $scope.filter.page = page == null ? 0 : page;
        $http({
            method: "POST",
            url: "api/pagamento/lista",
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

    $scope.carregarListas = function () {
        $http({
            method: "GET",
            url: "api/cliente/todos"
        }).then(function mySuccess(response) {
            $scope.clientes = response.data;
        }, function myError(response) {
            toastr.error(response.data.ExceptionMessage);
        });
    }

    $scope.excluir = function (id) {
        $loading.show();
        $http({
            method: "GET",
            url: "api/pagamento/excluir/" + id
        }).then(function mySuccess(response) {
            $loading.hide();
            $scope.filtrar();
        }, function myError(response) {
            $loading.hide();
            toastr.error(response.data.ExceptionMessage);
        });
    }


}
angular.module('app').controller('pagamento', controller);