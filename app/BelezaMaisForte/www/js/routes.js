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

      .state('menu.publicarBanner', {
        url: '/banner/publicar',
        cache: false,
        views: {
          'side-menu21': {
            templateUrl: 'templates/publicarBanner.html',
            controller: 'publicarBannerCtrl'
          }
        }
      })

      .state('menu.buscarProfissionais', {
        url: '/profissionais/buscar',
        cache: false,
        views: {
          'side-menu21': {
            templateUrl: 'templates/buscarProfissionais.html',
            controller: 'buscarProfissionaisCtrl'
          }
        }
      })

      .state('menu', {
        url: '/menu',
        cache: false,
        templateUrl: 'templates/menu.html',
        controller: 'menuCtrl'
      })

      .state('menu.faleConosco', {
        url: '/contato',
        cache: false,
        views: {
          'side-menu21': {
            templateUrl: 'templates/faleConosco.html',
            controller: 'faleConoscoCtrl'
          }
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
            controller: 'profissionaisCtrl'
          }
        }
      })

      .state('menu.perfil', {
        url: '/perfil',
        cache: false,
        views: {
          'side-menu21': {
            templateUrl: 'templates/perfil.html',
            controller: 'perfilCtrl'
          }
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
        url: '/page10',
        cache: false,
        views: {
          'side-menu21': {
            templateUrl: 'templates/equipamentos.html',
            controller: 'equipamentosCtrl'
          }
        }
      })

      .state('menu.certificados', {
        url: '/page11',
        cache: false,
        views: {
          'side-menu21': {
            templateUrl: 'templates/certificados.html',
            controller: 'certificadosCtrl'
          }
        }
      })

      .state('menu.experiNcias', {
        url: '/page12',
        cache: false,
        views: {
          'side-menu21': {
            templateUrl: 'templates/experiNcias.html',
            controller: 'experiNciasCtrl'
          }
        }
      })

      .state('menu.minhaAssinatura', {
        url: '/assinatura/me',
        cache: false,
        views: {
          'side-menu21': {
            templateUrl: 'templates/minhaAssinatura.html',
            controller: 'minhaAssinaturaCtrl'
          }
        }
      })

      .state('menu.assinaturas', {
        url: '/assinaturas',
        cache: false,
        views: {
          'side-menu21': {
            templateUrl: 'templates/assinaturas.html',
            controller: 'assinaturasCtrl'
          }
        }
      })

      .state('pagamentos', {
        url: '/page14',    
        cache: false,
        templateUrl: 'templates/pagamentos.html',
        controller: 'pagamentosCtrl'
      })

    $urlRouterProvider.otherwise('/menu/start')


  });