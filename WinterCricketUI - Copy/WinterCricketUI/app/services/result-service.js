// Name: resultSservice
// Type: Angular Service
// Purpose: Provide list of series available
// Design: On initialisation this service loads the reference data from the server
(function () {
    'use strict';
    var serviceId = 'resultSservice';
    angular.module('myApp').factory(serviceId,
        ['config', '$http', resultSservice]);

    function resultSservice(config, $http) {

        var service = {
            /* These are the operations that are available from this service. */
            getResultByMatchId: function (matchId) { return getResultByMatchId(matchId) }
        };

        return service;

        //get  list on the basis on 
        function getResultByMatchId(matchId) {
            var wkUrl = config.apiUrl + 'getResultInfo/';
            return $http({
                url: wkUrl,
                params: { matchId: matchId },
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
