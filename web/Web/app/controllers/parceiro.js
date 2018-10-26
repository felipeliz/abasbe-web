var controller = function ($scope, $rootScope, utils, $http, $location, Auth, Validation, $stateParams, $loading) {

    $scope.form = { Id: 0, Nome: "", Email: "", Senha: "", Telefone: "", DataExpiracao: "", Situacao: "True" };
    $scope.lista = {};
    $scope.filter = {
        Nome: "",
        NomeEmpresa: "",
        Cnpj: "",
        Situacao: "Todas"
    };
    $scope.edicao = false;

    $scope.init = function () {
        if (typeof ($stateParams.id) == "string") {
            $scope.carregarEditar($stateParams.id);
        }
        else if ($location.path() == "/parceiro") {
            $scope.filtrar(0, true);
        }
    }

    $scope.filtrar = function (page, silent) {
        $loading.show();
        $scope.filter.page = page == null ? 0 : page;
        $http({
            method: "POST",
            url: "api/parceiro/lista",
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
        $location.path("/parceiro/form/" + id);
    }

    $scope.carregarEditar = function (id) {
        $scope.edicao = true;
        $loading.show();
        $http({
            method: "GET",
            url: "api/parceiro/obter/" + id
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
        Validation.required("Razão Social", $scope.form.NomeEmpresa);
        Validation.required("CNPJ", $scope.form.Cnpj);
        Validation.required("Nome Responsável", $scope.form.Nome);
        Validation.required("E-mail", $scope.form.Email);
        Validation.required("Data Expiração", $scope.form.DataExpiracao);
        Validation.required("Senha", $scope.form.Senha);
        $loading.show();
        $http({
            method: "POST",
            url: "api/parceiro/salvar",
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
        $location.path("/parceiro");
    }

    $scope.novo = function () {
        $location.path("/parceiro/form");
    }

    $scope.excluir = function (id) {
        $loading.show();
        $http({
            method: "GET",
            url: "api/parceiro/excluir/" + id
        }).then(function mySuccess(response) {
            $loading.hide();
            $scope.filtrar();
        }, function myError(response) {
            $loading.hide();
            toastr.error(response.data.ExceptionMessage);
        });
    }


}
angular.module('app').controller('parceiro', controller);