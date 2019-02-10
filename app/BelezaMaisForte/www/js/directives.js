angular.module('app.directives', [])

    .factory('Validation', function () {
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
    })


    .directive('fileChange', function () {
        return {
            restrict: 'A',
            link: function (scope, element, attrs) {
                var onChangeHandler = scope.$eval(attrs.fileChange);
                var index = scope.$eval(attrs.modelIndex);
                element.on('change', function (event) {
                    if (event.target.files.length == 0) {
                        onChangeHandler({ hasFile: false, base64: null }, index);
                        return;
                    }
                    var reader = new FileReader();
                    reader.readAsDataURL(event.target.files[0]);
                    reader.onload = function () {
                        var name = event.target.files[0].name;
                        var ext = "." + event.target.files[0].name.split('.').pop();
                        onChangeHandler({ hasFile: true, base64: reader.result, ext: ext, name: name }, index);
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
    })

    .directive('ngConfirmClick', [function () {
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
    }])

    .directive('hideInput', [function () {
        return {
            restrict: 'A',
            link: function (scope, element, attrs) {
                var fup = $(element).find("input[type='file']");
                fup.prop('style', 'width:0px;height:0px;top:0;left:0;position:absolute;opacity:0.0;filter:alpha(opacity=0);');
                fup.click(function (e) {
                    e.stopPropagation();
                });
                element.bind('click', function () {
                    fup.trigger("click");
                });
            }
        }
    }]);

