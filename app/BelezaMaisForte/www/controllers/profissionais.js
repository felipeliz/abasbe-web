var controller = function ($scope, $http, $state, $rootScope, $ionicScrollDelegate) {

    $scope.profissionais = [];
    $scope.lastUpdate = (new Date()).getTime();
    $scope.loading = false;

    $scope.init = function () {
        $rootScope.busca.page = 0;
        $scope.filtrar();
    }

    $scope.filtrar = function () {
        if ($rootScope.busca == null) {
            $state.go("menu.buscar");
            return;
        }

        console.log('searching page: ' + $rootScope.busca.page);
        $scope.lastUpdate = (new Date()).getTime();
        $scope.loading = true;
        $http({
            method: "POST",
            url: api.resolve("api/profissional/buscar"),
            data: $rootScope.busca
        }).then(function (response) {
            $scope.lastUpdate = (new Date()).getTime();
            if ($rootScope.busca.page > 0) {
                $scope.profissionais = $scope.profissionais.concat(response.data);
            }
            else {
                $scope.profissionais = response.data;
            }
            $scope.loading = false;
        }, function (response) {
            $scope.loading = false;
            toastr.error(response.data.ExceptionMessage);
        });
    }

    $scope.perfil = function (profissional) {
        $state.go("menu.perfil", { id: profissional.Id });
    }

    $scope.checkScroll = function () {
        var canUpdate = $scope.lastUpdate + 500 < (new Date()).getTime();
        var scrollTopCurrent = $ionicScrollDelegate.getScrollPosition().top;
        var scrollTopMax = $ionicScrollDelegate.getScrollView().__maxScrollTop;
        var scrollBottom = scrollTopMax - scrollTopCurrent;

        console.log($ionicScrollDelegate);

        if (!scrollBottom) {
            if ($scope.loading == false && canUpdate) {
                $scope.lastUpdate = (new Date()).getTime();
                $rootScope.busca.page += 1;
                $scope.filtrar();
            }
        }
    }

    $scope.getPhotoLista = function (obj) {
        if (obj.Foto == null || obj.Foto == "") {
            return "imgs/user.png";
        }
        return api.resolve(obj.Foto);
    }
}

angular.module('app.controllers', []).controller('profissionais', controller)