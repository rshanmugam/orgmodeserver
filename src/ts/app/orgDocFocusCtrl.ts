class Filter {

    constructor(
        private routeParamKey: string,
        private publicKey: string,
        private filter: (v:any, n:any) => boolean) {
    }

    IsActive(routeParams: any): boolean {
        return routeParams[this.routeParamKey] !== undefined;
    }

    Title(routeParams: any): string {
        return this.publicKey + ": " + routeParams[this.routeParamKey];
    }

    IsValid(routeParams: any, node: any): boolean {
        return this.filter(routeParams[this.routeParamKey], node);
    }

}

angular.module('myApp')
    .controller('orgDocFocusCtrl', ["$scope", "$http", "$routeParams", function($scope, $http, $routeParams) {

        $scope.docName = $routeParams.docName;

        var filters = [
            new Filter("tag", "Tag", (t, n) => n.Tags.indexOf(t) > - 1),
            new Filter("status", "Status", (s, n) => n.Status == s)
        ];

        function keep(node: any): boolean {
            return filters.
                filter(f => f.IsActive($routeParams)).
                every(f => f.IsValid($routeParams, node));
        }

        var title: string = filters.
            filter(f => f.IsActive($routeParams)).
            map(f => f.Title($routeParams)).
            join(", ");

        $http.get('/doc/' + $routeParams.docName)
        .success(function(data, status, headers, config) {
            $scope.doc = {
                Title    : title,
                Children : selectTag(data.Outline, $routeParams.tag)
            };
        });

        function selectTag(node, tag) {
            node.FoldStatus = 0;
            var current = keep(node) ? [node] : [];
            for (var i=0, i_l=node.Children.length; i < i_l; i++) {
                current = current.concat(selectTag(node.Children[i], tag));
            }
            return current;
        }

        $scope.foldCycle = function (node) {};
    }])
