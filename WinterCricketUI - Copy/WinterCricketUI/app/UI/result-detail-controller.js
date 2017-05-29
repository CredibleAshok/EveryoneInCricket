(function () {
    myApp.controller('resultDetailCtrl', function ($scope) {
        var vm = this;
        $scope.$watch('tableData', function (nval, oval) { // don't use scope while watching
            if (nval!= undefined && nval.length > 0) {
                vm.myData = nval;
                console.log("length1 is:-" + vm.myData); // use scope whenever outside watch.
            }
        });
    });
})();
