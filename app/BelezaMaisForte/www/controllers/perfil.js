var controller = function ($scope, $http, Auth, $location, $state, $ionicHistory, $stateParams, $rootScope) {

    $scope.user = null;
    $scope.id = $stateParams.id == null ? Auth.get().Id : $stateParams.id;
    $scope.loading = false;
    $scope.tab = 0;
    $scope.habilidades = [];
    $scope.isMe = Auth.get().Id == $scope.id;

    $scope.init = function () {
        $scope.loading = true;
        $http({
            method: "GET",
            url: api.resolve("api/cliente/perfil/" + $scope.id)
        }).then(function (response) {
            $scope.loading = false;
            $scope.user = response.data;
            $scope.habilidades = $scope.getHabilidades();
        }, function (response) {
            $scope.loading = false;
            toastr.error(response.data.ExceptionMessage);
        });
    }

    $scope.getImagem = function (obj) {
        if (obj == null || obj == "") {
            return "imgs/placeholder.png";
        }
        return api.resolve(obj);
    }

    $scope.editar = function () {
        $state.go("menu.editar", { id: $scope.id })
    }

    $scope.getPhotoLista = function (obj) {
        if (obj == null || obj.Foto == null || obj.Foto == "") {
            return "imgs/user.png";
        }
        return api.resolve(obj.Foto);
    }

    $scope.getHabilidades = function () {
        if ($scope.user == null || $scope.user.Curriculo == null || $scope.user.Curriculo.Habilidades == null) {
            return [];
        }
        return $scope.user.Curriculo.Habilidades.split(',');
    }

    $scope.ligar = function () {
        window.location.href = "tel:" + $scope.user.TelefoneCelular;
    }

    $scope.setTab = function (idx) {
        $scope.tab = idx;
        $rootScope.updateScroll();
    }

}

angular.module('app.controllers', []).controller('perfil', controller)