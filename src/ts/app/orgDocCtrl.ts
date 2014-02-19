angular.module('myApp')
    .controller('orgDocCtrl', ["$scope", "$http", function($scope, $http) {

        $http.get('/doc')
        .success(function(data, status, headers, config) {
            $scope.doc = data.outline;
        });
    }])