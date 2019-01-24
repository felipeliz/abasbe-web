var controller = function ($scope, $http, Auth, $location, $state, $ionicHistory) {
    
    $scope.form = { IdTipoAcao: 0 };
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
        if ($scope.form.Imagem == null || $scope.form.Imagem == "") {
            return "imgs/banner-prototype.png";
        }
        return api.resolve($scope.form.Imagem);
    }

    $scope.uploadPhoto = function (file) {
        file.filter = "ImageSquared";
        file.size = 1024;
        $http({
            method: "POST",
            url: api.resolve("api/file/upload"),
            data: file
        }).then(function mySuccess(response) {
            $scope.form.Imagem = response.data;
            toastr.success("Imagem enviada com sucesso.");
        }, function myError(response) {
            toastr.error(response.data.ExceptionMessage);
        });
    };
    
    $scope.mudarTipo = function (tipo) {
        $scope.form.IdTipoAcao = tipo;
    }

    $scope.salvar = function () {
        Validation.required("Título", $scope.form.Titulo);
        Validation.required("Data de Estreia", $scope.form.Estreia);
        Validation.required("Descrição", $scope.form.Descricao);
        Validation.required("Situacao", $scope.form.Situacao);
        if ($scope.form.IdTipoAcao == 0) {
            Validation.required("Link", $scope.form.Link);
        }
        else {
            Validation.required("Telefone", $scope.form.Telefone);
        }
        Validation.required("Imagem", $scope.form.Imagem);
        Validation.required("Plano", $scope.form.IdPlano);

        $http({
            method: "POST",
            url: api.resolve("api/banner/salvar"),
            data: $scope.form
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

}
angular.module('app.controllers', []).controller('cadastro', controller)