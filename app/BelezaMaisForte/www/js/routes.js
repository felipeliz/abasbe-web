angular.module('app.routes', ['oc.lazyLoad'])

  .config(function ($stateProvider, $urlRouterProvider) {

    // Ionic uses AngularUI Router which uses the concept of states
    // Learn more here: https://github.com/angular-ui/ui-router
    // Set up the various states which the app can be in.
    // Each state's controller can be found in controllers.js
    $stateProvider


      .state('menu.belezaMaisForte', {
        url: '/start',
        views: {
          'side-menu21': {
            templateUrl: 'templates/belezaMaisForte.html',
            controller: 'belezaMaisForteCtrl'
          }
        },
        resolve: {
          loadMyCtrl: ['$ocLazyLoad', function ($ocLazyLoad) {
            return $ocLazyLoad.load('controllers/belezaMaisForteCtrl.js');
          }]
        }
      })

      .state('menu.publicarBanner', {
        url: '/banner/publicar',
        views: {
          'side-menu21': {
            templateUrl: 'templates/publicarBanner.html',
            controller: 'publicarBannerCtrl'
          }
        }
      })

      .state('menu.buscarProfissionais', {
        url: '/profissionais/buscar',
        views: {
          'side-menu21': {
            templateUrl: 'templates/buscarProfissionais.html',
            controller: 'buscarProfissionaisCtrl'
          }
        }
      })

      .state('menu', {
        url: '/menu',
        templateUrl: 'templates/menu.html',
        controller: 'menuCtrl'
      })

      .state('menu.faleConosco', {
        url: '/contato',
        views: {
          'side-menu21': {
            templateUrl: 'templates/faleConosco.html',
            controller: 'faleConoscoCtrl'
          }
        }
      })

      .state('menu.meusBanners', {
        url: '/banners',
        views: {
          'side-menu21': {
            templateUrl: 'templates/meusBanners.html',
            controller: 'meusBannersCtrl'
          }
        }
      })

      .state('menu.profissionais', {
        url: '/profissionais',
        views: {
          'side-menu21': {
            templateUrl: 'templates/profissionais.html',
            controller: 'profissionaisCtrl'
          }
        }
      })

      .state('menu.perfil', {
        url: '/perfil',
        views: {
          'side-menu21': {
            templateUrl: 'templates/perfil.html',
            controller: 'perfilCtrl'
          }
        }
      })

      .state('menu.login', {
        url: '/page8',
        views: {
          'side-menu21': {
            templateUrl: 'templates/login.html',
            controller: 'loginCtrl'
          }
        }
      })

      .state('menu.equipamentos', {
        url: '/page10',
        views: {
          'side-menu21': {
            templateUrl: 'templates/equipamentos.html',
            controller: 'equipamentosCtrl'
          }
        }
      })

      .state('menu.certificados', {
        url: '/page11',
        views: {
          'side-menu21': {
            templateUrl: 'templates/certificados.html',
            controller: 'certificadosCtrl'
          }
        }
      })

      .state('menu.experiNcias', {
        url: '/page12',
        views: {
          'side-menu21': {
            templateUrl: 'templates/experiNcias.html',
            controller: 'experiNciasCtrl'
          }
        }
      })

      .state('menu.minhaAssinatura', {
        url: '/assinatura/me',
        views: {
          'side-menu21': {
            templateUrl: 'templates/minhaAssinatura.html',
            controller: 'minhaAssinaturaCtrl'
          }
        }
      })

      .state('menu.assinaturas', {
        url: '/assinaturas',
        views: {
          'side-menu21': {
            templateUrl: 'templates/assinaturas.html',
            controller: 'assinaturasCtrl'
          }
        }
      })

      .state('pagamentos', {
        url: '/page14',
        templateUrl: 'templates/pagamentos.html',
        controller: 'pagamentosCtrl'
      })

    $urlRouterProvider.otherwise('/menu/start')


  });