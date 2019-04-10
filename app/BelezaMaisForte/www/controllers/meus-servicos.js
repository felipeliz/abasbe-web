var controller = function ($scope, $http, Auth, $ionicActionSheet, $rootScope) {

    $scope.solicitacoes = [];
    $scope.lastUpdate = (new Date()).getTime();
    $scope.canUpdate = true;
    $scope.filter = {
        page: 0
    }

    $scope.init = function () {
        if (Auth.isLoggedIn()) {
            $scope.mudarTipo(0);
        }
        else {
            $state.go("menu.start")
        }
    }

    $scope.reset = function (status) {
        $scope.canUpdate = true;
        $scope.filter.page = 0;
        $scope.filter.status = status;
        $scope.filtrar();
    }

    $scope.filtrar = function () {

        console.log('searching page: ' + $scope.filter.page);
        $scope.lastUpdate = (new Date()).getTime();

        $http({
            method: "POST",
            url: api.resolve("api/ServicoContabil/MeusServicoSolicitados"),
            data: $scope.filter,
            loading: true
        }).then(function (response) {
            if (response.data.pageSize > response.data.list.length) {
                $scope.canUpdate = false;
            }

            $scope.$broadcast('scroll.infiniteScrollComplete');

            $scope.lastUpdate = (new Date()).getTime();

            if ($scope.filter.page > 0) {
                $scope.solicitacoes = $scope.solicitacoes.concat(response.data.list);
            }
            else {
                $scope.solicitacoes = response.data.list;
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

    $scope.showAction = function (solicitacao, index) {
        var hideSheet = $ionicActionSheet.show({
            buttons: [],
            destructiveText: 'Excluir Solicitação',
            titleText: 'Selecione uma opção...',
            cancelText: 'Cancelar',
            cancel: function () {
                hideSheet();
            },
            destructiveButtonClicked: function () {
                $scope.excluir(solicitacao, index);
                hideSheet();
            }
        });
    }

    $scope.excluir = function (solicitacao, $index) {
        $http({
            method: "GET",
            url: api.resolve("api/ServicoContabil/Desabilitar/" + solicitacao.Id),
            loading: true
        }).then(function (response) {
            if (response.data) {
                $scope.solicitacoes.splice($index, 1);
            }
        }, function (response) {
            toastr.error(response.data.ExceptionMessage);
        });
    }

    $scope.getBadgeSituacaoClass = function (solicitacao) {
        switch (solicitacao.Status) {
            case "N": return 'badge-stable';
            case "R": return 'badge-balanced';
            case "C": return 'badge-assertive';
            case "A": return 'badge-calm';
        }
    }

    $scope.mudarTipo = function (t) {
        $scope.filter.tipo = t;
        switch (t) {
            case 0: $scope.reset('N'); break;
            case 1: $scope.reset('A'); break;
            case 2: $scope.reset('R'); break;
        }
    }

    $scope.getStatus = function () {
        switch ($scope.filter.tipo) {
            case 0: return 'Novo'; break;
            case 1: return 'Em Andamento'; break;
            case 2: return 'Resolvido'; break;
        }
    }
}

angular.module('app.controllers', []).controller('meus-servicos', controller)