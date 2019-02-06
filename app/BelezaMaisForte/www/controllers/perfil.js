var controller = function ($scope, $http, Auth, $location, $state, $ionicHistory, $stateParams) {

    $scope.user = null;
    $scope.id = $stateParams.id == null ? Auth.get().Id : $stateParams.id;
    $scope.loading = false;

    $scope.init = function () {
        $scope.loading = true;
        $http({
            method: "GET",
            url: api.resolve("api/cliente/perfil/" + $scope.id)
        }).then(function (response) {
            $scope.loading = false;
            $scope.user = response.data;
        }, function (response) {
            $scope.loading = false;
            toastr.error(response.data.ExceptionMessage);
        });
    }

    $scope.getPhotoLista = function (obj) {
        if (obj == null || obj.Foto == null || obj.Foto == "") {
            return "imgs/user.png";
        }
        return api.resolve(obj.Foto);
    }

}

angular.module('app.controllers', []).controller('perfil', controller)