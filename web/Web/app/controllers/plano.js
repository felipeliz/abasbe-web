var controller = function ($scope, $rootScope, utils, $http, $location, Auth, Validation, $stateParams, $loading) {

    $scope.form = { Descricao: "", Dias: "", Valor: ''};
    $scope.lista = {};
    $scope.filter = {
        Descricao: ""
    };
    $scope.edicao = false;

    $scope.init = function () {
        if (typeof ($stateParams.id) == "string") {
            $scope.carregarEditar($stateParams.id);
        }
        else if ($location.path() == "/plano") {
            $scope.filtrar(0, true);
        }
    }

    $scope.filtrar = function (page, silent) {
        $loading.show();
        $scope.filter.page = page == null ? 0 : page;
        $http({
            method: "POST",
            url: "api/plano/lista",
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

    $scope.editar = function (id) {
        $location.path("/plano/form/" + id);
    }

    $scope.carregarEditar = function (id) {
        $scope.edicao = true;
        $loading.show();
        $http({
            method: "GET",
            url: "api/plano/obter/" + id
        }).then(function mySuccess(response) {
            $loading.hide();
            $scope.form = response.data;
        }, function myError(response) {
            $loading.hide();
            toastr.error(response.data.ExceptionMessage);
            $scope.voltar();
        });
    }

    $scope.salvar = function () {
        Validation.required("Descrição", $scope.form.Descricao);
        Validation.required("Valor", $scope.form.Valor);
        Validation.required("Dias", $scope.form.Dias);
        $loading.show();
        $http({
            method: "POST",
            url: "api/plano/salvar",
            data: $scope.form
        }).then(function mySuccess(response) {
            $loading.hide();
            toastr.success("Registro salvo com sucesso!");
            $scope.voltar();
        }, function myError(response) {
            $loading.hide();
            toastr.error(response.data.ExceptionMessage);
        });
    }

    $scope.voltar = function () {
        $location.path("/plano");
    }

    $scope.novo = function () {
        $location.path("/plano/form");
    }

    $scope.excluir = function (id) {
        $loading.show();
        $http({
            method: "GET",
            url: "api/plano/excluir/" + id
        }).then(function mySuccess(response) {
            $loading.hide();
            $scope.filtrar();
        }, function myError(response) {
            $loading.hide();
            toastr.error(response.data.ExceptionMessage);
        });
    }
}
angular.module('app').controller('plano', controller);