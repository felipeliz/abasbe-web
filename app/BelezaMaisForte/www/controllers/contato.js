var controller = function ($scope, $http, Auth, $location, $state, $ionicHistory, Validation) {

    $scope.form = { nome: "", email: "", telefone: "", mensagem: "" };

    $scope.init = function(){
        if(Auth.isLoggedIn()){
            var obj = Auth.get();
            $scope.form.nome = obj.Nome;
            $scope.form.email = obj.Email;
            $scope.form.telefone = obj.TelefoneCelular;
        }
    }

    $scope.contactar = function(){
        Validation.required("Nome", $scope.form.nome);
        Validation.required("E-mail", $scope.form.email);
        Validation.required("Mensagem", $scope.form.mensagem);

        $http({
            method: "POST",
            url: api.resolve("api/cliente/contato"),
            data: $scope.form,
            loading: true
        }).then(function(response) {
            toastr.success(response.data);
            $scope.start();
        }, function(response) {
            toastr.error(response.data.ExceptionMessage);
        });
    }

    $scope.start = function(){
        $ionicHistory.nextViewOptions({
            disableBack: true
        });
        $state.go('menu.start');
    }
}

angular.module('app.controllers', []).controller('contato', controller)