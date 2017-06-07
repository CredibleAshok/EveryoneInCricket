// Name: securitySservice
// Type: Angular Service
// Purpose: This service loades the logged in user.

(function () {
    'use strict';
    var serviceId = 'securitySservice';
    angular.module('myApp').factory(serviceId,
        ['config', '$http', securitySservice]);

    function securitySservice(config, $http) {

        var service = {
            /* These are the operations that are available from this service. */
            getloggedInUser: function () { return getloggedInUser() }
        };

        return service;

        //get  list on the basis on 
        function getloggedInUser() {
            var wkUrl = config.apiUrl + 'getLoggedInUser/';
            return $http({
                url: wkUrl,
                method: 'GET'
            }).then(success, fail)
            function success(resp) {
                return resp.data;
            }
            function fail(error) {
                var msg = "Error getting  list: " + error;
                //log.logError(msg, error, null, true);
                throw error; // so caller can see it
            }
        }
    }

})();
