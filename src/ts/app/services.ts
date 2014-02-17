'use strict';

/* Services */


// Demonstrate how to register services
// In this case it is a simple value service.
angular.module('myApp.services', [])
  .provider('serverEvent', function () {
    var eventSource;

    this.setSource = function (url) {
      eventSource = new EventSource(url);
    };

    this.$get = function () {
      return eventSource;
    };
  });
