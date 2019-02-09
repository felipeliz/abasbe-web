var controller = function ($scope, $http, $ionicScrollDelegate) {

    $scope.banners = [];
    $scope.lastUpdate = (new Date()).getTime();
    $scope.filter = { page: 0 }
    $scope.total = "-";

    $scope.init = function(){
        $scope.filtrar();

        $http({
            method: "GET",
            url: api.resolve("api/cliente/total"),
            loading: true
        }).then(function(response) {
           $scope.total = response.data;
        }, function(response) {
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
        }).then(function(response) {
            $scope.lastUpdate = (new Date()).getTime();
            if($scope.filter.page > 0) {
                $scope.banners = $scope.banners.concat(response.data);
            }
            else {
                $scope.banners = response.data;
            }
        }, function(response) {
            toastr.error(response.data.ExceptionMessage);
        });
    }

    $scope.checkScroll = function() {
        var canUpdate = $scope.lastUpdate + 500 < (new Date()).getTime();
        var scrollTopCurrent = $ionicScrollDelegate.getScrollPosition().top;
        var scrollTopMax = $ionicScrollDelegate.getScrollView().__maxScrollTop;
        var scrollBottom = scrollTopMax - scrollTopCurrent;

        console.log($ionicScrollDelegate);

        
        if (!scrollBottom) {
            if ($scope.loading == false && canUpdate) {
                $scope.lastUpdate = (new Date()).getTime();
                $scope.filter.page += 1; 
                $scope.filtrar();
            }
       }
   }

    $scope.getImage = function(image){
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