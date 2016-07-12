var app = angular.module('testJS', []);

app.controller('testJSCtrl', function ($scope, $http) {
    $scope.checkedItemIdList = [];
    $scope.isAllChecked = false;

    $http.get('items.json').then(function (itemCollection) {
        $scope.itemCollection = itemCollection.data;
    });

    $scope.onAllCheckClicked = function () {
        $scope.checkedItemIdList = [];
        angular.forEach($scope.itemCollection, function (item) {
            item.isChecked = $scope.isAllChecked;
            $scope.isAllChecked && $scope.checkedItemIdList.push(item.id);
        });
    };

    $scope.onCheckboxChanged = function () {
        $scope.checkedItemIdList = [];

        angular.forEach($scope.itemCollection, function (item) {
            if (item.isChecked) $scope.checkedItemIdList.push(item.id);
        });

        $scope.isAllChecked = $scope.checkedItemIdList.length === $scope.itemCollection.length;
    };

    $scope.onRefreshClicked = function (id) {
        var idListToRefresh = id ? [id] : $scope.checkedItemIdList;
    };
});

app.directive('row', function () {
    return {
        templateUrl: 'row.html',
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
            if (!$scope.targetGroups) {
                $scope.targetGroups = 'None';
            }
        }
    };
});

app.directive('dropDown', function () {
    return {
        templateUrl: 'drop_down.html'
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

        return diffSeconds < minuteMillisec && 'just now' ||
            diffSeconds < hourMillisec && Math.round(diffSeconds / minuteMillisec) + ' minute(s) ago' ||
            diffSeconds < dayMillisec && Math.round(diffSeconds / minuteMillisec) + ' hour(s) ago' ||
            diffDays == 1 && 'Yesterday' ||
            diffDays < 7 && diffDays + ' day(s) ago' ||
            diffDays < 31 && Math.ceil(diffDays / 7) + ' week(s) ago' ||
            $filter('date')(date);
    };
});
