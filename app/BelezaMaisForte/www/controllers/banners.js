var controller = function ($scope, $http, Auth, $location, $state) {

    $scope.group = {};
    $scope.loading = false;

    $scope.init = function () {
        if (Auth.isLoggedIn()) {
            $scope.filtrar();
        }
        else {
            $state.go("menu.start")
        }
    }

    $scope.filtrar = function () {
        $scope.loading = true;
        $http({
            method: "GET",
            url: api.resolve("api/banner/MeusBanners")
        }).then(function (response) {
            $scope.loading = false;
            $scope.group = response.data;
            console.log(response.data);
        }, function (response) {
            $scope.loading = false;
            console.error(response.data.ExceptionMessage);
        });
    }

    $scope.getImage = function (image) {
        if (obj == null || obj == "") {
            return "imgs/placeholder.png";
        }
        return api.resolve(obj);
    }

    $scope.desabilitar = function (banner) {
        $http({
            method: "GET",
            url: api.resolve("api/banner/desabilitar/" + banner.Id),
            loading: true
        }).then(function (response) {
            $scope.group = response.data;
        }, function (response) {
            console.error(response.data.ExceptionMessage);
        });
    }
}

angular.module('app.controllers', []).controller('banners', controller)