// Name: playersSservice
// Type: Angular Service
// Purpose: Provide list of players available, this is for list of players and not the individual players.
// Design: On initialisation this service loads the reference data from the server
(function () {
    'use strict';
    var serviceId = 'playersSservice';
    angular.module('myApp').factory(serviceId,
        ['config', '$http', playersSservice]);

    function playersSservice(config, $http) {

        var service = {
            /* These are the operations that are available from this service. */
            getplayersByTeamId: function (teamId) { return getplayersByTeamId(teamId) },
            getPlayers: function (searchObj) { return getPlayers(searchObj) }
        };

        return service;

        //get  list on the basis on 
        function getplayersByTeamId(teamId) {
            var wkUrl = config.apiUrl + 'playersListByTeam/';
            return $http({
                url: wkUrl,
                params: { teamId: teamId },
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

        function getPlayers(searchObj) {
            var wkUrl = config.apiUrl + 'searchPlayersList/';
            return $http({
                url: wkUrl,
                params: { searchObj: searchObj },
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
