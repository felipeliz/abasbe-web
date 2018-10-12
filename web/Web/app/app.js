/*
*  Altair Admin AngularJS
*/
; "use strict";

var app = angular.module('app', [
    'ui.router',
    'oc.lazyLoad',
    'ngSanitize',
    'ngAnimate',
    'ngRetina',
    'ConsoleLogger',
    'ui.mask',
    'cpf-cnpj',
    'cnpj',
    'tooltips',
    'rw.moneymask',
    'filterPhone',
    'autocomplete'
]);

app.constant('variables', {
    header__main_height: 48,
    easing_swiftOut: [0.4, 0, 0.2, 1],
    bez_easing_swiftOut: $.bez([0.4, 0, 0.2, 1])
});

app.factory('Auth', function () {
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
});

app.factory('Validation', function () {
    return {
        required: function (name, field) {
            if (field == null || typeof (field) == "undefined" || field.toString().length == 0) {
                toastr.error("O campo " + name + " é obrigatório!");
                throw "validation-has-errors";
            }
        },
        requiredChild: function (name, field, child) {
            if (field == null || typeof (field) == "undefined" || Object.keys(field).indexOf(child) == -1 || field[child] == null || field[child].length == 0 || parseInt(field[child]) <= 0) {
                toastr.error("O campo " + name + " é obrigatório!");
                throw "validation-has-errors";
            }
        },
        cpf: function (field) {
            // criar validacao cpf
            field = field.replace("-", "").replace(".", "").replace(".", "");
            var Soma;
            var Resto;
            Soma = 0;

            if (field == "00000000000") {
                toastr.error("CPF inválido");
                throw "validation-has-errors";
            }
            for (var i = 1; i <= 9; i++) {
                Soma = Soma + parseInt(field.substring(i - 1, i)) * (11 - i);
            }
            Resto = (Soma * 10) % 11;
            if ((Resto == 10) || (Resto == 11)) {
                Resto = 0;
            }
            if (Resto != parseInt(field.substring(9, 10))) {
                toastr.error("CPF inválido");
                throw "validation-has-errors";
            }
            Soma = 0;
            for (var i = 1; i <= 10; i++) {
                Soma = Soma + parseInt(field.substring(i - 1, i)) * (12 - i);
            }
            Resto = (Soma * 10) % 11;
            if ((Resto == 10) || (Resto == 11)) {
                Resto = 0;
            }
            if (Resto != parseInt(field.substring(10, 11))) {
                toastr.error("CPF inválido");
                throw "validation-has-errors";
            }
            return true;
        },
        email: function (field) {
            var somaArroba = 0;
            var somaPonto = 0;
            for (var i = 0; i <= field.length; i++) {
                if (field[i] == "@") {
                    somaArroba += 1;
                }
                if (field[i] == ".") {
                    if (field[i + 1] == "c" && field[i + 2] == "o" && field[i + 3] == "m") {
                        somaPonto += 1;
                    }
                }
            }
            if (somaArroba == 1 && somaPonto == 1) {
                toastr.error("Email inválido");
                throw "validation-has-errors";
            }
            return false;
        },
        cnpjVal: function (field) {

            field = field.replace("-", "").replace(".", "").replace(".", "").replace("/", "");

            if (field == '') {
                toastr.error("CNPJ inválido");
                throw "validation-has-errors";
            }

            if (field.length != 14) {
                toastr.error("CNPJ inválido");
                throw "validation-has-errors";
            }
            // Elimina CNPJs invalidos conhecidos
            if (field == "00000000000000" ||
            field == "11111111111111" ||
            field == "22222222222222" ||
            field == "33333333333333" ||
            field == "44444444444444" ||
            field == "55555555555555" ||
            field == "66666666666666" ||
            field == "77777777777777" ||
            field == "88888888888888" ||
            field == "99999999999999") {
                toastr.error("CNPJ inválido");
                throw "validation-has-errors";
            }
            // Valida DVs
            var tamanho = field.length - 2
            var numeros = field.substring(0, tamanho);
            var digitos = field.substring(tamanho);
            var soma = 0;
            var pos = tamanho - 7;
            for (var i = tamanho; i >= 1; i--) {
                soma += numeros.charAt(tamanho - i) * pos--;
                if (pos < 2) {
                    pos = 9;
                }
            }
            var resultado = soma % 11 < 2 ? 0 : 11 - soma % 11;
            if (resultado != digitos.charAt(0)) {
                toastr.error("CNPJ inválido");
                throw "validation-has-errors";
            }
            tamanho = tamanho + 1;
            numeros = field.substring(0, tamanho);
            soma = 0;
            pos = tamanho - 7;
            for (var i = tamanho; i >= 1; i--) {
                soma += numeros.charAt(tamanho - i) * pos--;
                if (pos < 2) {
                    pos = 9;
                }
            }
            resultado = soma % 11 < 2 ? 0 : 11 - soma % 11;
            if (resultado != digitos.charAt(1)) {
                toastr.error("CNPJ inválido");
                throw "validation-has-errors";
            }
            return true;
        },
        aquisicaoVal: function (field) {
            if (field != 'S') {
                toastr.error("CNPJ inválido");
                throw "validation-has-errors";
            }
            return true;
        }
    }
});

