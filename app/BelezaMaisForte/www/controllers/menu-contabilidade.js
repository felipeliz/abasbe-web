var controller = function ($scope, $http, Validation, Auth, $state, $ionicHistory) {

    $scope.goto = function (tipo) {
        $state.go('menu.solicitar-servico', { tipo: tipo });
    }

    $scope.servicos = function () {
        $state.go('menu.meus-servicos');
    }

}
angular.module('app').controller('menu-contabilidade', controller);