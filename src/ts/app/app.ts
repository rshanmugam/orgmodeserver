'use strict';
/// <reference path="../deps/angularjs/angular.d.ts" />
/// <reference path="../deps/EventSource.d.ts" />

// Declare app level module which depends on filters, and services
angular.module(
    'myApp',
    [
    'ngRoute',
    'ngAnimate',
    'myApp.filters',
    'myApp.services',
    'myApp.directives',
    ])
    .config(['$routeProvider', function($routeProvider) {
        $routeProvider.when(
            '/home',
            {templateUrl: '/static/views/groups.html'});
        $routeProvider.when(
            '/about',
            {templateUrl: '/static/views/about.html'});
        $routeProvider.otherwise({redirectTo: '/home'});
    }])
    .config(['serverEventProvider', function(serverEventProvider) {
        serverEventProvider.setSource('/updates');
    }]);
