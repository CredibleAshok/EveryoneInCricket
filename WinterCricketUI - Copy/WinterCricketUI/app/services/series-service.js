// Name: seriesSservice
// Type: Angular Service
// Purpose: Provide list of series available
// Design: On initialisation this service loads the reference data from the server
(function () {
    'use strict';
    var serviceId = 'seriesSservice';
    angular.module('myApp').factory(serviceId,
        ['config', '$http', seriesSservice]);

    function seriesSservice(config, $http) {

        var service = {
            /* These are the operations that are available from this service. */
            getSeriesList: function () { return getSeriesList() }
        };

        return service;
        function addAllSelector(data) {
            data.unshift({
                "seriesId": 0,
                "seriesName": "Select All",
                "year": "2018",
                "seriesValidFrom": "1 March 2018",
                "seriesValidTo": "17 March 2018"
            });
            return data;
        }
        //get  list on the basis on 
        function getSeriesList() {
            var wkUrl = config.apiUrl + 'getAllSeriesList/';
            return $http({
                url: wkUrl,
                params: { param1: 'val1', param2: 'val2', param3: 'val3' },
                method: 'GET',
                isArray: true
            }).then(success, fail)
            function success(resp) {
                return addAllSelector(resp.data);
            }
            function fail(error) {
                var msg = "Error getting  list: " + error;
                //log.logError(msg, error, null, true);
                throw error; // so caller can see it
            }
        }
    }

})();
