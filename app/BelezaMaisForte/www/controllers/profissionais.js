var controller = function ($scope, $http, $state, $rootScope, $ionicScrollDelegate) {

    $scope.profissionais = [];
    $scope.lastUpdate = (new Date()).getTime();
    $scope.canUpdate = true;

    $scope.init = function () {
        $rootScope.busca.page = 0;
        $rootScope.busca.Excludes = [];
        $scope.filtrar();
    }

    $scope.filtrar = function () {
        if ($rootScope.busca == null) {
            $state.go("menu.buscar");
            return;
        }

        console.log('searching page: ' + $rootScope.busca.page);
        $scope.lastUpdate = (new Date()).getTime();

        $rootScope.busca.Excludes = [];
        for (var i in $scope.profissionais) {
            $rootScope.busca.Excludes.push($scope.profissionais[i].Id);
        }

        $http({
            method: "POST",
            url: api.resolve("api/profissional/buscar"),
            data: $rootScope.busca,
            loading: true
        }).then(function (response) {
            if (response.data.pageSize > response.data.list.length) {
                $scope.canUpdate = false;
            }
            $scope.$broadcast('scroll.infiniteScrollComplete');

            $scope.lastUpdate = (new Date()).getTime();
            if ($rootScope.busca.page > 0) {
                $scope.profissionais = $scope.profissionais.concat(response.data.list);
            }
            else {
                $scope.profissionais = response.data.list;
            }
        }, function (response) {
            toastr.error(response.data.ExceptionMessage);
            $state.go("menu.buscar");
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