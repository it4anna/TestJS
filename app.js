var app = angular.module("testJS", []);

app.controller('testJSCtrl', function ($scope, $http) {
    $http.get('items.json').then(function(itemCollection) {
        $scope.itemCollection = itemCollection.data;
    });
    $scope.isAllChecked = false;

    $scope.allCheckedClicked = function () {
        angular.forEach($scope.itemCollection, function (item) {
            item.isChecked = $scope.isAllChecked;
        });
    };

    $scope.onCheckBoxChanged = function () {
        $scope.isAllChecked = $scope.itemCollection.every(function (item) {
            return item.isChecked;
        });
    };
});

app.directive("row", function () {
    return {
        templateUrl: 'row.html',
        controllerAs: 'rowCtrl',
        controller: function ($scope) {
            $scope.item.isChecked = false;
            $scope.isEmpty = false;
            $scope.targetGroups = '';
            $scope.mediasNames = '';

            angular.forEach($scope.item.medias, function (media) {
                $scope.mediasNames ? $scope.mediasNames = $scope.mediasNames.concat(', ', media.name) : $scope.mediasNames = media.name;
            });

            angular.forEach($scope.item.targetGroup, function (group) {
                $scope.targetGroups += ($scope.targetGroups ? ', ' : '') + group.split(' - ')[0];
            }, this);

            $scope.isEmpty = !$scope.targetGroups;
            if (!$scope.targetGroups) {$scope.targetGroups = 'None';}
        }
    };
});

app.filter('dateFormat', function ($filter) {
    return function (milliseconds) {
        var date = new Date(milliseconds),
            minuteMillisec = 60,
            hourMillisec = 3600,
            dayMillisec = 86400,
            diffSeconds = (((new Date()).getTime() - date.getTime()) / 1000),
            diffDays = Math.round(diffSeconds / dayMillisec);

        return diffSeconds < minuteMillisec && "just now" ||
            diffSeconds < hourMillisec && Math.round(diffSeconds / minuteMillisec) + " minute(s) ago" ||
            diffSeconds < dayMillisec && Math.round(diffSeconds / minuteMillisec) + " hour(s) ago" ||
            diffDays == 1 && "Yesterday" ||
            diffDays < 7 && diffDays + " day(s) ago" ||
            diffDays < 31 && Math.ceil(diffDays / 7) + " week(s) ago" ||
            $filter('date')(date);
    };
});
