var controller = function ($scope, $state, $ionicHistory, $ionicSideMenuDelegate, $ionicNavBarDelegate) {
    $scope.aceitar = function () {
        $ionicHistory.nextViewOptions({
            disableBack: true
        });
        localStorage.setItem("flagContrato", true);
        $state.go('menu.start');
    }
}

angular.module('app.controllers', []).controller('contrato', controller)