var controller = function ($scope, $rootScope, utils, $http, $location, Auth, Validation, $stateParams, $loading) {

    $scope.form = { Id: 0, Nome: "", Email: "", Senha: "", Telefone: "", DataExpiracao: "", Situacao: "True" };
    $scope.lista = {};
    $scope.filter = {
        Nome: "",
    };
    $scope.edicao = false;

    $scope.init = function () {
        if (typeof ($stateParams.id) == "string") {
            $scope.carregarEditar($stateParams.id);
        }
        else if ($location.path() == "/associado") {
            $scope.filtrar(0, true);
        }
    }

    $scope.filtrar = function (page, silent) {
        $loading.show();
        $scope.filter.page = page == null ? 0 : page;
        $http({
            method: "POST",
            url: "api/associado/lista",
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
        $location.path("/associado/form/" + id);
    }

    $scope.carregarEditar = function (id) {
        $scope.edicao = true;
        $loading.show();
        $http({
            method: "GET",
            url: "api/associado/obter/" + id
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
        Validation.required("Nome", $scope.form.Nome);
        Validation.required("Nome da Empresa", $scope.form.NomeEmpresa);
        Validation.required("CNPJ", $scope.form.Cnpj);
        Validation.required("E-mail", $scope.form.Email);
        Validation.required("Data Expiração", $scope.form.DataExpiracao);
        Validation.required("Senha", $scope.form.Senha);
        $loading.show();
        $http({
            method: "POST",
            url: "api/associado/salvar",
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
        $location.path("/associado");
    }

    $scope.novo = function () {
        $location.path("/associado/form");
    }

    $scope.excluir = function (id) {
        $loading.show();
        $http({
            method: "GET",
            url: "api/associado/excluir/" + id
        }).then(function mySuccess(response) {
            $loading.hide();
            $scope.filtrar();
        }, function myError(response) {
            $loading.hide();
            toastr.error(response.data.ExceptionMessage);
        });
    }


}
angular.module('app').controller('associado', controller);