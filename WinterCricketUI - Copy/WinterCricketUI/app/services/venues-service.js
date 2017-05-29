// Name: venuesSservice
// Type: Angular Service
// Purpose: Provide list of series available
// Design: On initialisation this service loads the reference data from the server
(function () {
    'use strict';
    var serviceId = 'venuesSservice';
    angular.module('myApp').factory(serviceId,
        ['config', '$http', venuesSservice]);

    function venuesSservice(config, $http) {

        var service = {
            /* These are the operations that are available from this service. */
            getVenuesList: function () { return getVenuesList() }
        };

        return service;
        //get  list on the basis on 
        function getVenuesList() {
            var wkUrl = config.apiUrl + 'getVenuesList/';
            return $http({
                url: wkUrl,
                params: {},
                method: 'GET',
                isArray: true
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