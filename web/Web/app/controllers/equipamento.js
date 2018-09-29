var controller = function ($scope, $rootScope, utils, $http, $location, Auth, Validation, $stateParams) {

    $scope.form = { Descricao: "" };
    $scope.lista = {};
    $scope.filter = {
        Descricao: "",
    };
    $scope.edicao = false;

    $scope.init = function () {
        //if (Auth.isLoggedIn()) {
        //    $location.path('/dashboard');
        //}
        //else {
        if (typeof ($stateParams.id) == "string") {
            $scope.carregarEditar($stateParams.id);
        }
        else if ($location.path() == "/equipamento") {
            $scope.filtrar();
        }
        //}
    }

    $scope.filtrar = function (page) {
        $scope.filter.page = page == null ? 0 : page;
        $http({
            method: "POST",
            url: "api/equipamento/lista",
            data: $scope.filter
        }).then(function mySuccess(response) {
            $scope.lista = response.data;

            if ($scope.lista.list.length == 0) {
                toastr.info('A pesquisa não retornou resultado');
            }

        }, function myError(response) {
            toastr.error(response.data.ExceptionMessage);
        });
    }

    $scope.editar = function (id) {
        $location.path("/equipamento/form/" + id);
    }

    $scope.carregarEditar = function (id) {
        $scope.edicao = true;
        $http({
            method: "GET",
            url: "api/equipamento/obter/" + id
        }).then(function mySuccess(response) {
            $scope.form = response.data;
        }, function myError(response) {
            toastr.error(response.data.ExceptionMessage);
            $scope.voltar();
        });
    }

    $scope.salvar = function () {

        Validation.required("Descricao", $scope.form.Descricao);
        $http({
            method: "POST",
            url: "api/equipamento/salvar",
            data: $scope.form
        }).then(function mySuccess(response) {
            toastr.success("Registro salvo com sucesso!");
            $scope.voltar();
        }, function myError(response) {
            toastr.error(response.data.ExceptionMessage);
        });
    }

    $scope.voltar = function () {
        $location.path("/equipamento");
    }

    $scope.novo = function () {
        $location.path("/equipamento/form");
    }

    $scope.excluir = function (id) {
        $http({
            method: "GET",
            url: "api/equipamento/excluir/" + id
        }).then(function mySuccess(response) {
            $scope.filtrar();
        }, function myError(response) {
            toastr.error(response.data.ExceptionMessage);
        });
    }
}
angular.module('app').controller('equipamento', controller);