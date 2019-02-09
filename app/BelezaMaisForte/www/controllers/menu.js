var controller = function ($scope, Auth, $state, $ionicHistory, $http, $rootScope) {
    $scope.user = {}
    $scope.loggedIn = Auth.isLoggedIn();

    if ($rootScope.busca == null) {
        $rootScope.busca = {
            profissao: "",
            disponibilidade: "",
            sexo: "",
            cidade: "",
            experiencia: 1,
            bairro: "",
            delivery: false
        }
    }

    $scope.$watch(function () { return Auth.isLoggedIn(); }, function () {
        $scope.loggedIn = Auth.isLoggedIn();
        $scope.user = Auth.get();
    })

    $scope.logout = function () {
        Auth.logout();
        $ionicHistory.nextViewOptions({
            disableBack: true
        });
        $state.go("menu.start");
    }

    $scope.getPhotoLista = function () {
        var obj = Auth.get();
        if (obj.Foto == null || obj.Foto == "") {
            return "imgs/user.png";
        }
        return api.resolve(obj.Foto);
    }

    $scope.go = function (page) {
        $ionicHistory.nextViewOptions({
            disableBack: true
        });
        $state.go(page);
    }

    $scope.assinaturaGo = function () {
        $http({
            method: "GET",
            url: api.resolve("api/cliente/assinante"),
            loading: true
        }).then(function (response) {
            $ionicHistory.nextViewOptions({
                disableBack: true
            });
            if (response.data) {
                $state.go("menu.assinatura");
            }
            else {
                $state.go("menu.assinaturas");
            }
        }, function (response) {
            toastr.error(response.data.ExceptionMessage);
        });
    }
}

angular.module('app.controllers', []).controller('menu', controller)