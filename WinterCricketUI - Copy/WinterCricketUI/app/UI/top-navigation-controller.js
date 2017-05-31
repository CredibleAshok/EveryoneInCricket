//This controller controls the dynamic display of menu items or top level navegation.
(function () {
    myApp.controller('topNavigationCtrl', function ($scope, routes, $filter) {
        var vm = this;
        vm.routes = routes;
    })
})();
