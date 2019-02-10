var controller = function ($scope, $http, Auth, $location, $state, $ionicHistory, $rootScope, Validation) {

    $rootScope.cadastro = $rootScope.cadastro == null ? { IdTipoAcao: 0 } : $rootScope.cadastro;
    $scope.estados = [];
    $scope.cidades = [];
    $scope.profissoes = [];
    $scope.disponibilidades = [];


    $scope.init = function () {
        $scope.carregarListas();
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
        if ($rootScope.cadastro.Imagem == null || $rootScope.cadastro.Imagem == "") {
            return "imgs/banner-prototype.png";
        }
        return api.resolve($rootScope.cadastro.Imagem);
    }

    $scope.uploadPhoto = function (file) {
        file.filter = "ImageSquared";
        file.size = 1024;
        $http({
            method: "POST",
            url: api.resolve("api/file/upload"),
            data: file
        }).then(function mySuccess(response) {
            $rootScope.cadastro.Imagem = response.data;
            toastr.success("Imagem enviada com sucesso.");
        }, function myError(response) {
            toastr.error(response.data.ExceptionMessage);
        });
    };

    $scope.mudarTipo = function (tipo) {
        $rootScope.cadastro.IdTipoAcao = tipo;
    }

    $scope.salvar = function () {
        Validation.required("Imagem", $rootScope.cadastro.Imagem);
        Validation.required("Nome", $rootScope.cadastro.Nome);
        Validation.required("CPF", $rootScope.cadastro.CPF);
        Validation.required("Telefone Celular", $rootScope.cadastro.TelefoneCelular);
        Validation.required("E-mail", $rootScope.cadastro.Email);
        Validation.required("Senha", $rootScope.cadastro.Senha);
        Validation.required("CEP", $rootScope.cadastro.CEP);
        Validation.required("Estado", $rootScope.cadastro.IdEstado);
        Validation.required("Cidade", $rootScope.cadastro.IdCidade);
        Validation.required("Bairro", $rootScope.cadastro.Bairro);
        Validation.required("Logradouro", $rootScope.cadastro.Logradouro);
        Validation.required("Data da Expiração", $rootScope.cadastro.DataExpiracao);


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
            data: $rootScope.cadastro
        }).then(function mySuccess(response) {
            toastr.success("Perfil cadastrado com sucesso!");
            $scope.login();
        }, function myError(response) {
            toastr.error(response.data.ExceptionMessage);
        });
    }

    $scope.salvarProfissional = function () {
        
        Validation.required("Profissão", $rootScope.cadastro.IdProfissao);
        Validation.required("Disponibilidade", $rootScope.cadastro.IdDisponibilidade);
        Validation.required("Sexo", $rootScope.cadastro.Sexo);
        Validation.required("Data da Nascimento", $rootScope.cadastro.Nascimento);
        Validation.required("Tempo de experiência", $rootScope.cadastro.TempoExperiencia);
        Validation.required("Pretensão salarial", $rootScope.cadastro.PretensaoSalarial);
        Validation.required("Técnicas e Habilidades", $rootScope.cadastro.Tecnicas);


        if (!($rootScope.cadastro.Experiencias != null && $rootScope.cadastro.Experiencias.length >= 1)) {
            toastr.error("É obrigatório possuir pelo menos uma experiência profissional.");
            return;
        }

        $http({
            method: "POST",
            url: api.resolve("api/profissional/salvar"),
            data: $rootScope.cadastro
        }).then(function mySuccess(response) {
            toastr.success("Perfil cadastrado com sucesso!");
            $scope.login();
        }, function myError(response) {
            toastr.error(response.data.ExceptionMessage);
        });
    }

    $scope.login = function () {        
        var param = { email: $rootScope.cadastro.Email, senha: $rootScope.cadastro.Senha};

        $http({
            method: "POST",
            url: api.resolve("api/cliente/login"),
            data: param,
            loading: true
        }).then(function mySuccess(response) {
            Auth.set(response.data);
            $scope.start();
        }, function myError(response) {
            console.log(response.data);
            toastr.error(response.data.ExceptionMessage);
        });
    }

    $scope.start = function(){
        $ionicHistory.nextViewOptions({
            disableBack: true
        });
        $state.go('menu.start');
    }

    $scope.openEquipamento = function () {
        $state.go("menu.equipamentos");
    }

    $scope.openCertificado = function () {
        $state.go("menu.certificados");
    }

    $scope.openExperiencias = function () {
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

}
angular.module('app.controllers', []).controller('cadastro', controller)