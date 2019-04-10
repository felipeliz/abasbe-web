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
        $scope.sections.push({ title: 'Usuários', icon: 'people', link: 'restricted.layout.usuario-lista' });
        $scope.sections.push({ title: 'Associados', icon: 'recent_actors', link: 'restricted.layout.associado-lista' });
        $scope.sections.push({ title: 'Profissionais', icon: 'supervisor_account', link: 'restricted.layout.profissional-lista' });
        $scope.sections.push({ title: 'Banner', icon: 'insert_photo', link: 'restricted.layout.banner-lista' });
        $scope.sections.push({ title: 'Pagamentos', icon: 'credit_card', link: 'restricted.layout.pagamento-lista' });
        $scope.sections.push({ title: 'Serviços Contábeis', icon: 'attach_money', link: 'restricted.layout.contabilidade-lista' });
        $scope.sections.push({
            title: 'Cadastros Básicos', icon: '&#xE8D2;', submenu:
            [{ title: 'Certificados', link: 'restricted.layout.certificado-lista' },
                { title: 'Disponibilidades', link: 'restricted.layout.disponibilidade-lista' },
                { title: 'Equipamentos', link: 'restricted.layout.equipamento-lista' },
                { title: 'Planos', link: 'restricted.layout.plano-lista' },
                { title: 'Profissões', link: 'restricted.layout.profissao-lista' },
                { title: 'Estados', link: 'restricted.layout.estado-lista' },
                { title: 'Cidades', link: 'restricted.layout.cidade-lista' }]

        });
    })();


});
