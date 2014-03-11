enum FoldStatus { FOLDED, CHILDREN, SUBTREE };

angular.module('myApp')
    .controller('orgDocCtrl', ["$scope", "$http", function($scope, $http) {

        $http.get('/doc')
        .success(function(data, status, headers, config) {
            $scope.doc = data.Outline;
            setStatus($scope.doc, FoldStatus.SUBTREE);
        });


        function nextStatus(status : FoldStatus) : FoldStatus {
            switch (status) {
                case FoldStatus.FOLDED:
                    return FoldStatus.CHILDREN
                case FoldStatus.CHILDREN:
                    return FoldStatus.SUBTREE
                case FoldStatus.SUBTREE:
                    return FoldStatus.FOLDED
            }
        }

        function setStatus(node, status : FoldStatus): void {

            node.FoldStatus = status;

            var childFold;
            switch (status) {
                case FoldStatus.FOLDED:
                    return;
                    break;
                case FoldStatus.CHILDREN:
                    childFold = FoldStatus.FOLDED;
                    break;
                case FoldStatus.SUBTREE:
                    childFold = FoldStatus.SUBTREE;
                    break;
            }

            for (var i=0, i_l=node.Children.length; i < i_l; i++) {
                setStatus(node.Children[i], childFold);
            }
        }

        $scope.foldCycle = function (node) {
            setStatus(node, nextStatus(node.FoldStatus));
        }
    }])