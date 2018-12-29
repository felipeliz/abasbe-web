// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.services' is found in services.js
// 'starter.controllers' is found in controllers.js
angular.module('app', ['ionic', 'app.controllers', 'app.routes', 'app.directives','app.services', 'oc.lazyLoad'])

.config(function($ionicConfigProvider, $sceDelegateProvider){

  $sceDelegateProvider.resourceUrlWhitelist([ 'self','*://www.youtube.com/**', '*://player.vimeo.com/video/**']);

})

.run(function($ionicPlatform) {
  $ionicPlatform.ready(function() {
    // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
    // for form inputs)
    if (window.cordova && window.cordova.plugins && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
      cordova.plugins.Keyboard.disableScroll(true);
    }
    if (window.StatusBar) {
      // org.apache.cordova.statusbar required
      StatusBar.styleDefault();
    }
  });
})

/*
  This directive is used to disable the "drag to open" functionality of the Side-Menu
  when you are dragging a Slider component.
*/
.directive('disableSideMenuDrag', ['$ionicSideMenuDelegate', '$rootScope', function($ionicSideMenuDelegate, $rootScope) {
    return {
        restrict: "A",  
        controller: ['$scope', '$element', '$attrs', function ($scope, $element, $attrs) {

            function stopDrag(){
              $ionicSideMenuDelegate.canDragContent(false);
            }

            function allowDrag(){
              $ionicSideMenuDelegate.canDragContent(true);
            }

            $rootScope.$on('$ionicSlides.slideChangeEnd', allowDrag);
            $element.on('touchstart', stopDrag);
            $element.on('touchend', allowDrag);
            $element.on('mousedown', stopDrag);
            $element.on('mouseup', allowDrag);

        }]
    };
}])


.factory('Auth', function () {
  return {
      set: function (u) {
          localStorage.setItem("user", JSON.stringify(u));
      },
      get: function () {
          if (this.isLoggedIn()) {
              return JSON.parse(localStorage.getItem("user"));
          }
          return null;
      },
      isLoggedIn: function () {
          var item = localStorage.getItem("user");
          return !(item == null || typeof (item) == "undefined")
      },
      logout: function () {
          localStorage.removeItem("user")
      }
  }
})


.factory('httpRequestInterceptor', function ($q, Auth, $location) {
  return {
      request: function (config) {
          if (Auth.isLoggedIn()) {
              config.headers['Token'] = Auth.get().Token;
          }
          return config;
      },
      responseError: function (response) {
          if (typeof (response.data) != "undefined") {
              if (typeof (response.data.ExceptionMessage) == "string") {
                  if (response.data.ExceptionMessage == "NotLoggedIn") {
                      Auth.logout();
                      $location.path('/');
                      toastr.error("Sua sessão foi finalizada.");
                      return;
                  }
              }
          }
          return $q.reject(response);
      }
  }
})

.config(function ($httpProvider) {
  $httpProvider.interceptors.push('httpRequestInterceptor');
})

.factory('$loading', function () {
  return {
      loading: null,
      show: function () {
          this.loading = $.UIkit.modal.blockUI('<div class="uk-grid"><div class="uk-width-1-4"><img src="assets/img/spinners/spinner_medium.gif" alt="" width="36" height="36"></div><div class="uk-width-1-4 uk-flex" style="align-items:center;">Processando...</div></div>');
      },
      hide: function () {
          this.loading.hide();
      }
  }
})

/*
  This directive is used to open regular and dynamic href links inside of inappbrowser.
*/
.directive('hrefInappbrowser', function() {
  return {
    restrict: 'A',
    replace: false,
    transclude: false,
    link: function(scope, element, attrs) {
      var href = attrs['hrefInappbrowser'];

      attrs.$observe('hrefInappbrowser', function(val){
        href = val;
      });
      
      element.bind('click', function (event) {

        window.open(href, '_system', 'location=yes');

        event.preventDefault();
        event.stopPropagation();

      });
    }
  };
});