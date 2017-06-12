// Name: venuesSservice
// Type: Angular Service
// Purpose: Provide list of series available
// Design: On initialisation this service loads the reference data from the server
(function () {
    'use strict';
    var serviceId = 'venuesSservice';
    angular.module('myApp').factory(serviceId,
        ['config', '$http', 'filterFilter', venuesSservice]);

    function venuesSservice(config, $http, filterFilter) {
        var countries = [];
        var states = [];
        var service = {
            /* These are the operations that are available from this service. */
            getVenuesList: function () { return getVenuesList() },
            initilize: function () { return initilize() },
            getCountryList: function () { return countries; },
            getStateByCountryId: function (countryId) { return getStateByCountryId(countryId) },
            getSuburbByStateId: function (stateId) { return getSuburbByStateId(stateId) }
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

        //get  countries List 
        function initilize() {
            var wkUrl = config.apiUrl + 'Countries/';
            return $http({
                url: wkUrl,
                params: {},
                method: 'GET',
                isArray: true
            }).then(success, fail)
            function success(resp) {
                countries = resp.data;
            }
            function fail(error) {
                var msg = "Error getting  list: " + error;
                //log.logError(msg, error, null, true);
                throw error; // so caller can see it
            }
        }

        //get  getState By CountryId List 
        function getStateByCountryId(countryId) {
            states = filterFilter(countries, { Id: parseInt(countryId) }, true)[0].State;
            return states;
        }

        //get  getSuburb By StateId List 
        function getSuburbByStateId(stateId) {
            var suburbs = filterFilter(states, { Id: parseInt(stateId) }, true)[0].Suburb;
            return suburbs;
        }
    }

})();
