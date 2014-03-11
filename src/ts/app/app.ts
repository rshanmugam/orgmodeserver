'use strict';
/// <reference path="../deps/angularjs/angular.d.ts" />
/// <reference path="../deps/EventSource.d.ts" />

// Declare app level module which depends on filters, and services
angular.module(
    'myApp',
    [
    'ngRoute',
    'ngLocale',
    'ngAnimate',
    'myApp.filters',
    'myApp.directives',
    ])
    .config(['$routeProvider', function($routeProvider) {
        $routeProvider.when(
            '/home',
            {templateUrl: '/static/views/orgdoclist.html'});
        $routeProvider.when(
            '/doc/:docName',
            {templateUrl: '/static/views/orgdoc.html'});
        $routeProvider.otherwise({redirectTo: '/home'});
    }]);
