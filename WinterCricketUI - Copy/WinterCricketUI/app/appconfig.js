(function () {
    'use strict';

    var myApp = angular.module('myApp');

    myApp.constant('config', {
        apiUrl: 'http://localhost:54650/api/',
        baseUrl: '/',
        enableDebug: true
    });

    var globalVariables = {
        showhideContent: false
    };

    myApp.value('globalVariables', globalVariables);

})();