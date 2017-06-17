//addVenuCtrl
(function () {
    myApp.controller('addVenuCtrl', function ($scope, $http, $stateParams, venuesSservice) {
        var vm = this;
        vm.newVenue = {};

        //#region intial data
        vm.newVenue.name = "Test Team";
        vm.newVenue.validFrom = new Date();
        vm.newVenue.validTo = new Date();
        vm.newVenue.country = {
            "Id": 1,
            "Name": "Brazil",
            "Continent": "Africa",
            "Flag": "app/content/images/flags/Brazil.png",
            "State": [{
                "Id": 1,
                "Name": "1State1",
                "Suburb": [{
                    "Id": 1,
                    "Name": "1_1_Suburb1"
                }, {
                    "Id": 2,
                    "Name": "1_1_Suburb2"
                }, {
                    "Id": 3,
                    "Name": "1_1_Suburb3"
                }]
            }]
        };
        vm.newVenue.state = {
            "Id": 1,
            "Name": "1State1",
            "Suburb": [{
                "Id": 1,
                "Name": "1_1_Suburb1"
            }, {
                "Id": 2,
                "Name": "1_1_Suburb2"
            }, {
                "Id": 3,
                "Name": "1_1_Suburb3"
            }]
        };
        vm.newVenue.suburb = {
            "Id": 1,
            "Name": "1_1_Suburb1"
        };

        vm.newVenue.postcode = "12345";
        //#endregion intial data

        vm.saveVenue = function () {
            venuesSservice.saveNewVenue(vm.newVenue).then(function (resp) {
                console.log("new Venue saving passed.");
            }, function () {
                console.log("new Venue saving failed.");
            });
        };

        var getProfile = function () {
            console.log("addVenuCtrl controller loaded.");
        };
        getProfile();
    });
})();
