var controller = function ($scope, $http, Auth, $location, $state, $ionicHistory) {

    $scope.form = { nome: "", email: "", telefone: "" };

    $scope.init = function(){
        if(Auth.isLoggedIn()){
            var obj = Auth.get();
            $scope.form.nome = obj.Nome;
            $scope.form.email = obj.Email;
            $scope.form.telefone = obj.TelefoneCelular;
        }
    }

    $scope.contactar = function(banner){
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