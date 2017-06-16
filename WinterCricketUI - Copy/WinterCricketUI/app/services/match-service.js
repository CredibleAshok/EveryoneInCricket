// Name: matchSservice
// Type: Angular Service
// Purpose: Provide list of series available
// Design: On initialisation this service loads the reference data from the server
(function () {
    'use strict';
    var serviceId = 'matchSservice';
    angular.module('myApp').factory(serviceId,
        ['config', '$http', matchSservice]);

    function matchSservice(config, $http) {

        var service = {
            /* These are the operations that are available from this service. */
            getMatchesBySeriesId: function (seriesId) { return getMatchesBySeriesId(seriesId) },
            getCompletedMatchesBySeriesId: function (seriesId, matchStateId) { return getCompletedMatchesBySeriesId(seriesId, matchStateId) },
            getResultsByMemberBySeriesId: function (memberId, teamId, seriesId, matchStateId) { return getResultsByMemberBySeriesId(memberId, teamId, seriesId, matchStateId) },
            getMemberMatchesBySeriesId: function (teamId, seriesId) { return getMemberMatchesBySeriesId(teamId, seriesId) },
            getTeamsByMatchId: function (matchId) { return getTeamsByMatchId(matchId) },
            // post methods
            saveNewMatch: function (newMatch) { return saveNewMatch(newMatch) }
        };

        return service;

        //get  list on the basis on 
        function getMatchesBySeriesId(seriesId) {
            var wkUrl = config.apiUrl + 'getMatches/';
            return $http({
                url: wkUrl,
                params: { seriesId: seriesId },
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

        //get  list on the basis on 
        function getTeamsByMatchId(matchId) {
            var wkUrl = config.apiUrl + 'getTeamsByMatchId/';
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

        function getCompletedMatchesBySeriesId(seriesId, matchStateId) {
            var wkUrl = config.apiUrl + 'getResults/';
            return $http({
                url: wkUrl,
                params: { seriesId: seriesId, matchStateId: matchStateId },
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

        function getResultsByMemberBySeriesId(memberId, teamId, seriesId, matchStateId) {
            var wkUrl = config.apiUrl + 'getResultByTeam/';
            /*
            cann't use getResultsByMember in url because there is another url matching in e2e which meets condition, for example 'api\/getResults' will also match
            and e2e will send data for 'api\/getResults' url instead of 'api\/getResultsByMember'
            */
            return $http({
                url: wkUrl,
                params: { memberId: memberId, teamId:teamId, seriesId: seriesId, matchStateId: matchStateId },
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

        function getMemberMatchesBySeriesId(teamId, seriesId) {
            var wkUrl = config.apiUrl + 'getMemberMatches/';
            /*
            cann't use getResultsByMember in url because there is another url matching in e2e which meets condition, for example 'api\/getResults' will also match
            and e2e will send data for 'api\/getResults' url instead of 'api\/getResultsByMember'
            */
            return $http({
                url: wkUrl,
                params: { teamId: teamId, seriesId: seriesId },
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

        //#region Post Methods
        function saveNewMatch(newMatch) {
            var wkUrl = config.apiUrl + 'saveMatch/';
            return $http({
                url: wkUrl,
                params: { newMatch: newMatch },
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
    }

})();
