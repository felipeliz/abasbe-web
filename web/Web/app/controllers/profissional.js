var controller = function ($scope, $rootScope, utils, $http, $location, Auth, Validation, $stateParams, $loading) {

    $scope.form = {
        Id: 0, Nome: "", CPF: "", CEP: "", Situacao: "True",
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
    $scope.equipamentos = [];
    $scope.certificados = [];
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

        $http({
            method: "GET",
            url: "api/equipamento/todos"
        }).then(function mySuccess(response) {
            $scope.equipamentos = response.data;
        }, function myError(response) {
            toastr.error(response.data.ExceptionMessage);
        });

        $http({
            method: "GET",
            url: "api/certificado/todos"
        }).then(function mySuccess(response) {
            $scope.certificados = response.data;
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

    $scope.profissaoPrincipal = function () {
        if ($scope.form.IdProfissao != null && $scope.form.IdProfissao > 0) {
            var prof = $scope.profissoes.find((row) => { return row.Id == $scope.form.IdProfissao })
            if (prof != null) {
                return prof.Descricao;
            }
        }
        return "";
    }

    $scope.getPhoto = function () {
        if ($scope.form.Foto == null || $scope.form.Foto == "") {
            return "assets/img/avatars/photo-camera.png";
        }
        return $scope.form.Foto;
    }

    $scope.getPhotoLista = function (profissional) {
        if (profissional.Foto == null || profissional.Foto == "") {
            return "assets/img/avatars/user.png";
        }
        return profissional.Foto;
    }

    $scope.uploadPhoto = function (file) {
        file.filter = "ImageSquared";
        file.size = 256;
        $http({
            method: "POST",
            url: "api/file/upload",
            data: file
        }).then(function mySuccess(response) {
            $scope.form.Foto = response.data;
            toastr.success("Foto enviada com sucesso.");
        }, function myError(response) {
            toastr.error(response.data.ExceptionMessage);
        });
    };


    $scope.salvar = function () {
        Validation.required("Nome", $scope.form.Nome);
        Validation.required("CPF", $scope.form.CPF);
        Validation.required("Profissão principal", $scope.form.IdProfissao);
        Validation.required("Disponibilidade", $scope.form.IdDisponibilidade);
        Validation.required("Tempo de experiência", $scope.form.TempoExperiencia);
        Validation.required("Pretensão salarial", $scope.form.PretensaoSalarial);
        Validation.required("E-mail", $scope.form.Email);
        Validation.required("Senha", $scope.form.Senha);
        Validation.required("Telefone Celular", $scope.form.TelefoneCelular);
        Validation.required("Estado", $scope.form.IdEstado);
        Validation.required("Cidade", $scope.form.IdCidade);
        console.log($scope.form.Experiencias);
        if (!($scope.form.Experiencias != null && $scope.form.Experiencias.length >= 2)) {
            toastr.error("É obrigatório possuir pelo menos duas experiências profissionais.");
            return;
        }

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


    //// equipamento

    $scope.openEquipamento = function () {
        $scope.equipamento = null;
        UIkit.modal("#equipamento").show();
    }

    $scope.addEquipamento = function () {
        Validation.requiredChild("Equipamento", $scope.equipamento, "Id");
        if ($scope.equipamento != null) {
            if ($scope.form.Equipamentos == null) {
                $scope.form.Equipamentos = [];
            }
            $scope.form.Equipamentos.push({ Id: -1, Equipamento: JSON.parse(JSON.stringify($scope.equipamento)) });
            UIkit.modal("#equipamento").hide();
        }
    }

    $scope.removeEquipamento = function (index) {
        $scope.form.Equipamentos.splice(index, 1);
    }


    //// certificado

    $scope.openCertificado = function () {
        $scope.certificado = null;
        UIkit.modal("#certificado").show();
    }

    $scope.addCertificado = function () {
        Validation.requiredChild("Certificado", $scope.certificado, "Id");
        if ($scope.certificado != null) {
            if ($scope.form.Certificados == null) {
                $scope.form.Certificados = [];
            }
            $scope.form.Certificados.push({ Id: -1, Certificado: JSON.parse(JSON.stringify($scope.certificado)) });
            UIkit.modal("#certificado").hide();
        }
    }

    $scope.removeCertificado = function (index) {
        $scope.form.Certificados.splice(index, 1);
    }

    //// experiencias

    $scope.openExperiencia = function () {
        $scope.experiencia = {};
        UIkit.modal("#experiencia").show();
    }

    $scope.viewExperiencia = function (index) {
        $scope.experiencia = $scope.form.Experiencias[index];
        UIkit.modal("#experienciaView").show();
    }

    $scope.addExperiencia = function () {
        Validation.requiredChild("Profissão", $scope.experiencia.Profissao, "Id");
        Validation.requiredChild("Disponibilidade", $scope.experiencia.Disponibilidade, "Id");
        Validation.required("Telefone", $scope.experiencia.Telefone);
        Validation.required("Data Inicial", $scope.experiencia.DataInicial);

        if ($scope.form.Experiencias == null) {
            $scope.form.Experiencias = [];
        }

        $scope.form.Experiencias.push(JSON.parse(JSON.stringify($scope.experiencia)));
        UIkit.modal("#experiencia").hide();
    }

    $scope.removeExperiencia = function (index) {
        $scope.form.Experiencias.splice(index, 1);
    }

    $scope.mascaraTelefone = function (telefone) {
        if (telefone == null || telefone == undefined || telefone == '') {
            return '-';
        }
        return telefone.replace(/(\d\d)(\d\d\d\d\d)(\d\d\d\d)/, '($1) $2-$3');
    }



}
angular.module('app').controller('profissional', controller);