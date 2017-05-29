(function () {
    myApp.directive('matchDetailTpl', [matchDetailDirectiveFunction]);
    function matchDetailDirectiveFunction() {
        //Usage:
        //<div match-detail-tpl ></div>
        var directive = {
            link: link,
            restrict: 'E',
            templateUrl: 'app/directives/templates/match-detail-tpl.html',
            scope: {
                'tableData': '=tableData',
                'displayType': '=displayType'
            }
        };
        return directive;
        function link(scope, element, attrs, ctrl) {
            console.log('directive loaded.');
        }

    }
})();

