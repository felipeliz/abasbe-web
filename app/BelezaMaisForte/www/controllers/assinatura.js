var controller = function ($scope, $http, Auth, $location, $state, $ionicHistory) {

   
    $scope.loading = false;
    $scope.assinatura = {};

    $scope.init = function(){
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
            console.log($scope.assinatura);
        }, function (response) {
            if(response.data.ExceptionMessage == 'no_plan'){
                $ionicHistory.nextViewOptions({
                    disableBack: true
                });
                $state.go("menu.assinaturas");
                return;
            }

            $scope.loading = false;
            toastr.error(response.data.ExceptionMessage);
        });
    }

    $scope.cancelar = function(){
        $scope.loading = true;
        $http({
            method: "GET",
            url: api.resolve("api/plano/CancelarAssinatura")
        }).then(function (response) {
            $scope.loading = false;
            toastr.success("Você cancelou sua assinatura!")
            $ionicHistory.nextViewOptions({
                disableBack: true
            });
            $state.go("menu.assinaturas")
        }, function (response) {
            $scope.loading = false;
            toastr.error(response.data.ExceptionMessage);
        });
    }
}

angular.module('app.controllers', []).controller('assinatura', controller)