app.directive('ngConfirmClick', [function () {
    return {
        restrict: 'A',
        link: function (scope, element, attrs) {
            element.bind('click', function () {
                var message = attrs.ngConfirmMessage || "Deseja realmente executar essa ação?";
                if (message && confirm(message)) {
                    scope.$apply(attrs.ngConfirmClick);
                }
            });
        }
    }
}]);

app.filter('brbool', function () {
    return function (value) {
        if (value == true) {
            return 'Sim';
        }
        if (value == false) {
            return 'Não';
        }
        return value;
    }

});

app.filter('cut', function () {
    return function (value, wordwise, max, tail) {
        if (!value) return '';

        max = parseInt(max, 10);
        if (!max) return value;
        if (value.length <= max) return value;

        value = value.substr(0, max);
        if (wordwise) {
            var lastspace = value.lastIndexOf(' ');
            if (lastspace !== -1) {
                //Also remove . and , so its gives a cleaner result.
                if (value.charAt(lastspace - 1) === '.' || value.charAt(lastspace - 1) === ',') {
                    lastspace = lastspace - 1;
                }
                value = value.substr(0, lastspace);
            }
        }

        return value + (tail || ' …');
    };
});

angular.module('app').directive('datepicker', function () {
    return {
        restrict: 'A',
        require: 'ngModel',
        link: function (scope, element, attrs, ngModelCtrl) {
            element.datepicker({
                dateFormat: 'dd/mm/yyyy',
                language: 'pt-BR',
                pickTime: false,
                orientation: "bottom"
            }).on('changeDate', function (e) {
                ngModelCtrl.$setViewValue(e.date.toLocaleDateString());
                scope.$apply();
            });

            element.bind('keyup', function () {
                if (element.val() == '' || element.val() == '__/__/____') {
                    element.val('').datepicker('update');
                    ngModelCtrl.$setViewValue('');
                    scope.$apply();
                }
            });
        }
    };
});

angular.module('app').directive('integer', function () {
    return {
        restrict: 'A',
        require: 'ngModel',
        link: function (scope, element, attrs, ngModelCtrl) {
            element.bind('keydown', function () {
                var val = element.val();
                val = val.replace(/\D/g, '');
                element.val(val);
                ngModelCtrl.$setViewValue(val);
                scope.$apply();
            });
            element.bind('keypress', function () {
                var val = element.val();
                val = val.replace(/\D/g, '');
                element.val(val);
                ngModelCtrl.$setViewValue(val);
                scope.$apply();
            });
            element.bind('keyup', function () {
                var val = element.val();
                val = val.replace(/\D/g, '');
                element.val(val);
                ngModelCtrl.$setViewValue(val);
                scope.$apply();
            });
        }
    };
});

