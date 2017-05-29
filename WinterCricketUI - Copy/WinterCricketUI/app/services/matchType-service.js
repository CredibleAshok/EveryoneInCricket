// Name: seriesSservice
// Type: Angular Service
// Purpose: Provide list of series available
// Design: On initialisation this service loads the reference data from the server
(function () {
    'use strict';
    var serviceId = 'matchTypeSservice';
    angular.module('myApp').factory(serviceId,
        ['config', '$http', matchTypeSservice]);

    function matchTypeSservice(config, $http) {

        var service = {
            /* These are the operations that are available from this service. */
            getMatchTypeList: function () { return getMatchTypeList() }
        };

        return service;

        //get  list on the basis on 
        function getMatchTypeList() {
            var wkUrl = config.apiUrl + 'matchTypes/';
            return $http({
                url: wkUrl,
                params: { param1: 'val1', param2: 'val2', param3: 'val3' },
                method: 'GET',
                isArray: true
            }).then(success, fail)
            function success(resp) {
                return resp.data;
            }
            function fail(error) {
                var msg = "Error getting  list: " + error;
                log.logError(msg, error, null, true);
                throw error; // so caller can see it
            }
        }
    }

})();
