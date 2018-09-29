app.config(['$locationProvider', '$stateProvider', '$urlRouterProvider', function ($locationProvider, $stateProvider, $urlRouterProvider) {

    $locationProvider.html5Mode(true).hashPrefix('!');

    // Use $urlRouterProvider to configure any redirects (when) and invalid urls (otherwise).
    $urlRouterProvider
        .when('/login', '/')
        .otherwise('/');

    // -- LOGIN PAGE --
    $stateProvider.state("login", {
        url: "/",
        templateUrl: 'app/views/login.html',
        controller: 'login',
        resolve: {
            deps: ['$ocLazyLoad', function ($ocLazyLoad) {
                return $ocLazyLoad.load([
                    'app/controllers/login.js'
                ]);
            }]
        }
    });

    // -- RESTRICTED --
    $stateProvider.state("restricted", {
        abstract: true,
        templateUrl: 'app/views/restricted.html',
        controller: 'restrictedController',
        resolve: {
            deps: ['$ocLazyLoad', function ($ocLazyLoad) {
                return $ocLazyLoad.load([
                    'lazy_selectizeJS',
                    'lazy_uiSelect',
                    'lazy_switchery',
                    'lazy_autosize',
                    'lazy_iCheck',
                    'lazy_ionRangeSlider'
                ], { serie: true });
            }]
        }
    });

    $stateProvider.state("restricted.layout", {
        abstract: true,
        views: {
            'header': {
                templateUrl: 'app/shared/header.html',
                controller: 'headerController'
            },
            'sidebar': {
                templateUrl: 'app/shared/sidebar.html',
                controller: 'sidebarController'
            },
            '': {
                templateUrl: 'app/views/restricted.html'
            }
        }
    });

    $stateProvider.state("restricted.layout.dashboard", {
        url: "/dashboard",
        templateUrl: 'app/views/dashboard.html',
        controller: 'dashboard',
        resolve: {
            deps: ['$ocLazyLoad', function ($ocLazyLoad) {
                return $ocLazyLoad.load([
                    'app/controllers/dashboard.js'
                ], { serie: true });
            }]
        },
        data: {
            pageTitle: 'Dashboard'
        }
    });

    $stateProvider.state("restricted.layout.senha", {
        url: "/alterarsenha",
        templateUrl: 'app/views/senha.html',
        controller: 'senha',
        resolve: {
            deps: ['$ocLazyLoad', function ($ocLazyLoad) {
                return $ocLazyLoad.load([
                    'app/controllers/senha.js'
                ], { serie: true });
            }]
        },
        data: {
            pageTitle: 'Altera Senha'
        }
    });
}
]);
