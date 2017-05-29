(function () {
    myApp.directive('scoreCardTpl', [scoreCardDirectiveFunction]);
    function scoreCardDirectiveFunction() {
        //Usage:
        //<div score-card-tpl ></div>
        var directive = {
            link: link,
            restrict: 'E',
            templateUrl: 'app/directives/templates/score-card-tpl.html',
            scope: {
                'scoreCardData': '=scoreCardData',
                'matchStats': '=matchStats'
            },
        };
        return directive;
        function link(scope, element, attrs, ctrl) {
            console.log('score card directive loaded.' + scope.scoreCardData);
            console.log('score card directive loaded.' + scope.matchStats);
        }

    }
})();

