var controller = function ($scope, $http, $state, Validation) {

    $scope.form = { Id: 0, Titulo: "", Descricao: "", IdTipoAcao: 0, IdPlano: -1, Situacao: "E" };
    $scope.planos = [];

    $scope.init = function () {
        $scope.carregarListas();
    }

    $scope.carregarListas = function () {
        $http({
            method: "GET",
            url: api.resolve("api/plano/PlanosBanner")
        }).then(function mySuccess(response) {
            $scope.planos = response.data;
        }, function myError(response) {
            toastr.error(response.data.ExceptionMessage);
        });
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
            url: api.resolve("api/banner/publicar"),
            data: $scope.form
        }).then(function mySuccess(response) {
            toastr.success("Banner cadastrado com sucesso!");
            $scope.pagamentos();
        }, function myError(response) {
            toastr.error(response.data.ExceptionMessage);
        });
    }

    $scope.pagamentos = function () {
        $state.go("menu.pagamentos");
    }
}

angular.module('app.controllers', []).controller('publicar', controller)
