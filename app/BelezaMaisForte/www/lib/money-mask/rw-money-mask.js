(function () {
    'use strict';

    angular
      .module('rw.moneymask', [])
      .directive('moneyMask', moneyMask);

    moneyMask.$inject = ['$filter', '$window'];
    function moneyMask($filter, $window) {
        var directive = {
            require: 'ngModel',
            link: link,
            restrict: 'A'
        };
        return directive;

        function link(scope, element, attrs, ngModelCtrl, ngModel) {
            var display, cents;

            ngModelCtrl._$render = ngModelCtrl.$render;
            ngModelCtrl.$render = function () {
                ngModelCtrl._$render();
                cents = Math.round(element.val() * 100);

                if (cents == 0) {
                    return;
                }

                display = $filter('number')(cents / 100, 2);

                if (attrs.moneyMaskPrepend) {
                    display = attrs.moneyMaskPrepend + ' ' + display;
                }

                if (attrs.moneyMaskAppend) {
                    display = display + ' ' + attrs.moneyMaskAppend;
                }

                element.val("R$ " + display);
            }

            element.on('keydown', function (e) {
                if ((e.which || e.keyCode) === 8) {
                    cents = parseInt(cents.toString().slice(0, -1)) || 0;

                    if (cents == 0) {
                        ngModelCtrl.$setViewValue('');
                        ngModelCtrl.$render();
                        scope.$apply();
                        return;
                    }

                    ngModelCtrl.$setViewValue(cents / 100);
                    ngModelCtrl.$render();
                    scope.$apply();
                    e.preventDefault();
                }
            });

            element.on('keypress', function (e) {
                var key = e.which || e.keyCode;

                if (key === 9 || key === 13) {
                    return true;
                }

                var char = String.fromCharCode(key);
                e.preventDefault();

                if (char.search(/[0-9\-]/) === 0) {
                    cents = parseInt(cents + char);
                }
                else {
                    return false;
                }

                var target = e.target || e.srcElement;

                if (target.selectionEnd != target.selectionStart) {
                    ngModelCtrl.$setViewValue(parseInt(char) / 100);
                }
                else {
                    ngModelCtrl.$setViewValue(cents / 100);
                }
                ngModelCtrl.$render();
                scope.$apply();
            })
        }
    }
})();