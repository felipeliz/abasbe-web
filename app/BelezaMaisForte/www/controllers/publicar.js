var controller = function ($scope, $http, $state, Validation, $ionicHistory) {

    $scope.form = { Id: 0, Titulo: "", Descricao: "", IdTipoAcao: 0, IdPlano: -1, Situacao: "E" };
    $scope.planos = [];

    $scope.init = function () {
        $scope.carregarListas();
    }

    $scope.carregarListas = function () {
        $http({
            method: "GET",
            url: api.resolve("api/plano/PlanosBanner")
        }).then(function mySuccess(response) {
            $scope.planos = response.data;
        }, function myError(response) {
            toastr.error(response.data.ExceptionMessage);
        });
    }

    $scope.getPhoto = function () {
        if ($scope.form.Imagem == null || $scope.form.Imagem == "") {
            return "imgs/banner-prototype.png";
        }
        return api.resolve($scope.form.Imagem);
    }

    $scope.mudarTipo = function (tipo) {
        $scope.form.IdTipoAcao = tipo;
    }

    $scope.salvar = function () {
        $scope.croppie.result().then(function (base64) {
            $scope.form.Imagem = base64;
            console.log($scope.form);
            Validation.required("Imagem", $scope.form.Imagem);
            Validation.required("Título", $scope.form.Titulo);
            Validation.required("Data da estreia", $scope.form.Estreia);
            Validation.required("Horário da estreia", $scope.form.EstreiaHorario);
            Validation.required("Descrição", $scope.form.Descricao);
            Validation.required("Situacao", $scope.form.Situacao);
            if ($scope.form.IdTipoAcao == 0) {
                Validation.required("Link", $scope.form.Link);
                var reg = /http(s?):\/\/..*/;
                if (!reg.test($scope.form.Link)) {
                    toastr.error('Sua url deve começar com "http://" ou "https://"');
                }
            }
            else {
                Validation.required("Telefone", $scope.form.Telefone);
                if ($scope.form.Telefone.length != 11 && $scope.form.Telefone.length != 10) {
                    toastr.error('Digite um número de telefone válido');
                }
            }
            Validation.required("Plano", $scope.form.IdPlano);

            $http({
                method: "POST",
                url: api.resolve("api/banner/publicar"),
                data: $scope.form,
                loading: true
            }).then(function mySuccess(response) {
                toastr.success("Banner cadastrado com sucesso!");
                $scope.pagamentos();
            }, function myError(response) {
                toastr.error(response.data.ExceptionMessage);
            });
        });
    }

    $scope.pagamentos = function () {
        $ionicHistory.nextViewOptions({
            disableBack: true
        });
        $state.go("menu.pagamentos");
    }

    $scope.selectPlano = function (plano) {
        for (var i in $scope.planos) {
            $scope.planos[i].selecionado = false;
        }
        $scope.form.IdPlano = plano.Id;
        plano.selecionado = true;
    }

    $scope.croppie = {
        instance: null,
        file: null,
        destroy: function () {
            if ($scope.croppie.instance != null) {
                $scope.croppie.file = null;
                $scope.croppie.instance.croppie('destroy');
            }
        },
        callback: function (file) {
            if (file.hasFile) {
                $scope.croppie.destroy();
                $scope.croppie.file = file;
                $scope.$apply();

                $scope.croppie.instance = $('.post-image-upload').croppie({
                    viewport: {
                        width: $('.post-image-upload').width() - 10,
                        height: $('.post-image-upload').width() - 10
                    },
                    boundary: {
                        width: $('.post-image-upload').width(),
                        height: $('.post-image-upload').width()
                    },
                    showZoomer: false
                });

                $('.post-image-upload').css('max-height', $('.post-image-upload').width() + 'px');

                $scope.croppie.instance.croppie('bind', {
                    url: file.base64
                });
            }
        },
        result: function () {
            if ($scope.croppie.instance != null) {
                var options = {
                    type: 'base64',
                    size: { width: 600, height: 600 },
                    format: 'jpeg'
                };
                return $scope.croppie.instance.croppie('result', options);
            }
            return new Promise((then) => { then(null); });
        }
    }
}

angular.module('app.controllers', []).controller('publicar', controller)
