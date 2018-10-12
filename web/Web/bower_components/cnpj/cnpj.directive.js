(function () {
    'use strict';
    angular
      .module('cnpj', [])
      .directive('cnpj', cnpj);
    function cnpj() {
        return {
            link: link,
            require: 'ngModel'
        };
        function link(scope, element, attrs, ngModelController) {
            element.blur(function () {
                if (element.val().length != 18) {
                    element.val('');
                    ngModelController.$setViewValue('');
                }
            });

            attrs.$set('maxlength', 18);
            scope.$watch(attrs['ngModel'], applyMask);
            function applyMask(event) {
                var value = element.val().replace(/\D/g, "");

                value = value.replace(/^(\d{2})(\d)/, "$1.$2")
                value = value.replace(/^(\d{2})\.(\d{3})(\d)/, "$1.$2.$3");
                value = value.replace(/\.(\d{3})(\d)/, ".$1/$2");
                value = value.replace(/(\d{4})(\d)/, "$1-$2");

                element.val(value);
                if ('asNumber' in attrs) {
                    ngModelController.$setViewValue(
                      isNaN(parseInt(value.replace(/\D/g, ""), 10))
                      ? undefined
                      : parseInt(value.replace(/\D/g, ""), 10));
                } else {
                    ngModelController.$setViewValue(value);
                }
            }
        };//link
    };//Cnpj
})();
