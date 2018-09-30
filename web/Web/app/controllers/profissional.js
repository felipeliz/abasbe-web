var controller = function ($scope, $rootScope, utils, $http, $location, Auth, Validation, $stateParams, $loading) {

    $scope.form = {
        Nome: "", CPF: "", CEP: "", Situacao: "True",
        FlagLeiSalaoParceiro: false,
        FlagBiosseguranca: false,
        FlagEpi: false,
        FlagMei: false,
        FlagDiarista: false,
        FlagFilhos: false,
    };
    $scope.lista = {};
    $scope.profissoes = [];
    $scope.disponibilidades = [];
    $scope.estados = [];
    $scope.cidades = [];
    $scope.filter = {
        Nome: "",
        Profissao: "",
        Disponibilidade: "",
        Cidade: "",
        Situacao: "Todas"
    };
    $scope.edicao = false;

    $scope.init = function () {
        if (typeof ($stateParams.id) == "string") {
            $scope.carregarListas();
            $scope.carregarEditar($stateParams.id);
        }
        else if ($location.path() == "/profissional") {
            $scope.filtrar(0, true);
        }
        else {
            $scope.carregarListas();
        }
    }

    $scope.carregarListas = function () {
        $http({
            method: "GET",
            url: "api/profissao/todos"
        }).then(function mySuccess(response) {
            $scope.profissoes = response.data;
        }, function myError(response) {
            toastr.error(response.data.ExceptionMessage);
        });

        $http({
            method: "GET",
            url: "api/disponibilidade/todos"
        }).then(function mySuccess(response) {
            $scope.disponibilidades = response.data;
        }, function myError(response) {
            toastr.error(response.data.ExceptionMessage);
        });

        $http({
            method: "GET",
            url: "api/estado/todos"
        }).then(function mySuccess(response) {
            $scope.estados = response.data;
        }, function myError(response) {
            toastr.error(response.data.ExceptionMessage);
        });
    }

    $scope.carregarCidades = function (idEstado) {
        if (idEstado != null) {
            $loading.show();
            $http({
                method: "GET",
                url: "api/estado/cidades/" + idEstado
            }).then(function mySuccess(response) {
                $loading.hide();
                $scope.cidades = response.data;
            }, function myError(response) {
                $loading.hide();
                toastr.error(response.data.ExceptionMessage);
            });
        }
    }

    $scope.filtrar = function (page, silent) {
        $loading.show();
        $scope.filter.page = page == null ? 0 : page;
        $http({
            method: "POST",
            url: "api/profissional/lista",
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
        $location.path("/profissional/form/" + id);
    }

    $scope.carregarEditar = function (id) {
        $scope.edicao = true;
        $loading.show();
        $http({
            method: "GET",
            url: "api/profissional/obter/" + id
        }).then(function mySuccess(response) {
            $loading.hide();
            $scope.form = response.data;
            $scope.carregarCidades(response.data.IdEstado);
        }, function myError(response) {
            $loading.hide();
            toastr.error(response.data.ExceptionMessage);
            $scope.voltar();
        });
    }

    $scope.salvar = function () {
        Validation.required("Nome", $scope.form.Nome);
        Validation.required("CPF", $scope.form.CPF);
        Validation.required("E-mail", $scope.form.Email);
        Validation.required("Senha", $scope.form.Senha);
        Validation.required("Telefone Celular", $scope.form.TelefoneCelular);
        Validation.required("Nome", $scope.form.Nome);
        Validation.required("Nome", $scope.form.Nome);
        Validation.required("Nome", $scope.form.Nome);
        $loading.show();
        $http({
            method: "POST",
            url: "api/profissional/salvar",
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
        $location.path("/profissional");
    }

    $scope.novo = function () {
        $location.path("/profissional/form");
    }

    $scope.excluir = function (id) {
        $loading.show();
        $http({
            method: "GET",
            url: "api/profissional/excluir/" + id
        }).then(function mySuccess(response) {
            $loading.hide();
            $scope.filtrar();
        }, function myError(response) {
            $loading.hide();
            toastr.error(response.data.ExceptionMessage);
        });
    }


}
angular.module('app').controller('profissional', controller);