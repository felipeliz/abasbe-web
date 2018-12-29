var controller = function ($scope, Auth, $state, $rootScope) {

    $scope.loggedIn = Auth.isLoggedIn();

    $scope.$watch(function(){ return Auth.isLoggedIn(); }, function(){
        $scope.loggedIn = Auth.isLoggedIn();
    })

    $scope.logout = function(){
        Auth.logout();
    }

    $scope.getPhotoLista = function () {
        var obj = Auth.get();
        if (obj.Foto == null || obj.Foto == "") {
            return "imgs/user.png";
        }
        return api.resolve(obj.Foto);
    }
}

angular.module('app.controllers', []).controller('menu', controller)