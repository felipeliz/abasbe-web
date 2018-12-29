var controller = function ($scope, $http, Auth, $location, $state, $ionicHistory) {

    $scope.loading = false;
    $scope.planos = [];
    $scope.selecionado = {};

    $scope.init = function(){
       $scope.carregar();
    }

    $scope.carregar = function(){
        $scope.loading = true;
        $http({
            method: "GET",
            url: api.resolve("api/plano/PlanosAssinatura")
        }).then(function (response) {
            $scope.loading = false;
            $scope.planos = response.data;
        }, function (response) {
            if(response.data.ExceptionMessage == "has_plan") {
                $ionicHistory.nextViewOptions({
                    disableBack: true
                });
                $state.go("menu.assinatura");
                return;
            }

            $scope.loading = false;
            toastr.error(response.data.ExceptionMessage);
        });
    }

    $scope.select = function(plano){
        for(var i in $scope.planos){
            $scope.planos[i].selecionado = false;
        }
        plano.selecionado = true;
    }

    $scope.assinar = function(){
        var plano = null;
        for(var i in $scope.planos){
            if($scope.planos[i].selecionado == true) {
                plano = $scope.planos[i];
            }
        }

        if(plano == null) {
            toastr.error('Você precisa selecionar um plano');
            return;
        }

        $scope.loading = true;
        $http({
            method: "POST",
            url: api.resolve("api/plano/assinar"),
            data: plano
        }).then(function (response) {
            $scope.loading = false;
            toastr.success("Você iniciou uma assinatura!")
            $ionicHistory.nextViewOptions({
                disableBack: true
            });
            $state.go("menu.assinatura");
        }, function (response) {
            $scope.loading = false;
            toastr.error(response.data.ExceptionMessage);
        });
    }

}

angular.module('app.controllers', []).controller('assinaturas', controller)