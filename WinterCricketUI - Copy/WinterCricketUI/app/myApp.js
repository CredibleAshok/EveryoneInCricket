var myApp = angular.module('myApp', ['ui.router', 'smart-table', 'ngSanitize', 'ui.select']);

myApp.run(['$state', 'securitySservice', '$q', function ($state, securitySservice, $q) {

    // Get the current user when the application starts
    // use then notation when supplying username and password. if not use direct call to getcurrentUser, it will give guest object.
    //securitySservice.getloggedInUser("asd","asd").then(function (resp) {
    //    var currentUser1 = securitySservice.getcurrentUser();
    //    console.log("securitySservice.currentUser:- " + securitySservice.getcurrentUser().Name);
    //});
    var currentUser1 = securitySservice.getcurrentUser();
    console.log("securitySservice.currentUser:- " + securitySservice.getcurrentUser().Name);
}])