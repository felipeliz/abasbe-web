var controller = function ($scope, $rootScope, utils, $http, $location, Auth, Validation, $stateParams, $loading) {

    $scope.IsAdmin = (Auth.isLoggedIn() ? Auth.get().FlagAdministrador : false);

    $scope.form = { Descricao: "", Dias: "", Valor: '', TipoPlano: "" };
    $scope.lista = {};
    $scope.filter = {
        Descricao: "",
        TipoPlano: ""
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
        Validation.required("Vezes", $scope.form.Vezes);
        Validation.required("Dias", $scope.form.Dias);
        if ($scope.form.TipoPlano != 'A' && $scope.form.TipoPlano != 'B' && $scope.form.TipoPlano != 'P') {
            toastr.error('O campo Tipo de Plano é obrigatório.');
            return;
        }

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

    $scope.retornarTipoPlano = function (tipoPlano) {
        switch (tipoPlano) {
            case 'B': return 'Banner';
            case 'A': return 'Associado';
            case 'P': return 'Profissional';
            default: return 'Desconhecido';
        }
    }
}
angular.module('app').controller('plano', controller);