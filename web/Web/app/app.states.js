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
            pageTitle: 'Profissões'
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
            pageTitle: 'Criar Profissão'
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
            pageTitle: 'Editar Profissão'
        }
    });

    $stateProvider.state("restricted.layout.usuario-lista", {
        url: "/usuario",
        templateUrl: 'app/views/usuario/list.html',
        controller: 'usuario',
        resolve: {
            deps: ['$ocLazyLoad', function ($ocLazyLoad) {
                return $ocLazyLoad.load([
                    'app/controllers/usuario.js'
                ], { serie: true });
            }]
        },
        data: {
            pageTitle: 'Usuários'
        }
    });

    $stateProvider.state("restricted.layout.usuario-novo", {
        url: "/usuario/form",
        templateUrl: 'app/views/usuario/form.html',
        controller: 'usuario',
        resolve: {
            deps: ['$ocLazyLoad', function ($ocLazyLoad) {
                return $ocLazyLoad.load([
                    'app/controllers/usuario.js'
                ], { serie: true });
            }]
        },
        data: {
            pageTitle: 'Criar Usuário'
        }
    });

    $stateProvider.state("restricted.layout.usuario-editar", {
        url: "/usuario/form/:id",
        templateUrl: 'app/views/usuario/form.html',
        controller: 'usuario',
        resolve: {
            deps: ['$ocLazyLoad', function ($ocLazyLoad) {
                return $ocLazyLoad.load([
                    'app/controllers/usuario.js'
                ], { serie: true });
            }]
        },
        data: {
            pageTitle: 'Editar Usuário'
        }
    });

    $stateProvider.state("restricted.layout.associado-lista", {
        url: "/associado",
        templateUrl: 'app/views/associado/list.html',
        controller: 'associado',
        resolve: {
            deps: ['$ocLazyLoad', function ($ocLazyLoad) {
                return $ocLazyLoad.load([
                    'app/controllers/associado.js'
                ], { serie: true });
            }]
        },
        data: {
            pageTitle: 'Associados'
        }
    });

    $stateProvider.state("restricted.layout.associado-novo", {
        url: "/associado/form",
        templateUrl: 'app/views/associado/form.html',
        controller: 'associado',
        resolve: {
            deps: ['$ocLazyLoad', function ($ocLazyLoad) {
                return $ocLazyLoad.load([
                    'app/controllers/associado.js'
                ], { serie: true });
            }]
        },
        data: {
            pageTitle: 'Criar Associado'
        }
    });

    $stateProvider.state("restricted.layout.associado-editar", {
        url: "/associado/form/:id",
        templateUrl: 'app/views/associado/form.html',
        controller: 'associado',
        resolve: {
            deps: ['$ocLazyLoad', function ($ocLazyLoad) {
                return $ocLazyLoad.load([
                    'app/controllers/associado.js'
                ], { serie: true });
            }]
        },
        data: {
            pageTitle: 'Editar Associado'
        }
    });

    $stateProvider.state("restricted.layout.equipamento-lista", {
        url: "/equipamento",
        templateUrl: 'app/views/equipamento/list.html',
        controller: 'equipamento',
        resolve: {
            deps: ['$ocLazyLoad', function ($ocLazyLoad) {
                return $ocLazyLoad.load([
                    'app/controllers/equipamento.js'
                ], { serie: true });
            }]
        },
        data: {
            pageTitle: 'Equipamentos'
        }
    });

    $stateProvider.state("restricted.layout.equipamento-novo", {
        url: "/equipamento/form",
        templateUrl: 'app/views/equipamento/form.html',
        controller: 'equipamento',
        resolve: {
            deps: ['$ocLazyLoad', function ($ocLazyLoad) {
                return $ocLazyLoad.load([
                    'app/controllers/equipamento.js'
                ], { serie: true });
            }]
        },
        data: {
            pageTitle: 'Criar Equipamento'
        }
    });

    $stateProvider.state("restricted.layout.equipamento-editar", {
        url: "/equipamento/form/:id",
        templateUrl: 'app/views/equipamento/form.html',
        controller: 'equipamento',
        resolve: {
            deps: ['$ocLazyLoad', function ($ocLazyLoad) {
                return $ocLazyLoad.load([
                    'app/controllers/equipamento.js'
                ], { serie: true });
            }]
        },
        data: {
            pageTitle: 'Editar Equipamento'
        }
    });

    $stateProvider.state("restricted.layout.disponibilidade-lista", {
        url: "/disponibilidade",
        templateUrl: 'app/views/disponibilidade/list.html',
        controller: 'disponibilidade',
        resolve: {
            deps: ['$ocLazyLoad', function ($ocLazyLoad) {
                return $ocLazyLoad.load([
                    'app/controllers/disponibilidade.js'
                ], { serie: true });
            }]
        },
        data: {
            pageTitle: 'Disponibilidades'
        }
    });

    $stateProvider.state("restricted.layout.disponibilidade-novo", {
        url: "/disponibilidade/form",
        templateUrl: 'app/views/disponibilidade/form.html',
        controller: 'disponibilidade',
        resolve: {
            deps: ['$ocLazyLoad', function ($ocLazyLoad) {
                return $ocLazyLoad.load([
                    'app/controllers/disponibilidade.js'
                ], { serie: true });
            }]
        },
        data: {
            pageTitle: 'Criar Disponibilidade'
        }
    });

    $stateProvider.state("restricted.layout.disponibilidade-editar", {
        url: "/disponibilidade/form/:id",
        templateUrl: 'app/views/disponibilidade/form.html',
        controller: 'disponibilidade',
        resolve: {
            deps: ['$ocLazyLoad', function ($ocLazyLoad) {
                return $ocLazyLoad.load([
                    'app/controllers/disponibilidade.js'
                ], { serie: true });
            }]
        },
        data: {
            pageTitle: 'Editar Disponibilidade'
        }
    });

    $stateProvider.state("restricted.layout.plano-lista", {
        url: "/plano",
        templateUrl: 'app/views/plano/list.html',
        controller: 'plano',
        resolve: {
            deps: ['$ocLazyLoad', function ($ocLazyLoad) {
                return $ocLazyLoad.load([
                    'app/controllers/plano.js'
                ], { serie: true });
            }]
        },
        data: {
            pageTitle: 'Planos'
        }
    });

    $stateProvider.state("restricted.layout.plano-novo", {
        url: "/plano/form",
        templateUrl: 'app/views/plano/form.html',
        controller: 'plano',
        resolve: {
            deps: ['$ocLazyLoad', function ($ocLazyLoad) {
                return $ocLazyLoad.load([
                    'app/controllers/plano.js'
                ], { serie: true });
            }]
        },
        data: {
            pageTitle: 'Criar Plano'
        }
    });

    $stateProvider.state("restricted.layout.plano-editar", {
        url: "/plano/form/:id",
        templateUrl: 'app/views/plano/form.html',
        controller: 'plano',
        resolve: {
            deps: ['$ocLazyLoad', function ($ocLazyLoad) {
                return $ocLazyLoad.load([
                    'app/controllers/plano.js'
                ], { serie: true });
            }]
        },
        data: {
            pageTitle: 'Editar Plano'
        }
    });

    $stateProvider.state("restricted.layout.banner-lista", {
        url: "/banner",
        templateUrl: 'app/views/banner/list.html',
        controller: 'banner',
        resolve: {
            deps: ['$ocLazyLoad', function ($ocLazyLoad) {
                return $ocLazyLoad.load([
                    'app/controllers/banner.js'
                ], { serie: true });
            }]
        },
        data: {
            pageTitle: 'Banner'
        }
    });

    $stateProvider.state("restricted.layout.banner-novo", {
        url: "/banner/form",
        templateUrl: 'app/views/banner/form.html',
        controller: 'banner',
        resolve: {
            deps: ['$ocLazyLoad', function ($ocLazyLoad) {
                return $ocLazyLoad.load([
                    'app/controllers/banner.js'
                ], { serie: true });
            }]
        },
        data: {
            pageTitle: 'Criar Banner'
        }
    });

    $stateProvider.state("restricted.layout.banner-editar", {
        url: "/banner/form/:id",
        templateUrl: 'app/views/banner/form.html',
        controller: 'banner',
        resolve: {
            deps: ['$ocLazyLoad', function ($ocLazyLoad) {
                return $ocLazyLoad.load([
                    'app/controllers/banner.js'
                ], { serie: true });
            }]
        },
        data: {
            pageTitle: 'Editar Banner'
        }
    });

    $stateProvider.state("restricted.layout.profissional-lista", {
        url: "/profissional",
        templateUrl: 'app/views/profissional/list.html',
        controller: 'profissional',
        resolve: {
            deps: ['$ocLazyLoad', function ($ocLazyLoad) {
                return $ocLazyLoad.load([
                    'app/controllers/profissional.js'
                ], { serie: true });
            }]
        },
        data: {
            pageTitle: 'Profissionais'
        }
    });

    $stateProvider.state("restricted.layout.profissional-novo", {
        url: "/profissional/form",
        templateUrl: 'app/views/profissional/form.html',
        controller: 'profissional',
        resolve: {
            deps: ['$ocLazyLoad', function ($ocLazyLoad) {
                return $ocLazyLoad.load([
                    'app/controllers/profissional.js'
                ], { serie: true });
            }]
        },
        data: {
            pageTitle: 'Criar Profissional'
        }
    });

    $stateProvider.state("restricted.layout.profissional-editar", {
        url: "/profissional/form/:id",
        templateUrl: 'app/views/profissional/form.html',
        controller: 'profissional',
        resolve: {
            deps: ['$ocLazyLoad', function ($ocLazyLoad) {
                return $ocLazyLoad.load([
                    'app/controllers/profissional.js'
                ], { serie: true });
            }]
        },
        data: {
            pageTitle: 'Editar Profissional'
        }
    });

    $stateProvider.state("restricted.layout.parceiro-lista", {
        url: "/parceiro",
        templateUrl: 'app/views/parceiro/list.html',
        controller: 'parceiro',
        resolve: {
            deps: ['$ocLazyLoad', function ($ocLazyLoad) {
                return $ocLazyLoad.load([
                    'app/controllers/parceiro.js'
                ], { serie: true });
            }]
        },
        data: {
            pageTitle: 'Parceiros'
        }
    });

    $stateProvider.state("restricted.layout.parceiro-novo", {
        url: "/parceiro/form",
        templateUrl: 'app/views/parceiro/form.html',
        controller: 'parceiro',
        resolve: {
            deps: ['$ocLazyLoad', function ($ocLazyLoad) {
                return $ocLazyLoad.load([
                    'app/controllers/parceiro.js'
                ], { serie: true });
            }]
        },
        data: {
            pageTitle: 'Criar Parceiro'
        }
    });

    $stateProvider.state("restricted.layout.parceiro-editar", {
        url: "/parceiro/form/:id",
        templateUrl: 'app/views/parceiro/form.html',
        controller: 'parceiro',
        resolve: {
            deps: ['$ocLazyLoad', function ($ocLazyLoad) {
                return $ocLazyLoad.load([
                    'app/controllers/parceiro.js'
                ], { serie: true });
            }]
        },
        data: {
            pageTitle: 'Editar Parceiro'
        }
    });
}
]);
