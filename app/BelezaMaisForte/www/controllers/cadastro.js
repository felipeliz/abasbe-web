var controller = function ($scope, $http, Auth, $state, $ionicHistory, $rootScope, $ionicScrollDelegate, Validation, $stateParams) {

    $scope.estados = [];
    $scope.cidades = [];
    $scope.profissoes = [];
    $scope.disponibilidades = [];
    $scope.editing = false;

    $scope.init = function () {
        if ($rootScope.cadastro != null && $rootScope.cadastro.keepContext == true) {
            $rootScope.cadastro.keepContext = false;
        }
        else {
            $rootScope.cadastro = { IdTipoAcao: 0, Situacao: 1, Curriculo: { TempoExperiencia: "1" } };
            $rootScope.cadastro.Curriculo.Fotos = [{ Imagem: "imgs/placeholder.png" }, { Imagem: "imgs/placeholder.png" }, { Imagem: "imgs/placeholder.png" }];
        }

        if ($stateParams.id != null) {
            if ($stateParams.id != Auth.get().Id) {
                $scope.start('menu.start');
                return;
            }

            $scope.editing = true;
            $http({
                method: "GET",
                url: api.resolve("api/cliente/perfil/" + $stateParams.id),
                loading: true
            }).then(function (response) {
                $rootScope.cadastro = response.data;
                if (response.data.Curriculo != null) {
                    $rootScope.cadastro.IdTipoAcao = 1;
                }
                else {
                    $rootScope.cadastro.IdTipoAcao = 0;
                }
                $scope.carregarCidades(response.data.IdEstado);
            }, function (response) {
                toastr.error(response.data.ExceptionMessage);
            });
        }
        $scope.carregarListas();
    }

    $scope.getImagem = function (obj) {
        if (obj == null || obj == "") {
            return "imgs/placeholder.png";
        }
        return api.resolve(obj);
    }

    $scope.carregarListas = function () {
        $http({
            method: "GET",
            url: api.resolve("api/estado/Todos")
        }).then(function mySuccess(response) {
            $scope.estados = response.data;
        }, function myError(response) {
            toastr.error(response.data.ExceptionMessage);
        });

        $http({
            method: "GET",
            url: api.resolve("api/profissao/todos")
        }).then(function mySuccess(response) {
            $scope.profissoes = response.data;
        }, function myError(response) {
            toastr.error(response.data.ExceptionMessage);
        });

        $http({
            method: "GET",
            url: api.resolve("api/disponibilidade/todos")
        }).then(function mySuccess(response) {
            $scope.disponibilidades = response.data;
        }, function myError(response) {
            toastr.error(response.data.ExceptionMessage);
        });

    }


    $scope.carregarCidades = function (idEstado) {
        if (idEstado != null) {
            $http({
                method: "GET",
                url: api.resolve("api/estado/Cidades/") + idEstado
            }).then(function mySuccess(response) {
                $scope.cidades = response.data;
            }, function myError(response) {
                toastr.error(response.data.ExceptionMessage);
            });
        }
    }

    $scope.getPhoto = function () {
        if ($rootScope.cadastro == null || $rootScope.cadastro.Foto == null || $rootScope.cadastro.Foto == "") {
            return "imgs/add-picture.jpg";
        }
        return api.resolve($rootScope.cadastro.Foto);
    }

    $scope.uploadPhoto = function (file) {
        file.filter = "ImageSquared";
        file.size = 256;
        $http({
            method: "POST",
            url: api.resolve("api/file/upload"),
            data: file,
            loading: true
        }).then(function mySuccess(response) {
            $rootScope.cadastro.Foto = response.data;
            toastr.success("Imagem enviada com sucesso.");
        }, function myError(response) {
            toastr.error(response.data.ExceptionMessage);
        });
    };

    $scope.uploadImg = function (file, index) {
        file.filter = "ImageSquared";
        file.size = 512;
        $http({
            method: "POST",
            url: api.resolve("api/file/upload"),
            data: file
        }).then(function mySuccess(response) {
            $rootScope.cadastro.Curriculo.Fotos[index].Imagem = response.data;
            toastr.success("Imagem enviada com sucesso.");
        }, function myError(response) {
            toastr.error(response.data.ExceptionMessage);
        });
    };

    $scope.mudarTipo = function (tipo) {
        $rootScope.cadastro.IdTipoAcao = tipo;
        $rootScope.updateScroll();
    }

    $scope.salvar = function () {
        Validation.required("Nome", $rootScope.cadastro.Nome);
        Validation.required("CPF", $rootScope.cadastro.CPF);
        Validation.required("E-mail", $rootScope.cadastro.Email);
        Validation.required("Senha", $rootScope.cadastro.Senha);
        Validation.required("Cidade", $rootScope.cadastro.IdCidade);

        if ($rootScope.cadastro.IdTipoAcao == 0) {
            $scope.salvarAssociado();
        }
        else {
            $scope.salvarProfissional();
        }
    }

    $scope.salvarAssociado = function () {

        $rootScope.cadastro.FlagCliente = "A";
        if ($rootScope.cadastro.Empresa == true) {
            $rootScope.cadastro.FlagCliente = "E";
            Validation.required("CNPJ", $rootScope.cadastro.Cnpj);
            Validation.required("Razão Social", $rootScope.cadastro.NomeEmpresa);
        }

        $http({
            method: "POST",
            url: api.resolve("api/associado/salvar"),
            data: $rootScope.cadastro,
            loading: true
        }).then(function mySuccess(response) {
            if ($scope.editing) {
                toastr.success("Seu perfil foi atualizado com sucesso!");
                $scope.login('menu.start');
            }
            else {
                toastr.success("Seu perfil foi cadastrado com sucesso!");
                $scope.login('menu.assinaturas');
            }
        }, function myError(response) {
            toastr.error(response.data.ExceptionMessage);
        });
    }

    $scope.salvarProfissional = function () {

        Validation.required("Profissão principal", $rootScope.cadastro.Curriculo.IdProfissao);
        Validation.required("Disponibilidade", $rootScope.cadastro.Curriculo.IdDisponibilidade);
        Validation.required("Tempo de experiência", $rootScope.cadastro.Curriculo.TempoExperiencia);
        Validation.required("Pretensão salarial", $rootScope.cadastro.Curriculo.PretensaoSalarial);
        Validation.required("Técnicas e Habilidades", $rootScope.cadastro.Curriculo.Habilidades);
        Validation.required("Telefone Celular", $rootScope.cadastro.TelefoneCelular);

        $http({
            method: "POST",
            url: api.resolve("api/profissional/salvar"),
            data: $rootScope.cadastro,
            loading: true
        }).then(function mySuccess(response) {
            toastr.success("Perfil cadastrado com sucesso!");
            $scope.login('menu.start');
        }, function myError(response) {
            toastr.error(response.data.ExceptionMessage);
        });
    }

    $scope.login = function (tela) {
        var param = { email: $rootScope.cadastro.Email, senha: $rootScope.cadastro.Senha };

        $http({
            method: "POST",
            url: api.resolve("api/cliente/login"),
            data: param,
            loading: true
        }).then(function mySuccess(response) {
            Auth.set(response.data);
            $scope.start(tela);
        }, function myError(response) {
            console.log(response.data);
            toastr.error(response.data.ExceptionMessage);
        });
    }

    $scope.start = function (tela) {
        $ionicHistory.nextViewOptions({
            disableBack: true
        });
        $state.go(tela);
    }

    $scope.$on('$ionicView.afterEnter', function () {
        if ($rootScope.cadastro != null && $rootScope.cadastro.scroll == "bottom") {
            $rootScope.cadastro.scroll = null;
            $ionicScrollDelegate.scrollBottom();
        }
    });

    $scope.openEquipamento = function () {
        $rootScope.cadastro.keepContext = true;
        $rootScope.cadastro.scroll = "bottom";
        $state.go("menu.equipamentos");
    }

    $scope.openCertificado = function () {
        $rootScope.cadastro.keepContext = true;
        $rootScope.cadastro.scroll = "bottom";
        $state.go("menu.certificados");
    }

    $scope.openExperiencias = function () {
        $rootScope.cadastro.keepContext = true;
        $rootScope.cadastro.scroll = "bottom";
        $state.go("menu.experiencias");
    }

    $scope.removeEquipamento = function (index) {
        $rootScope.cadastro.Equipamentos.splice(index, 1);
    }

    $scope.removeCertificado = function (index) {
        $rootScope.cadastro.Certificados.splice(index, 1);
    }

    $scope.removeExperiencia = function (index) {
        $rootScope.cadastro.Experiencias.splice(index, 1);
    }

    $scope.getExperiencia = function (val) {
        switch (val)
        {
            case "1": return "Iniciante";
            case "2": return  "Intermediário"; 
            case "3": return  "Avançado"; 
            case "4": return  "Especialista"; 
            default: return  ""; 
        }
    }

}
angular.module('app.controllers', []).controller('cadastro', controller)