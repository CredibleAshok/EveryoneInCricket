(function () {
    myApp.directive('showIfFeature', ['securitySservice', function showIfFeatureDirectiveFunction(securitySservice) {
        //Usage:
        //<div show-if-feature="feature" ></div>
        var directive = {
            link: link,
            restrict: 'A'
        };
        return directive;
        function link(scope, element, attrs, ctrl) {
            var showCtrl = securitySservice.checkFeatureAvailablity(attrs.showIfFeature);
            if (showCtrl) {
                angular.element(element).addClass("show-feature-available");
            } else {
                angular.element(element).addClass("hide-feature-not-available");
            }
        }

    }]);
    
})();

