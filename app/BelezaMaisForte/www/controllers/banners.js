var controller = function ($scope, $http, Auth, $location, $state) {

    $scope.group = {};

    $scope.init = function(){
        if(Auth.isLoggedIn()) {
            $scope.filtrar();
        }
        else {
            $state.go("menu.start")
        }
    }

    $scope.filtrar = function () {
        $http({
            method: "GET",
            url: api.resolve("api/banner/MeusBanners")
        }).then(function(response) {
            $scope.group = response.data;
        }, function(response) {
            console.error(response.data.ExceptionMessage);
        });
    }

    $scope.getImage = function(image){
        console.log(image);
        return api.resolve(image);
    }
}

angular.module('app.controllers', []).controller('banners', controller)