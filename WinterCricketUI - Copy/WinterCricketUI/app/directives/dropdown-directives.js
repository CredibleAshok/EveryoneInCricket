(function () {
    myApp.directive('seriesDropdown', ['seriesSservice', '$timeout', function seriesDropdownDirectiveFunction(seriesSservice, $timeout) {
        //Usage:
        //<series-dropdown></series-dropdown>
        var directive = {
            link: link,
            restrict: 'AE',
            require: '^ngModel',
            transclude: true,
            templateUrl: 'app/directives/templates/series-dropdown-tpl.html',
            scope: {
                'model': '=ngModel'
            },
        };
        return directive;
        function link(scope, element, attrs, ctrl) {
            $timeout(function () {
                seriesSservice.getSeriesList().then(function (resp) {
                    scope.seriesList = resp;
                    console.log('series list loaded for series drop down directive:- ');
                });
            });

            scope.$watch('model', function () {
                scope.$eval(attrs.ngModel + ' = model');
            });
            scope.$watch(attrs.ngModel, function (val) {
                scope.model = val;
                ctrl.$setViewValue(val);
                if (angular.isDefined(attrs.callFunc)) {
                    scope.callFunc();
                }
            });
        }

    }]);

    myApp.directive('seriesDropdownNoSelectAll', ['seriesSservice', '$timeout', function seriesDropdownNoSelectAllDirectiveFunction(seriesSservice, $timeout) {
        //Usage:
        //<series-dropdown-no-select-all></series-dropdown-no-select-all>
        var directive = {
            link: link,
            restrict: 'AE',
            require: '^ngModel',
            transclude: true,
            templateUrl: 'app/directives/templates/series-dropdown-tpl.html',
            scope: {
                'model': '=ngModel'
            },
        };
        return directive;
        function link(scope, element, attrs, ctrl) {
            $timeout(function () {
                seriesSservice.getSeriesList().then(function (resp) {
                    resp.shift();
                    scope.seriesList = resp;
                    console.log('series list loaded for series drop down directive:- ');
                });
            });

            scope.$watch('model', function () {
                scope.$eval(attrs.ngModel + ' = model');
            });
            scope.$watch(attrs.ngModel, function (val) {
                scope.model = val;
                ctrl.$setViewValue(val);
                if (angular.isDefined(attrs.callFunc)) {
                    scope.callFunc();
                }
            });
        }
    }]);

    myApp.directive('countryDropdown', ['venuesSservice', '$timeout', function countryDropdownDirectiveFunction(venuesSservice, $timeout) {
        //Usage:
        //<country-dropdown></country-dropdown>
        var directive = {
            link: link,
            restrict: 'AE',
            require: '^ngModel',
            transclude: true,
            templateUrl: 'app/directives/templates/country-dropdown-tpl.html',
            scope: {
                'model': '=ngModel'
            },
        };
        return directive;
        function link(scope, element, attrs, ctrl) {
            $timeout(function () {
                venuesSservice.initilize().then(function (resp) {
                    scope.dataList = venuesSservice.getCountryList();
                    console.log('country list loaded for country drop down directive:- ');
                });
            });

            scope.$watch('model', function () {
                scope.$eval(attrs.ngModel + ' = model');
            });
            scope.$watch(attrs.ngModel, function (val) {
                scope.model = val;
                ctrl.$setViewValue(val);
                if (angular.isDefined(attrs.callFunc)) {
                    scope.callFunc();
                }
            });
        }
    }]);

    myApp.directive('memberDropdown', ['playersSservice', '$timeout', function memberDropdownDirectiveFunction(playersSservice, $timeout) {
        //Usage:
        //<member-dropdown></member-dropdown>
        var directive = {
            link: link,
            restrict: 'AE',
            require: '^ngModel',
            transclude: true,
            templateUrl: 'app/directives/templates/member-dropdown-tpl.html', // todo, change to member
            scope: {
                'model': '=ngModel'
            },
        };
        return directive;
        function link(scope, element, attrs, ctrl) {
            $timeout(function () {
                playersSservice.getPlayers().then(function (resp) {
                    scope.playerList = resp;
                    console.log('member list loaded for member drop down directive:- ');
                });
            });

            scope.$watch('model', function () {
                scope.$eval(attrs.ngModel + ' = model');
            });
            scope.$watch(attrs.ngModel, function (val) {
                scope.model = val;
                ctrl.$setViewValue(val);
                if (angular.isDefined(attrs.callFunc)) {
                    scope.callFunc();
                }
            });
        }
    }]);

    myApp.directive('stateDropdown', ['venuesSservice', '$timeout', function stateDropdownDirectiveFunction(venuesSservice, $timeout) {
        //Usage:
        //<state-dropdown></state-dropdown>
        var directive = {
            link: link,
            restrict: 'AE',
            require: '^ngModel',
            transclude: true,
            templateUrl: 'app/directives/templates/country-dropdown-tpl.html',
            scope: {
                'model': '=ngModel',
                'countryId': '@',
            },
        };
        return directive;
        function link(scope, element, attrs, ctrl) {
            element.bind('click', function ($event) {
                element.parent().children('ul').slideToggle();
            });
            //#region countryId based code
            scope.$watch('countryId', function () {
                $timeout(function () {
                    var stateList = venuesSservice.getStateByCountryId(scope.countryId);
                    if (stateList != undefined) {
                        scope.dataList = stateList;
                    } else {
                        ctrl.$setViewValue("");
                    }
                });
            });
            //#endregion countryId based code
            scope.$watch('model', function () {
                scope.$eval(attrs.ngModel + ' = model');
            });
            scope.$watch(attrs.ngModel, function (val) {
                scope.model = val;
                ctrl.$setViewValue(val);
                if (angular.isDefined(attrs.callFunc)) {
                    scope.callFunc();
                }
            });
        }
    }]);

    myApp.directive('suburbDropdown', ['venuesSservice', '$timeout', function suburbDropdownDirectiveFunction(venuesSservice, $timeout) {
        //Usage:
        //<suburb-dropdown></suburb-dropdown>
        var directive = {
            link: link,
            restrict: 'AE',
            require: '^ngModel',
            transclude: true,
            templateUrl: 'app/directives/templates/country-dropdown-tpl.html',
            scope: {
                'model': '=ngModel',
                'stateId': '@',
            },
        };
        return directive;
        function link(scope, element, attrs, ctrl) {
            element.bind('click', function ($event) {
                element.parent().children('ul').slideToggle();
            });
            //#region countryId based code
            scope.$watch('stateId', function () {
                $timeout(function () {
                    var suburbList = venuesSservice.getSuburbByStateId(scope.stateId);
                    if(suburbList!= undefined){
                        scope.dataList = suburbList;
                    } else {
                        ctrl.$setViewValue("");
                    }
                });
            });
            //#endregion countryId based code
            scope.$watch('model', function () {
                scope.$eval(attrs.ngModel + ' = model');
            });
            scope.$watch(attrs.ngModel, function (val) {
                scope.model = val;
                ctrl.$setViewValue(val);
                if (angular.isDefined(attrs.callFunc)) {
                    scope.callFunc();
                }
            });
        }
    }]);

    myApp.directive('teamDropdown', ['$timeout', 'teamsSservice', function teamDropdownDirectiveFunction($timeout, teamsSservice) {
        //Usage:
        //<team-dropdown></team-dropdown>
        var directive = {
            link: link,
            restrict: 'AE',
            require: '^ngModel',
            transclude: true,
            templateUrl: 'app/directives/templates/team-dropdown-tpl.html',
            scope: {
                'model': '=ngModel'
            },
        };
        return directive;
        function link(scope, element, attrs, ctrl) {
            $timeout(function () {
                teamsSservice.getTeamsList().then(function (resp) {
                    scope.teamList = resp;
                });
                console.log('team list loaded for series drop down directive:- ');
            });

            scope.$watch('model', function () {
                scope.$eval(attrs.ngModel + ' = model');
            });
            scope.$watch(attrs.ngModel, function (val) {
                scope.model = val;
                ctrl.$setViewValue(val);
                if (angular.isDefined(attrs.callFunc)) {
                    scope.callFunc();
                }
            });
        }

    }]);

    myApp.directive('matchTypeDropdown', ['matchTypeSservice', '$timeout', function matchTypeDropdownDirectiveFunction(matchTypeSservice, $timeout) {
        //Usage:
        //<match-type-dropdown></match-type-dropdown>
        var directive = {
            link: link,
            restrict: 'AE',
            require: '^ngModel',
            transclude: true,
            templateUrl: 'app/directives/templates/match-type-tpl.html',
            scope: {
                'model': '=ngModel'
            },
        };
        return directive;
        function link(scope, element, attrs, ctrl) {
            $timeout(function () {
                matchTypeSservice.getMatchTypeList().then(function (resp) {
                    scope.matcheTypesList = resp;
                });
            });

            scope.$watch('model', function () {
                scope.$eval(attrs.ngModel + ' = model');
            });
            scope.$watch(attrs.ngModel, function (val) {
                scope.model = val;
                ctrl.$setViewValue(val);
                if (angular.isDefined(attrs.callFunc)) {
                    scope.callFunc();
                }
            });
        }

    }]);

    myApp.directive('venueDropdown', ['venuesSservice', '$timeout', function venueDropdownDirectiveFunction(venuesSservice, $timeout) {
        //Usage:
        //<venue-dropdown></venue-dropdown>
        var directive = {
            link: link,
            restrict: 'AE',
            require: '^ngModel',
            transclude: true,
            templateUrl: 'app/directives/templates/venue-dropdown-tpl.html',
            scope: {
                'model': '=ngModel'
            },
        };
        return directive;
        function link(scope, element, attrs, ctrl) {
            $timeout(function () {
                venuesSservice.getVenuesList().then(function (resp) {
                    scope.venuesList = resp;
                });
            });

            scope.$watch('model', function () {
                scope.$eval(attrs.ngModel + ' = model');
            });
            scope.$watch(attrs.ngModel, function (val) {
                scope.model = val;
                ctrl.$setViewValue(val);
                if (angular.isDefined(attrs.callFunc)) {
                    scope.callFunc();
                }
            });
        }

    }]);
})();