app.factory('httpRequestInterceptor', function ($q, Auth, $location) {
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
});

app.directive('fileChange', function () {
    return {
        restrict: 'A',
        link: function (scope, element, attrs) {
            var onChangeHandler = scope.$eval(attrs.fileChange);
            element.on('change', function (event) {
                if (event.target.files.length == 0) {
                    onChangeHandler({ hasFile: false, base64: null });
                    return;
                }
                var reader = new FileReader();
                reader.readAsDataURL(event.target.files[0]);
                reader.onload = function () {
                    var name = event.target.files[0].name;
                    var ext = "." + event.target.files[0].name.split('.').pop();
                    onChangeHandler({ hasFile: true, base64: reader.result, ext: ext, name: name });
                    element.val(null);
                };
                reader.onerror = function (error) {
                    console.log('Error: ', error);
                };
            });
            element.on('$destroy', function () {
                element.off();
            });

        }
    };
});

app.config(function ($httpProvider) {
    $httpProvider.interceptors.push('httpRequestInterceptor');
});

app.config(['uiMask.ConfigProvider', function (uiMaskConfigProvider) {
    uiMaskConfigProvider.addDefaultPlaceholder(false);
    uiMaskConfigProvider.clearOnBlurPlaceholder(false);
}]);

/* Run Block */
app.run([
        '$rootScope',
        '$state',
        '$stateParams',
        '$http',
        '$window',
        '$timeout',
        'preloaders',
        'variables',
        function ($rootScope, $state, $stateParams, $http, $window, $timeout, variables) {

            $rootScope.$state = $state;
            $rootScope.$stateParams = $stateParams;

            $rootScope.$on('$stateChangeSuccess', function () {
                // scroll view to top
                $("html, body").animate({
                    scrollTop: 0
                }, 200);

                $timeout(function () {
                    $rootScope.pageLoading = false;
                    $($window).resize();
                }, 300);

                $timeout(function () {
                    $rootScope.pageLoaded = true;
                    $rootScope.appInitialized = true;
                }, 600);

            });

            $rootScope.$on('$stateChangeStart', function (event, toState, toParams, fromState, fromParams) {
                // main search
                $rootScope.mainSearchActive = false;
                // single card
                $rootScope.headerDoubleHeightActive = false;
                // top bar
                $rootScope.toBarActive = false;
                // page heading
                $rootScope.pageHeadingActive = false;
                // top menu
                $rootScope.topMenuActive = false;
                // full header
                $rootScope.fullHeaderActive = false;
                // full height
                $rootScope.page_full_height = false;
                // secondary sidebar
                $rootScope.sidebar_secondary = false;
                $rootScope.secondarySidebarHiddenLarge = false;

                if ($($window).width() < 1220) {
                    // hide primary sidebar
                    $rootScope.primarySidebarActive = false;
                    $rootScope.hide_content_sidebar = false;
                }
                if (!toParams.hasOwnProperty('hidePreloader')) {
                    $rootScope.pageLoading = true;
                    $rootScope.pageLoaded = false;
                }

            });

            // fastclick (eliminate the 300ms delay between a physical tap and the firing of a click event on mobile browsers)
            FastClick.attach(document.body);

            // get version from package.json
            $http.get('./package.json').success(function (response) {
                $rootScope.appVer = response.version;
            });

            // modernizr
            $rootScope.Modernizr = Modernizr;

            // get window width
            var w = angular.element($window);
            $rootScope.largeScreen = w.width() >= 1220;

            w.on('resize', function () {
                return $rootScope.largeScreen = w.width() >= 1220;
            });

            // show/hide main menu on page load
            $rootScope.primarySidebarOpen = ($rootScope.largeScreen) ? true : false;

            $rootScope.pageLoading = true;

        }
])
    .run([
        'PrintToConsole',
        function (PrintToConsole) {
            // app debug
            PrintToConsole.active = false;
        }
    ])
;