(function () {
    myApp.directive('resultDetailTpl', [resultDetailDirectiveFunction]);
    function resultDetailDirectiveFunction() {
        //Usage:
        //<div result-detail-tpl></div>
        var directive = {
            link: link,
            restrict: 'E',
            templateUrl: 'app/directives/templates/result-detail-tpl.html',
            scope: {
                'tableData': '=tableData',
                'displayType': '=displayType'
            }
        };
        return directive;
        function link(scope, element, attrs, ctrl) {
            console.log('result directive loaded.');
        }

    }
})();

