﻿var controller = function ($scope, $rootScope, utils, $http, $location, Auth, Validation, $stateParams, $loading) {

    $scope.IsAdmin = (Auth.isLoggedIn() ? Auth.get().FlagAdministrador : false);

    $scope.form = { Id: 0, Nome: "", Email: "", Senha: "", TelefoneCelular: "", DataExpiracao: "", Situacao: "True", CPF: "", FlagCliente: "A" };
    $scope.lista = {};
    $scope.estados = [];
    $scope.cidades = [];
    $scope.filter = {
        Nome: "",
        NomeEmpresa: "",
        Cnpj: "",
        Cpf: "",
        Cidade: "",
        Situacao: "True"
    };
    $scope.edicao = false;

    $scope.init = function () {
        if (typeof ($stateParams.id) == "string") {
            $scope.carregarListas();
            $scope.carregarEditar($stateParams.id);
        }
        else if ($location.path() == "/associado") {
            $scope.filtrar(0, true);
        }
        else {
            $scope.carregarListas();
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
            $scope.carregarCidades(response.data.IdEstado);
        }, function myError(response) {
            $loading.hide();
            toastr.error(response.data.ExceptionMessage);
            $scope.voltar();
        });
    }

    $scope.carregarListas = function () {
        $http({
            method: "GET",
            url: "api/estado/todos"
        }).then(function mySuccess(response) {
            $scope.estados = response.data;
        }, function myError(response) {
            toastr.error(response.data.ExceptionMessage);
        });
    }

    $scope.checkCep = function () {
        if ($scope.form.CEP != null && $scope.form.CEP.length == 8) {
            $http({
                method: "GET",
                url: "https://viacep.com.br/ws/" + $scope.form.CEP + "/json",
                token: false
            }).then(function mySuccess(response) {
                if (response.data.erro == null) {
                    $scope.form.Bairro = response.data.bairro;
                    $scope.form.Logradouro = response.data.logradouro;
                    for (var i in $scope.estados) {
                        var estado = $scope.estados[i];
                        if (estado.Sigla.toLowerCase() == response.data.uf.toLowerCase()) {
                            $scope.form.IdEstado = estado.Id;
                            $scope.carregarCidades(estado.Id, response.data.localidade);
                        }
                    }
                }
            });
        }
    }

    $scope.carregarCidades = function (idEstado, c) {
        if (idEstado != null) {
            $loading.show();
            $http({
                method: "GET",
                url: "api/estado/cidades/" + idEstado
            }).then(function mySuccess(response) {
                $loading.hide();
                $scope.cidades = response.data;

                if (c != null) {
                    for (var i in $scope.cidades) {
                        var cidade = $scope.cidades[i];
                        if (cidade.Nome.toLowerCase() == c.toLowerCase()) {
                            $scope.form.IdCidade = cidade.Id;
                        }
                    }
                }

            }, function myError(response) {
                $loading.hide();
                toastr.error(response.data.ExceptionMessage);
            });
        }
    }

    $scope.salvar = function () {
        Validation.required("Nome Responsável", $scope.form.Nome);
        Validation.required("CPF", $scope.form.CPF);
        Validation.required("E-mail", $scope.form.Email);
        Validation.required("Data Expiração", $scope.form.DataExpiracao);
        Validation.required("Senha", $scope.form.Senha);

        if ($scope.form.FlagCliente == "E") {
            Validation.required("Razão Social", $scope.form.NomeEmpresa);
            Validation.required("CNPJ", $scope.form.Cnpj);
        }

        Validation.required("Cidade", $scope.form.IdCidade);

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

    $scope.getPhoto = function () {
        if ($scope.form.Foto == null || $scope.form.Foto == "") {
            return "assets/img/avatars/photo-camera.png";
        }
        return $scope.form.Foto;
    }

    $scope.getPhotoLista = function (obj) {
        if (obj.Foto == null || obj.Foto == "") {
            return "assets/img/avatars/user.png";
        }
        return obj.Foto;
    }

    $scope.uploadPhoto = function (file) {
        $loading.show();
        file.filter = "ImageSquared";
        file.size = 256;
        $http({
            method: "POST",
            url: "api/file/upload",
            data: file
        }).then(function mySuccess(response) {
            $loading.hide();
            $scope.form.Foto = response.data;
            toastr.success("Foto enviada com sucesso.");
        }, function myError(response) {
            $loading.hide();
            toastr.error(response.data.ExceptionMessage);
        });
    };

}
angular.module('app').controller('associado', controller);