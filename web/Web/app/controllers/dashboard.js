var controller = function ($scope, $rootScope, utils, $http, $location, Auth, Validation, $loading) {
    $scope.QtdAssociados = "";
    $scope.QtdBanners = "";
    $scope.QtdProfissionais = "";


    $scope.init = function () {
        $scope.obterQtdProfissionais();
        $scope.obterQtdBanners();
        $scope.obterQtdAssociados();
    }

    $scope.obterQtdProfissionais = function () {
        //$loading.show();
        $http({
            method: "POST",
            url: "api/profissional/ObterQtdProfissionaisAtivosETotal",
            data: undefined
        }).then(function mySuccess(response) {
            //$loading.hide();
            $scope.QtdProfissionais = response.data;
        }, function myError(response) {
            //$loading.hide();
            toastr.error(response.data.ExceptionMessage);
        });
    }

    $scope.obterQtdBanners = function () {
        //$loading.show();
        $http({
            method: "POST",
            url: "api/banner/ObterQtdBannersAtivosETotal",
            data: undefined
        }).then(function mySuccess(response) {
            //$loading.hide();
            $scope.QtdBanners = response.data;
        }, function myError(response) {
            //$loading.hide();
            toastr.error(response.data.ExceptionMessage);
        });
    }

    $scope.obterQtdAssociados = function () {
        $loading.show();
        $http({
            method: "POST",
            url: "api/associado/ObterQtdAssociadosAtivosETotal",
            data: undefined
        }).then(function mySuccess(response) {
            $loading.hide();
            $scope.QtdAssociados = response.data;
        }, function myError(response) {
            $loading.hide();
            toastr.error(response.data.ExceptionMessage);
        });
    }
}
angular.module('app').controller('dashboard', controller);