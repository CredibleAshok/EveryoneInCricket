(function () {
    myApp.directive('filterDropdown', [filterDropdownDirectiveFunction]);
    function filterDropdownDirectiveFunction() {
        //Usage:
        //<filter-Dropdown></filter-Dropdown>
        var directive = {
            link: link,
            restrict: 'E',
            transclude: true,
            templateUrl: 'app/directives/templates/filter-dropdown-tpl.html',
            scope: {
                'searchFilter': '=searchFilter',
                'colFilter': '=colFilter',
                'colDataType': '=colDataType'
            },
        };
        return directive;
        function link(scope, element, attrs, ctrl) {
            console.log('filter drop down directive loaded:- ' + scope.searchFilter + 'colFilter:- ' + scope.colFilter + 'colDataType:-' + scope.colDataType);
        }

    }
})();

