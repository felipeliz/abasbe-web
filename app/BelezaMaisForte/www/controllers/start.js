var controller = function ($scope, $http, $ionicScrollDelegate, $rootScope) {

    $scope.banners = [];
    $scope.lastUpdate = (new Date()).getTime();
    $scope.canUpdate = true;
    $scope.filter = { page: 0 }
    $scope.total = "-";

    $scope.rodape = {
        link: "",
        texto: ""
    }

    $scope.openLink = function (link) {
        window.open(link, '_system', 'location=yes');
    }

    $scope.init = function () {
        $scope.filtrar();

        $http({
            method: "GET",
            url: api.resolve("api/cliente/total"),
            loading: true
        }).then(function (response) {
            $scope.total = response.data;
        }, function (response) {
            toastr.error(response.data.ExceptionMessage);
        });

        $http({
            method: "GET",
            url: api.resolve("api/parametro/obter/LinkRodapeApp"),
            loading: true
        }).then(function (response) {
            $scope.rodape.link = response.data;
        }, function (response) {
            toastr.error(response.data.ExceptionMessage);
        });

        $http({
            method: "GET",
            url: api.resolve("api/parametro/obter/TextoRodapeApp"),
            loading: true
        }).then(function (response) {
            $scope.rodape.texto = response.data;
        }, function (response) {
            toastr.error(response.data.ExceptionMessage);
        });
    }

    $scope.filtrar = function () {
        console.log('searching page: ' + $scope.filter.page);
        $scope.lastUpdate = (new Date()).getTime();
        $http({
            method: "POST",
            url: api.resolve("api/banner/EmExibicao"),
            data: $scope.filter,
            loading: true
        }).then(function (response) {
            if(response.data.length == 0){
                $scope.canUpdate = false;
            }

            $scope.$broadcast('scroll.infiniteScrollComplete');
            $scope.lastUpdate = (new Date()).getTime();
            if ($scope.filter.page > 0) {
                $scope.banners = $scope.banners.concat(response.data);
            }
            else {
                $scope.banners = response.data;
            }
        }, function (response) {
            $scope.$broadcast('scroll.infiniteScrollComplete');
            toastr.error(response.data.ExceptionMessage);
        });
    }

    $scope.onInfinite = function () {
        if ($scope.lastUpdate + 1500 < (new Date()).getTime() && $rootScope.loading == false && $scope.canUpdate) {
            $scope.filter.page++;
            $scope.filtrar();
        }
        else {
            setTimeout(() => {
                $scope.$broadcast('scroll.infiniteScrollComplete');
            }, 500);
        }
    };

    $scope.getImage = function (image) {
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