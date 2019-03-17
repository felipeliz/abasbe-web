var controller = function ($scope, $http, Auth, $rootScope, $state, $ionicActionSheet) {

    $scope.banners = [];
    $scope.loading = false;
    $scope.filter = {
        tipo: 0,
        page: 0,
        status: ''
    }
    $scope.lastUpdate = (new Date()).getTime();
    $scope.canUpdate = true;

    $scope.init = function () {
        if (Auth.isLoggedIn()) {
            $scope.mudarTipo(0);
        }
        else {
            $state.go("menu.start")
        }
    }

    $scope.mudarTipo = function (t) {
        $scope.filter.tipo = t;
        switch (t) {
            case 0: $scope.reset('ESPERA'); break;
            case 1: $scope.reset('EXIBICAO'); break;
            case 2: $scope.reset('EXPIRADO'); break;
        }
    }

    $scope.getStatus = function () {
        switch ($scope.filter.tipo) {
            case 0: return 'Em Espera'; break;
            case 1: return 'Em Exibição'; break;
            case 2: return 'Expirados'; break;
        }
    }

    $scope.reset = function (status) {
        $scope.canUpdate = true;
        $scope.filter.page = 0;
        $scope.filter.status = status;
        $scope.filtrar();
    }

    $scope.filtrar = function () {

        console.log('searching page: ' + $scope.filter.page);
        $scope.lastUpdate = (new Date()).getTime();
        if ($scope.filter.page == 0) {
            $scope.banners = [];
        }

        $http({
            method: "POST",
            url: api.resolve("api/banner/MeusBanners"),
            data: $scope.filter,
            loading: true
        }).then(function (response) {
            if (response.data.length == 0) {
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
            console.error(response.data.ExceptionMessage);
        });
    }

    $scope.openBanner = function (banner) {
        if (banner.Link != null) {
            cordova.InAppBrowser.open(banner.Link, '_blank', 'location=no,footer=yes,closebuttoncaption=Fechar,closebuttoncolor=#333333');
        }
        else {
            window.location.href = "tel:" + banner.Telefone;
        }
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
        if (image == null || image == "") {
            return "imgs/placeholder.png";
        }
        return api.resolve(image);
    }

    $scope.showAction = function (banner, index) {
        var hideSheet = $ionicActionSheet.show({
            destructiveText: 'Excluir',
            titleText: 'Selecione uma opção...',
            cancelText: 'Cancelar',
            cancel: function () {
                hideSheet();
            },
            destructiveButtonClicked: function () {
                $scope.desabilitar(banner, index);
                hideSheet();
            }
        });
    }

    $scope.desabilitar = function (banner, index) {
        $http({
            method: "GET",
            url: api.resolve("api/banner/desabilitar/" + banner.Id),
            loading: true
        }).then(function (response) {
            if (response.data) {
                $scope.banners.splice(index, 1);
            }
        }, function (response) {
            console.error(response.data.ExceptionMessage);
        });
    }
}

angular.module('app.controllers', []).controller('banners', controller)