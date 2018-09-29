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

    $stateProvider.state("restricted.layout.certificado-lista", {
        url: "/certificado",
        templateUrl: 'app/views/certificado/list.html',
        controller: 'certificado',
        resolve: {
            deps: ['$ocLazyLoad', function ($ocLazyLoad) {
                return $ocLazyLoad.load([
                    'app/controllers/certificado.js'
                ], { serie: true });
            }]
        },
        data: {
            pageTitle: 'Certificados'
        }
    });

    $stateProvider.state("restricted.layout.certificado-novo", {
        url: "/certificado/form",
        templateUrl: 'app/views/certificado/form.html',
        controller: 'certificado',
        resolve: {
            deps: ['$ocLazyLoad', function ($ocLazyLoad) {
                return $ocLazyLoad.load([
                    'app/controllers/certificado.js'
                ], { serie: true });
            }]
        },
        data: {
            pageTitle: 'Criar Certificado'
        }
    });

    $stateProvider.state("restricted.layout.certificado-editar", {
        url: "/certificado/form/:id",
        templateUrl: 'app/views/certificado/form.html',
        controller: 'certificado',
        resolve: {
            deps: ['$ocLazyLoad', function ($ocLazyLoad) {
                return $ocLazyLoad.load([
                    'app/controllers/certificado.js'
                ], { serie: true });
            }]
        },
        data: {
            pageTitle: 'Editar Certificado'
        }
    });

    $stateProvider.state("restricted.layout.profissao-lista", {
        url: "/profissao",
        templateUrl: 'app/views/profissao/list.html',
        controller: 'profissao',
        resolve: {
            deps: ['$ocLazyLoad', function ($ocLazyLoad) {
                return $ocLazyLoad.load([
                    'app/controllers/profissao.js'
                ], { serie: true });
            }]
        },
        data: {
            pageTitle: 'Profiss�es'
        }
    });

    $stateProvider.state("restricted.layout.profissao-novo", {
        url: "/profissao/form",
        templateUrl: 'app/views/profissao/form.html',
        controller: 'profissao',
        resolve: {
            deps: ['$ocLazyLoad', function ($ocLazyLoad) {
                return $ocLazyLoad.load([
                    'app/controllers/profissao.js'
                ], { serie: true });
            }]
        },
        data: {
            pageTitle: 'Criar Profiss�o'
        }
    });

    $stateProvider.state("restricted.layout.profissao-editar", {
        url: "/profissao/form/:id",
        templateUrl: 'app/views/profissao/form.html',
        controller: 'profissao',
        resolve: {
            deps: ['$ocLazyLoad', function ($ocLazyLoad) {
                return $ocLazyLoad.load([
                    'app/controllers/profissao.js'
                ], { serie: true });
            }]
        },
        data: {
            pageTitle: 'Editar Profiss�o'
        }
    });
}
]);
