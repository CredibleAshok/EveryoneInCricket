// Name: scoreCardSservice
// Type: Angular Service
// Purpose: Provide scores for matches,
// Design: On initialisation this service loads the reference data from the server
(function () {
    'use strict';
    var serviceId = 'scoreCardSservice';
    angular.module('myApp').factory(serviceId,
        ['config', '$http', scoreCardSservice]);

    function scoreCardSservice(config, $http) {

        var service = {
            /* These are the operations that are available from this service. */
            getScoreCardByMatchId: function (matchId) { return getScoreCardByMatchId(matchId) }
        };

        return service;

        //get  list on the basis on 
        function getScoreCardByMatchId(matchId) {
            var wkUrl = config.apiUrl + 'scoreCardByMatchId/';
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
