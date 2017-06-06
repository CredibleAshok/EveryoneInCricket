var myApp = angular.module('myApp', ['ui.router', 'smart-table', 'ngSanitize', 'ui.select']);

myApp.run(['$state', 'securitySservice', '$q', function ($state, securitySservice, $q) {

    // Get the current user when the application starts
    // (in case they are still logged in from a previous session)
    // Note! angular does not wait till this request completes, so it is repeated in the authorization code.
    var defer = $q.defer();
    securitySservice.getloggedInUser(defer);

    return defer.promise;

}])