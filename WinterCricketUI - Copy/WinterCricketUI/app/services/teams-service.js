// Name: teamsSservice
// Type: Angular Service
// Purpose: Provide list of players available, this is for single player.
// Design: On initialisation this service loads the reference data from the server
(function () {
    'use strict';
    var serviceId = 'teamsSservice';
    angular.module('myApp').factory(serviceId,
        ['config', '$http', teamsSservice]);

    function teamsSservice(config, $http) {

        var service = {
            /* These are the operations that are available from this service. */
            getTeamsList: function () { return getTeamsList() },
            // post methods
            saveNewTeam: function (newTeam) { return saveNewTeam(newTeam) }
        };

        return service;

        //#region Post Methods
        function saveNewTeam(newTeam) {
            var wkUrl = config.apiUrl + 'saveTeam/';
            return $http({
                url: wkUrl,
                params: { newTeam: newTeam },
                method: 'POST',
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
        //#endregion Post Methods
        //get  list on the basis on 
        function getTeamsList() {
            var wkUrl = config.apiUrl + 'teamsList/';
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
