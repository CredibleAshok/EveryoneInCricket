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
})();

