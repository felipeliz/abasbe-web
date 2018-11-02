angular.module('app.controllers', [])
  
.controller('bannersCtrl', ['$scope', '$stateParams', '$http', // The following is the constructor function for this page's controller. See https://docs.angularjs.org/guide/controller
// You can include any angular dependencies as parameters for this function
// TIP: Access Route Parameters for your page via $stateParams.parameterName
function ($scope, $stateParams, $http) {

    $scope.lista = {};

    $scope.filtrar = function () {
        $http({
            method: "POST",
            url: "http://alysonfreitas.minivps.info/abasbe/api/banner/lista",
            data: {Titulo: "", page: 0}
        }).then(function mySuccess(response) {
            $scope.lista = response.data;
        }, function myError(response) {
            console.log('filtrar error: ' + JSON.stringify(response.data));
        });
    }

    $scope.getImage = function(banner) {
        return "http://alysonfreitas.minivps.info/abasbe/" + banner.Imagem;
    }

}])
   
.controller('publicarBannerCtrl', ['$scope', '$stateParams', // The following is the constructor function for this page's controller. See https://docs.angularjs.org/guide/controller
// You can include any angular dependencies as parameters for this function
// TIP: Access Route Parameters for your page via $stateParams.parameterName
function ($scope, $stateParams) {


}])
   
.controller('cloudCtrl', ['$scope', '$stateParams', // The following is the constructor function for this page's controller. See https://docs.angularjs.org/guide/controller
// You can include any angular dependencies as parameters for this function
// TIP: Access Route Parameters for your page via $stateParams.parameterName
function ($scope, $stateParams) {


}])
   
.controller('menuCtrl', ['$scope', '$stateParams', // The following is the constructor function for this page's controller. See https://docs.angularjs.org/guide/controller
// You can include any angular dependencies as parameters for this function
// TIP: Access Route Parameters for your page via $stateParams.parameterName
function ($scope, $stateParams) {


}])
 