var controller = function ($scope, $http, $ionicActionSheet) {

    $scope.loading = false;
    $scope.pagamentos = [];

    $scope.init = function () {
        $scope.carregar();
    }

    $scope.carregar = function () {
        $scope.loading = true;
        $http({
            method: "GET",
            url: api.resolve("api/cliente/MeusPagamentos")
        }).then(function (response) {
            $scope.loading = false;
            $scope.pagamentos = response.data;
        }, function (response) {
            $scope.loading = false;
            toastr.error(response.data.ExceptionMessage);
        });
    }

    $scope.pagar = function (pagamento) {
        if (pagamento.SituacaoValue > 1) {
            toastr.warning('Pagamento com status diferente de novo');
            return;
        }
        $http({
            method: "GET",
            url: api.resolve("api/pagamento/Pagar/" + pagamento.Id),
            loading: true
        }).then(function (response) {
            if (response.data != null) {
                iabRef = cordova.InAppBrowser.open(response.data, '_blank', 'location=no,footer=yes,closebuttoncaption=Fechar,closebuttoncolor=#333333');
                iabRef.addEventListener('exit', function () { $scope.carregar(); });
            }
            else {
                toastr.error("Tivemos um problema ao gerar seu link de pagamento, tente novamente");
            }
        }, function (response) {
            toastr.error(response.data.ExceptionMessage);
        });
    }

    $scope.showAction = function (pagamento) {
        var hideSheet = $ionicActionSheet.show({
            buttons: [
                { text: 'Efetuar Pagamento' },
                { text: 'Atualizar Status' }
            ],
            destructiveText: 'Excluir',
            titleText: 'Selecione uma opção...',
            cancelText: 'Cancelar',
            cancel: function () {
                hideSheet();
            },
            destructiveButtonClicked: function () {
                $scope.excluir(pagamento);
                hideSheet();
            },
            buttonClicked: function (index) {
                switch (index) {
                    case 0: {
                        $scope.pagar(pagamento);
                        hideSheet();
                        break;
                    }
                    case 1: {
                        $scope.atualizar(pagamento);
                        hideSheet();
                        break;
                    }
                }
                return true;
            }
        });
    }

    $scope.atualizar = function (pagamento) {
        $http({
            method: "GET",
            url: api.resolve("api/pagamento/Atualizar/" + pagamento.Id),
            loading: true
        }).then(function (response) {
            if (response.data) {
                $scope.carregar();
            }
        }, function (response) {
            toastr.error(response.data.ExceptionMessage);
        });
    }

    $scope.excluir = function (pagamento) {
        $http({
            method: "GET",
            url: api.resolve("api/pagamento/Excluir/" + pagamento.Id),
            loading: true
        }).then(function (response) {
            if (response.data) {
                $scope.carregar();
            }
        }, function (response) {
            toastr.error(response.data.ExceptionMessage);
        });
    }

    $scope.getBadgeClass = function (pagamento) {
        switch (pagamento.SituacaoValue) {
            case 0: return 'badge-stable';
            case 1: return 'badge-energized';
            case 2: return 'badge-energized';
            case 3: return 'badge-balanced';
            case 4: return 'badge-balanced';
            case 5: return 'badge-assertive';
            case 6: return 'badge-calm';
        }
    }
}

angular.module('app.controllers', []).controller('pagamentos', controller)