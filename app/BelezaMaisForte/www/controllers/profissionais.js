var controller = function ($scope, $http, $state, $rootScope) {

    $scope.profissionais = [];

    $scope.init = function () {
        $scope.filtrar();
    }

    $scope.filtrar = function () {
        if ($rootScope.busca == null) {
            $state.go("menu.buscar");
            return;
        }

        $scope.loading = true;
        $http({
            method: "POST",
            url: api.resolve("api/profissional/buscar"),
            data: $rootScope.busca
        }).then(function (response) {
            $scope.loading = false;
            $scope.profissionais = response.data;
        }, function (response) {
            $scope.loading = false;
            toastr.error(response.data.ExceptionMessage);
        });
    }

    $scope.getPhotoLista = function (obj) {
        if (obj.Foto == null || obj.Foto == "") {
            return "imgs/user.png";
        }
        return api.resolve(obj.Foto);
    }
}

angular.module('app.controllers', []).controller('profissionais', controller)