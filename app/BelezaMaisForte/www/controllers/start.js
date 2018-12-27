var controller = function ($scope, $http, $state) {

    $scope.banners = [];
    $scope.loading = false;

    $scope.init = function(){
        $scope.filtrar();
    }

    $scope.filtrar = function () {
        $scope.loading = true;
        $http({
            method: "GET",
            url: api.resolve("api/banner/EmExibicao")
        }).then(function(response) {
            $scope.loading = false;
            $scope.banners = response.data;
        }, function(response) {
            $scope.loading = false;
            toastr.error(response.data.ExceptionMessage);
        });
    }

    $scope.getImage = function(image){
        console.log(image);
        return api.resolve(image);
    }

    $scope.getPhotoLista = function (obj) {
        if (obj.Foto == null || obj.Foto == "") {
            return "imgs/user.png";
        }
        return api.resolve(obj.Foto);
    }
}

angular.module('app.controllers', []).controller('start', controller)