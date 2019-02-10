var controller = function ($scope, Auth, $state, $ionicHistory, $http, $rootScope, $ionicSideMenuDelegate) {
    $scope.user = {}
    $scope.loggedIn = Auth.isLoggedIn();
    $scope.expiry = "";

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

    $scope.$watch(function () {
        return $ionicSideMenuDelegate.getOpenRatio();
    }, function (ratio) {
        if (ratio == 1) {
            $scope.getExpiry();
        }
    });

    $scope.getExpiry = function () {
        if ($scope.user != null) {
            $http({
                method: "GET",
                url: api.resolve("api/cliente/DiasParaExpirar")
            }).then(function (response) {
                if (response.data > 1) {
                    $scope.expiry = "Sua assinatura expira em " + response.data + " dias";
                }
                else if (response.data == 1) {
                    $scope.expiry = "Sua assinatura expira hoje";
                }
                else {
                    $scope.expiry = "Sua assinatura expirou";
                }
            }, function (response) {
                toastr.error(response.data.ExceptionMessage);
            });
        }
    }
}

angular.module('app.controllers', []).controller('menu', controller)