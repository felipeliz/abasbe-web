var controller = function ($scope, $http, Auth, $location, $state, $ionicHistory) {

   
    $scope.loading = false;
    $scope.assinatura = {};

    $scope.init = function () {
        $scope.carregar();
    }

    $scope.carregar = function(){
        $scope.loading = true;
        $http({
            method: "GET",
            url: api.resolve("api/cliente/MinhaAssinatura")
        }).then(function (response) {
            $scope.loading = false;
            $scope.assinatura = response.data;
        }, function (response) {
            $scope.loading = false;
            toastr.error(response.data.ExceptionMessage);
        });
    }

    $scope.cancelar = function(){
        $http({
            method: "GET",
            url: api.resolve("api/plano/CancelarAssinatura"),
            loading: true
        }).then(function (response) {
            toastr.success("Você cancelou sua assinatura!")
            $ionicHistory.nextViewOptions({
                disableBack: true
            });
            $state.go("menu.assinaturas")
        }, function (response) {
            toastr.error(response.data.ExceptionMessage);
        });
    }
}

angular.module('app.controllers', []).controller('assinatura', controller)