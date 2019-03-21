var controller = function ($scope, $http, $ionicActionSheet, $rootScope) {

    $scope.pagamentos = [];
    $scope.lastUpdate = (new Date()).getTime();
    $scope.canUpdate = true;
    $scope.filter = {
        page: 0
    }

    $scope.init = function () {
        $scope.filtrar();
    }

    $scope.filtrar = function () {

        console.log('searching page: ' + $scope.filter.page);
        $scope.lastUpdate = (new Date()).getTime();

        $http({
            method: "POST",
            url: api.resolve("api/pagamento/MeusPagamentos"),
            data: $scope.filter,
            loading: true
        }).then(function (response) {
            if (response.data.pageSize > response.data.list.length) {
                $scope.canUpdate = false;
            }

            $scope.$broadcast('scroll.infiniteScrollComplete');

            $scope.lastUpdate = (new Date()).getTime();

            if ($scope.filter.page > 0) {
                $scope.pagamentos = $scope.pagamentos.concat(response.data.list);
            }
            else {
                $scope.pagamentos = response.data.list;
            }
        }, function (response) {
            toastr.error(response.data.ExceptionMessage);
        });
    }

    $scope.onInfinite = function (path) {
        if ($scope.lastUpdate + 1500 < (new Date()).getTime() && $rootScope.loading == false && $scope.canUpdate) {
            $scope.filter.page++;
            $scope.filtrar();
        }
        else {
            setTimeout(() => {
                $scope.$broadcast('scroll.infiniteScrollComplete');
            }, 500);
        }
    };

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
                iabRef = cordova.InAppBrowser.open(response.data, '_blank', 'location=no,footer=yes,closebuttoncaption=Concluído,closebuttoncolor=#333333');
                iabRef.addEventListener('exit', function () { 
                    $scope.atualizar(pagamento); 
                });
            }
            else {
                toastr.error("Tivemos um problema ao gerar seu link de pagamento, tente novamente");
            }
        }, function (response) {
            toastr.error(response.data.ExceptionMessage);
        });
    }

    $scope.showAction = function (pagamento, index) {
        var hideSheet = $ionicActionSheet.show({
            buttons: [
                { text: 'Código de Referência' },
                { text: 'Efetuar Pagamento' },
                { text: 'Atualizar Status' },
            ],
            destructiveText: 'Excluir',
            titleText: 'Selecione uma opção...',
            cancelText: 'Cancelar',
            cancel: function () {
                hideSheet();
            },
            destructiveButtonClicked: function () {
                $scope.excluir(pagamento, index);
                hideSheet();
            },
            buttonClicked: function (index) {
                switch (index) {
                    case 0: {
                        alert(pagamento.CheckoutIdentifier);
                        break;
                    }
                    case 1: {
                        $scope.pagar(pagamento);
                        hideSheet();
                        break;
                    }
                    case 2: {
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
            for(var i in $scope.pagamentos) {
                if($scope.pagamentos[i].Id == response.data.Id){
                    $scope.pagamentos[i] = response.data;
                }
            }
        }, function (response) {
            toastr.error(response.data.ExceptionMessage);
        });
    }

    $scope.excluir = function (pagamento, $index) {
        $http({
            method: "GET",
            url: api.resolve("api/pagamento/Excluir/" + pagamento.Id),
            loading: true
        }).then(function (response) {
            if (response.data) {
                $scope.pagamentos.splice($index, 1);
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