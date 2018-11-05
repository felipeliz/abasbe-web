var controller = function ($scope, $stateParams, $http) {

    $scope.lista = {};

    $scope.filtrar = function () {
        $http({
            method: "POST",
            url: api.resolve("api/banner/lista"),
            data: {
                Titulo: "",
                page: 0
            }
        }).then(function(response) {
            $scope.lista = response.data;
        }, function(response) {
            console.error(response.data.ExceptionMessage);
        });
    }

    $scope.getImage = function(image){
        return api.resolve(image);
    }
}

angular.module('app.controllers', []).controller('belezaMaisForteCtrl', ['$scope', '$stateParams', '$http', controller])