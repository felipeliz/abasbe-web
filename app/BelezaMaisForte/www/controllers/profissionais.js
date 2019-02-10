var controller = function ($scope, $http, $state, $rootScope, $ionicScrollDelegate) {

    $scope.profissionais = [];
    $scope.lastUpdate = (new Date()).getTime();
    $scope.canUpdate = true;

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
        $http({
            method: "POST",
            url: api.resolve("api/profissional/buscar"),
            data: $rootScope.busca,
            loading: true
        }).then(function (response) {
            if(response.data.length == 0){
                $scope.canUpdate = false;
            }
            $scope.$broadcast('scroll.infiniteScrollComplete');

            $scope.lastUpdate = (new Date()).getTime();
            if ($rootScope.busca.page > 0) {
                $scope.profissionais = $scope.profissionais.concat(response.data);
            }
            else {
                $scope.profissionais = response.data;
            }
        }, function (response) {
            $scope.$broadcast('scroll.infiniteScrollComplete');
            toastr.error(response.data.ExceptionMessage);
        });
    }

    $scope.perfil = function (profissional) {
        $state.go("menu.perfil", { id: profissional.Id });
    }

    $scope.onInfinite = function () {
        if ($scope.lastUpdate + 1500 < (new Date()).getTime() && $rootScope.loading == false && $scope.canUpdate) {
            $rootScope.busca.page++;
            $scope.filtrar();
        }
        else {
            setTimeout(() => {
                $scope.$broadcast('scroll.infiniteScrollComplete');
            }, 500);
        }
    };

    $scope.getPhotoLista = function (obj) {
        if (obj.Foto == null || obj.Foto == "") {
            return "imgs/user.png";
        }
        return api.resolve(obj.Foto);
    }
}

angular.module('app.controllers', []).controller('profissionais', controller)