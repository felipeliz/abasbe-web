var controller = function ($scope, $rootScope, utils, $http, $location, Auth, Validation, $stateParams) {

    $scope.form = { Descricao: "" };
    $scope.lista = {};
    $scope.filter = {
        Descricao: "",
    };
    $scope.edicao = false;

    $scope.init = function () {
        //if (Auth.isLoggedIn()) {
        //    $location.path('/dashboard');
        //}
        //else {
            if (typeof ($stateParams.id) == "string") {
                $scope.carregarEditar($stateParams.id);
            }
            else if($location.path() == "/certificado"){
                $scope.filtrar();
            }
        //}
    }

    $scope.filtrar = function (page) {
        $scope.filter.page = page == null ? 0 : page;
        $http({
            method: "POST",
            url: "api/certificado/lista",
            data: $scope.filter
        }).then(function mySuccess(response) {
            $scope.lista = response.data;

            if ($scope.lista.list.length == 0) {
                toastr.info('A pesquisa não retornou resultado');
            }

        }, function myError(response) {
            toastr.error(response.data.ExceptionMessage);
        });
    }

    $scope.editar = function (id) {
        $location.path("/certificado/form/" + id);
    }

    $scope.carregarEditar = function (id) {
        $scope.edicao = true;
        $http({
            method: "GET",
            url: "api/certificado/obter/" + id
        }).then(function mySuccess(response) {
            $scope.form = response.data;
        }, function myError(response) {
            toastr.error(response.data.ExceptionMessage);
            $scope.voltar();
        });
    }

    $scope.salvar = function () {

        Validation.required("Descricao", $scope.form.Descricao);
        $http({
            method: "POST",
            url: "api/certificado/salvar",
            data: $scope.form
        }).then(function mySuccess(response) {
            toastr.success("Registro salvo com sucesso!");
            $scope.voltar();
        }, function myError(response) {
            toastr.error(response.data.ExceptionMessage);
        });
    }

    $scope.voltar = function () {
        $location.path("/certificado");
    }

    $scope.novo = function () {
        $location.path("/certificado/form");
    }

    $scope.excluir = function (id) {
        $http({
            method: "GET",
            url: "api/certificado/excluir/" + id
        }).then(function mySuccess(response) {
            $scope.filtrar();
        }, function myError(response) {
            toastr.error(response.data.ExceptionMessage);
        });
    }


}
angular.module('app').controller('certificado', controller);