/*
 *  Altair Admin angularjs
 *  controller
 */
var app = angular.module('app');

app.controller('mainController', function ($scope, $rootScope) {

});

app.controller('restrictedController', function ($scope, $rootScope, Auth, $location) {
    $scope.user = {};

    $scope.$watch(Auth.isLoggedIn, function () {
        $scope.user = Auth.get();
    });

    if (!Auth.isLoggedIn()) {
        Auth.logout();
        $location.path('/login');
    }
});

app.controller('headerController', function ($timeout, $scope, $window, Auth, $location) {
    $scope.user = {};

    $scope.$watch(Auth.isLoggedIn, function () {
        $scope.user = Auth.get();
    });

    $scope.getPhoto = function () {
        if ($scope.user == null || $scope.user.Foto == null || $scope.user.Foto == "") {
            return "assets/img/avatars/user.png";
        }
        return $scope.user.Foto;
    }

    $scope.alterar = function () {
        $location.path("/alterarsenha");
    }

    $scope.sair = function () {
        Auth.logout();
        $location.path("/login");
    }
});

app.controller('sidebarController', function ($timeout, $scope, $rootScope, Auth) {

    $scope.sections = [];
    (function loader() {
        var user = Auth.get();
        $scope.sections.push({ title: 'Dashboard', icon: 'home', link: 'restricted.layout.dashboard' });
        $scope.sections.push({ title: 'Usuários', icon: 'home', link: 'restricted.layout.usuario-lista' });
        $scope.sections.push({ title: 'Associados', icon: 'home', link: 'restricted.layout.associado-lista' });
        $scope.sections.push({ title: 'Certificados', icon: 'home', link: 'restricted.layout.certificado-lista' });
        $scope.sections.push({ title: 'Profissões', icon: 'home', link: 'restricted.layout.profissao-lista' });
    })();


});
