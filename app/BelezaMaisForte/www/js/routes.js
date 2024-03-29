angular.module('app.routes', ['oc.lazyLoad'])

  .config(function ($stateProvider, $urlRouterProvider) {

    // Ionic uses AngularUI Router which uses the concept of states
    // Learn more here: https://github.com/angular-ui/ui-router
    // Set up the various states which the app can be in.
    // Each state's controller can be found in controllers.js
    $stateProvider


      .state('menu.start', {
        url: '/start',
        cache: false,
        views: {
          'side-menu21': {
            templateUrl: 'templates/start.html',
            controller: 'start'
          }
        },
        resolve: {
          loadMyCtrl: ['$ocLazyLoad', function ($ocLazyLoad) {
            return $ocLazyLoad.load('controllers/start.js');
          }]
        }
      })

      .state('menu.publicar', {
        url: '/banner/publicar',
        cache: false,
        views: {
          'side-menu21': {
            templateUrl: 'templates/publicar.html',
            controller: 'publicar'
          }
        },
        resolve: {
          loadMyCtrl: ['$ocLazyLoad', function ($ocLazyLoad) {
            return $ocLazyLoad.load('controllers/publicar.js');
          }]
        }
      })

      .state('menu.buscar', {
        url: '/profissionais/buscar',
        cache: false,
        views: {
          'side-menu21': {
            templateUrl: 'templates/buscar.html',
            controller: 'buscar'
          }
        },
        resolve: {
          loadMyCtrl: ['$ocLazyLoad', function ($ocLazyLoad) {
            return $ocLazyLoad.load('controllers/buscar.js');
          }]
        }
      })

      .state('menu', {
        url: '/menu',
        cache: false,
        templateUrl: 'templates/menu.html',
        controller: 'menu'
      })

      .state('menu.contato', {
        url: '/contato',
        cache: false,
        views: {
          'side-menu21': {
            templateUrl: 'templates/contato.html',
            controller: 'contato'
          }
        },
        resolve: {
          loadMyCtrl: ['$ocLazyLoad', function ($ocLazyLoad) {
            return $ocLazyLoad.load('controllers/contato.js');
          }]
        }
      })

      .state('menu.banners', {
        url: '/banners',
        cache: false,
        views: {
          'side-menu21': {
            templateUrl: 'templates/banners.html',
            controller: 'banners'
          }
        },
        resolve: {
          loadMyCtrl: ['$ocLazyLoad', function ($ocLazyLoad) {
            return $ocLazyLoad.load('controllers/banners.js');
          }]
        }
      })

      .state('menu.profissionais', {
        url: '/profissionais',
        cache: false,
        views: {
          'side-menu21': {
            templateUrl: 'templates/profissionais.html',
            controller: 'profissionais'
          }
        },
        resolve: {
          loadMyCtrl: ['$ocLazyLoad', function ($ocLazyLoad) {
            return $ocLazyLoad.load('controllers/profissionais.js');
          }]
        }
      })

      .state('menu.contrato', {
        url: '/contrato',
        cache: false,
        views: {
          'side-menu21': {
            templateUrl: 'templates/contrato.html',
            controller: 'contrato'
          }
        },
        resolve: {
          loadMyCtrl: ['$ocLazyLoad', function ($ocLazyLoad) {
            return $ocLazyLoad.load('controllers/contrato.js');
          }]
        }
      })

      .state('menu.me', {
        url: '/perfil',
        cache: false,
        views: {
          'side-menu21': {
            templateUrl: 'templates/perfil.html',
            controller: 'perfil'
          }
        },
        resolve: {
          loadMyCtrl: ['$ocLazyLoad', function ($ocLazyLoad) {
            return $ocLazyLoad.load('controllers/perfil.js');
          }]
        }
      })

      .state('menu.senha', {
        url: '/senha',
        cache: false,
        views: {
          'side-menu21': {
            templateUrl: 'templates/senha.html',
            controller: 'senha'
          }
        },
        resolve: {
          loadMyCtrl: ['$ocLazyLoad', function ($ocLazyLoad) {
            return $ocLazyLoad.load('controllers/senha.js');
          }]
        }
      })

      .state('menu.perfil', {
        url: '/perfil/:id',
        cache: false,
        views: {
          'side-menu21': {
            templateUrl: 'templates/perfil.html',
            controller: 'perfil'
          }
        },
        resolve: {
          loadMyCtrl: ['$ocLazyLoad', function ($ocLazyLoad) {
            return $ocLazyLoad.load('controllers/perfil.js');
          }]
        }
      })

      .state('menu.editar', {
        url: '/editar/:id',
        cache: false,
        views: {
          'side-menu21': {
            templateUrl: 'templates/cadastro.html',
            controller: 'cadastro'
          }
        },
        resolve: {
          loadMyCtrl: ['$ocLazyLoad', function ($ocLazyLoad) {
            return $ocLazyLoad.load('controllers/cadastro.js');
          }]
        }
      })

      .state('menu.login', {
        url: '/login',
        cache: false,
        views: {
          'side-menu21': {
            templateUrl: 'templates/login.html',
            controller: 'login'
          }
        },
        resolve: {
          loadMyCtrl: ['$ocLazyLoad', function ($ocLazyLoad) {
            return $ocLazyLoad.load('controllers/login.js');
          }]
        }
      })

      .state('menu.equipamentos', {
        url: '/equipamentos',
        cache: false,
        views: {
          'side-menu21': {
            templateUrl: 'templates/equipamentos.html',
            controller: 'equipamentos'
          }
        },
        resolve: {
          loadMyCtrl: ['$ocLazyLoad', function ($ocLazyLoad) {
            return $ocLazyLoad.load('controllers/equipamentos.js');
          }]
        }
      })

      .state('menu.certificados', {
        url: '/certificados',
        cache: false,
        views: {
          'side-menu21': {
            templateUrl: 'templates/certificados.html',
            controller: 'certificados'
          }
        },
        resolve: {
          loadMyCtrl: ['$ocLazyLoad', function ($ocLazyLoad) {
            return $ocLazyLoad.load('controllers/certificados.js');
          }]
        }
      })

      .state('menu.experiencias', {
        url: '/experiencias',
        cache: false,
        views: {
          'side-menu21': {
            templateUrl: 'templates/experiencias.html',
            controller: 'experiencias'
          }
        },
        resolve: {
          loadMyCtrl: ['$ocLazyLoad', function ($ocLazyLoad) {
            return $ocLazyLoad.load('controllers/experiencias.js');
          }]
        }
      })

      .state('menu.assinaturas', {
        url: '/assinaturas',
        cache: false,
        views: {
          'side-menu21': {
            templateUrl: 'templates/assinaturas.html',
            controller: 'assinaturas'
          }
        },
        resolve: {
          loadMyCtrl: ['$ocLazyLoad', function ($ocLazyLoad) {
            return $ocLazyLoad.load('controllers/assinaturas.js');
          }]
        }
      })

      .state('menu.menu-contabilidade', {
        url: '/menu-contabilidade',
        cache: false,
        views: {
          'side-menu21': {
            templateUrl: 'templates/menu-contabilidade.html',
            controller: 'menu-contabilidade'
          }
        },
        resolve: {
          loadMyCtrl: ['$ocLazyLoad', function ($ocLazyLoad) {
            return $ocLazyLoad.load('controllers/menu-contabilidade.js');
          }]
        }
      })

      .state('menu.solicitar-servico', {
        url: '/solicitar-servico/:tipo',
        cache: false,
        views: {
          'side-menu21': {
            templateUrl: 'templates/solicitar-servico.html',
            controller: 'solicitar-servico'
          }
        },
        resolve: {
          loadMyCtrl: ['$ocLazyLoad', function ($ocLazyLoad) {
            return $ocLazyLoad.load('controllers/solicitar-servico.js');
          }]
        }
      })

      .state('menu.meus-servicos', {
        url: '/meus-servicos',
        cache: false,
        views: {
          'side-menu21': {
            templateUrl: 'templates/meus-servicos.html',
            controller: 'meus-servicos'
          }
        },
        resolve: {
          loadMyCtrl: ['$ocLazyLoad', function ($ocLazyLoad) {
            return $ocLazyLoad.load('controllers/meus-servicos.js');
          }]
        }
      })

      .state('menu.pagamentos', {
        url: '/pagamentos',
        cache: false,
        views: {
          'side-menu21': {
            templateUrl: 'templates/pagamentos.html',
            controller: 'pagamentos'
          }
        },
        resolve: {
          loadMyCtrl: ['$ocLazyLoad', function ($ocLazyLoad) {
            return $ocLazyLoad.load('controllers/pagamentos.js');
          }]
        }
      })

      .state('menu.cadastro', {
        url: '/cadastro',
        cache: false,
        views: {
          'side-menu21': {
            templateUrl: 'templates/cadastro.html',
            controller: 'cadastro'
          }
        },
        resolve: {
          loadMyCtrl: ['$ocLazyLoad', function ($ocLazyLoad) {
            return $ocLazyLoad.load('controllers/cadastro.js');
          }]
        }
      })

    $urlRouterProvider.otherwise('/menu/start')


  });