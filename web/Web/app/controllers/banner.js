var controller = function ($scope, $rootScope, utils, $http, $location, Auth, Validation, $stateParams, $loading) {

    $scope.form = { Titulo: "", Descricao: "" };
    $scope.lista = {};
    $scope.filter = {
        Titulo: "",
    };
    $scope.edicao = false;

    $scope.init = function () {
        if (typeof ($stateParams.id) == "string") {
            $scope.carregarEditar($stateParams.id);
        }
        else if ($location.path() == "/banner") {
            $scope.filtrar(0, true);
        }
    }

    $scope.filtrar = function (page, silent) {
        $loading.show();
        $scope.filter.page = page == null ? 0 : page;
        $http({
            method: "POST",
            url: "api/banner/lista",
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
        $location.path("/banner/form/" + id);
    }

    $scope.carregarEditar = function (id) {
        $scope.edicao = true;
        $loading.show();
        $http({
            method: "GET",
            url: "api/banner/obter/" + id
        }).then(function mySuccess(response) {
            $loading.hide();
            $scope.form = response.data;
        }, function myError(response) {
            $loading.hide();
            toastr.error(response.data.ExceptionMessage);
            $scope.voltar();
        });
    }

    $scope.getPhoto = function () {
        if ($scope.form.Imagem == null || $scope.form.Imagem == "") {
            return "assets/img/banner-prototype.png";
        }
        return $scope.form.Imagem;
    }

    $scope.uploadPhoto = function (file) {
        file.filter = "ImageSquared";
        file.size = 1024;
        $http({
            method: "POST",
            url: "api/file/upload",
            data: file
        }).then(function mySuccess(response) {
            $scope.form.Imagem = response.data;
            toastr.success("Imagem enviada com sucesso.");
        }, function myError(response) {
            toastr.error(response.data.ExceptionMessage);
        });
    };

    $scope.salvar = function () {

        Validation.required("Título", $scope.form.Titulo);
        Validation.required("Data de Expiração", $scope.form.Expiracao);
        Validation.required("Descrição", $scope.form.Descricao);
        Validation.required("Imagem", $scope.form.Imagem);

        $loading.show();
        $http({
            method: "POST",
            url: "api/banner/salvar",
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
        $location.path("/banner");
    }

    $scope.novo = function () {
        $location.path("/banner/form");
    }

    $scope.excluir = function (id) {
        $loading.show();
        $http({
            method: "GET",
            url: "api/banner/excluir/" + id
        }).then(function mySuccess(response) {
            $loading.hide();
            $scope.filtrar();
        }, function myError(response) {
            $loading.hide();
            toastr.error(response.data.ExceptionMessage);
        });
    }


}
angular.module('app').controller('banner', controller);