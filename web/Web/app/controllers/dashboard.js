var controller = function ($scope, $rootScope, utils, $http, $location, Auth, Validation, $loading) {

    $scope.IsAdmin = (Auth.isLoggedIn() ? Auth.get().FlagAdministrador : false);

    $scope.QtdAssociados = "";
    $scope.QtdBanners = "";
    $scope.QtdProfissionais = "";


    $scope.init = function () {
        $scope.obterQtdProfissionais();
    }

    $scope.obterQtdProfissionais = function () {
        $loading.show();
        $http({
            method: "POST",
            url: "api/profissional/ObterQtdProfissionaisAtivosETotal",
            data: undefined
        }).then(function mySuccess(response) {
            $scope.QtdProfissionais = response.data;
            $scope.obterQtdBanners();
        }, function myError(response) {
            toastr.error(response.data.ExceptionMessage);
        });
    }

    $scope.obterQtdBanners = function () {
        $http({
            method: "POST",
            url: "api/banner/ObterQtdBannersAtivosETotal",
            data: undefined
        }).then(function mySuccess(response) {
            $scope.QtdBanners = response.data;
            $scope.obterQtdAssociados();
        }, function myError(response) {
            toastr.error(response.data.ExceptionMessage);
        });
    }

    $scope.obterQtdAssociados = function () {
        $http({
            method: "POST",
            url: "api/associado/ObterQtdAssociadosAtivosETotal",
            data: undefined
        }).then(function mySuccess(response) {
            $loading.hide();
            $scope.QtdAssociados = response.data;
        }, function myError(response) {
            toastr.error(response.data.ExceptionMessage);
        });
    }
}
angular.module('app').controller('dashboard', controller);