
angular.module('myApp')
    .controller('orgDocListCtrl', ["$scope", "$http", function($scope, $http) {
        $http.get('/docs')
        .success(function(data, status, headers, config) {
            $scope.docs = data;
        });
    }])