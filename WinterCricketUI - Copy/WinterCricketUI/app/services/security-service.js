// Name: securitySservice
// Type: Angular Service
// Purpose: This service loades the logged in user.

(function () {
    'use strict';
    var serviceId = 'securitySservice';
    angular.module('myApp').factory(serviceId,
        ['config', '$http', securitySservice]);

    function securitySservice(config, $http) {
        var currentUser = {
            "UserId": null,
            "Name": "Guest",
            "Roles": [{
                "RoleId": 1,
                "Name": "Player",
                "Features": [{
                    "FeatureId": 4,
                    "Name": "View Result"
                }, {
                    "FeatureId": 7,
                    "Name": "View Venue"
                }, {
                    "FeatureId": 10,
                    "Name": "View Team"
                }]
            }]
        }; // this current user will be null if user is navigating without login.
 
        var service = {
            /* These are the operations that are available from this service. */
            getloggedInUser: function (userName, password) { return getloggedInUser(userName, password) },
            getcurrentUser: function () { return currentUser; }
        };

        return service;

         //get  list on the basis on 
        function getloggedInUser(userName, password) {
            if (userName != undefined && password != undefined) {
                var wkUrl = config.apiUrl + 'getLoggedInUser/';
                return $http({
                    url: wkUrl,
                    method: 'GET'
                }).then(success, fail)
                function success(resp) {
                    currentUser = resp.data[0];
                }
                function fail(error) {
                    var msg = "Error getting  list: " + error;
                    //log.logError(msg, error, null, true);
                    throw error; // so caller can see it
                }
            }
        }
    }

})();
