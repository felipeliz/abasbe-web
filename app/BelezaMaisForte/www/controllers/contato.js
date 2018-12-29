var controller = function ($scope, $http, Auth, $location, $state) {

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
            data: $scope.form
        }).then(function(response) {
            console.success(response.data);
            $state.go("menu.start");
        }, function(response) {
            console.error(response.data.ExceptionMessage);
        });
    }
}

angular.module('app.controllers', []).controller('contato', controller)