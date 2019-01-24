var controller = function ($scope, $http, Auth, $location, $state, $ionicHistory, $rootScope) {
    
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
        Validation.required("Título", $rootScope.cadastro.Titulo);
        Validation.required("Data de Estreia", $rootScope.cadastro.Estreia);
        Validation.required("Descrição", $rootScope.cadastro.Descricao);
        Validation.required("Situacao", $rootScope.cadastro.Situacao);
        if ($rootScope.cadastro.IdTipoAcao == 0) {
            Validation.required("Link", $rootScope.cadastro.Link);
        }
        else {
            Validation.required("Telefone", $rootScope.cadastro.Telefone);
        }
        Validation.required("Imagem", $rootScope.cadastro.Imagem);
        Validation.required("Plano", $rootScope.cadastro.IdPlano);

        $http({
            method: "POST",
            url: api.resolve("api/banner/salvar"),
            data: $rootScope.cadastro
        }).then(function mySuccess(response) {
            toastr.success("Perfil cadastrado com sucesso!");
            $scope.paraOndeEuVou();
        }, function myError(response) {
            toastr.error(response.data.ExceptionMessage);
        });
    }

    $scope.paraOndeEuVou = function () {
        $state.go("menu.pagamentos");
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

    
}
angular.module('app.controllers', []).controller('cadastro', controller)