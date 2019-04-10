var controller = function ($scope, $http, Validation, Auth, $state, $ionicHistory) {

    $scope.goto = function (tipo) {
        $state.go('menu.solicitar-servico', { tipo: tipo });
    }

}
angular.module('app').controller('menu-contabilidade', controller);