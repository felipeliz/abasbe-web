var controller = function ($scope, $http, Validation, Auth, $state, $ionicHistory, $stateParams) {

    $scope.form = {};
    $scope.tipo = $stateParams.tipo;
    $scope.formType = 0;
    $scope.plano = {};

    $scope.getTitulo = function () {
        switch ($scope.tipo) {
            case 'MEI': return 'Abertura de MEI';
            case 'DAS': return 'Solicitação de DAS';
            case 'NFE': return 'Emitir de Nota Fiscal';
            case 'SME': return 'Declaração Anual (SIMEI)';
            case 'REG': return 'Regularizar MEI';
            case 'MAT': return 'Solicitar Licença Maternidade';
            case 'AUX': return 'Solicitar Auxílio Doença';
        }
    }

    $scope.getFormType = function () {
        switch ($scope.tipo) {
            case 'MEI': return 1;
            case 'DAS': return 2;
            case 'NFE': return 3;
            case 'SME': return 4;
            case 'REG': return 5;
            case 'MAT': return 5;
            case 'AUX': return 5;
        }
    }

    $scope.init = function () {
        var user = Auth.get();
        $scope.form.NomeCompleto = user.Nome;
        $scope.form.Email = user.Email;
        $scope.form.Telefone = user.TelefoneCelular;
        $scope.form.Cpf = user.CPF;
        $scope.form.TipoServico = $scope.tipo;
        $scope.formType = $scope.getFormType();

        $http({
            method: "POST",
            url: api.resolve("api/Plano/PorTipoServico"),
            data: $scope.form,
            loading: true
        }).then(function mySuccess(response) {
            $scope.plano = response.data;
        }, function myError(response) {
            toastr.error(response.data.ExceptionMessage);
        });
    }

    $scope.confirmar = function () {
        Validation.required("Nome Completo", $scope.form.NomeCompleto);
        Validation.required("E-mail", $scope.form.Email);
        Validation.required("Telefone de contato", $scope.form.Telefone);

        $http({
            method: "POST",
            url: api.resolve("api/ServicoContabil/salvar"),
            data: $scope.form,
            loading: true
        }).then(function mySuccess(response) {
            toastr.success("Serviço contabil solicitado com sucesso!");
            $ionicHistory.nextViewOptions({
                disableBack: true
            });
            $state.go("menu.pagamentos");
        }, function myError(response) {
            toastr.error(response.data.ExceptionMessage);
        });
    }

}
angular.module('app').controller('solicitar-servico', controller);