// Name: playerSservice
// Type: Angular Service
// Purpose: Provide list of players available, this is for single player.
// Design: On initialisation this service loads the reference data from the server
(function () {
    'use strict';
    var serviceId = 'playerSservice';
    angular.module('myApp').factory(serviceId,
        ['config', '$http', playerSservice]);

    function playerSservice(config, $http) {

        var service = {
            /* These are the operations that are available from this service. */
            getplayerByMemberId: function (memberId) { return getplayerByMemberId(memberId) }
        };

        return service;

        //get  list on the basis on 
        function getplayerByMemberId(memberId) {
            var wkUrl = config.apiUrl + 'playerByMemberId/';
            return $http({
                url: wkUrl,
                params: { memberId: memberId },
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
