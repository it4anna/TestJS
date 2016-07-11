var BEmock = [
    {
        id: 1,
        name: "Home decor fans",
        medias: [
            {id: "m1", name: "Isabelas.dk"},
            {id: "m2", name: "Tidenskvinder.dk"},
            {id: "m3", name: "elle.dk"},
            {id: "m4", name: "femina.dk"}
        ],
        targetGroup: ["Gender - female", "Age - any"],
        lastRefresh: 1468106075831,
        reach: 0.4,
        pagesPerUser: 5
    },
    {
        id: 2,
        name: "Likes cooking",
        medias: [
            {id: "m5", name: "Slankeklubben.dk"},
            {id: "m6", name: "Spisbedre.dk"},
            {id: "m7", name: "Madogbolig.dk"}
        ],
        targetGroup: [],
        lastRefresh: 1368119075831,
        reach: 0.2,
        pagesPerUser: 3.123123
    },
    {
        id: 3,
        name: "Young women",
        medias: [
            {id: "m4", name: "femina.dk"},
            {id: "m8", name: "viunge.dk"}
        ],
        targetGroup: ["Gender - women", "Age - young"],
        lastRefresh: 1468105045831,
        reach: 0.05,
        pagesPerUser: 8
    }
];

var app = angular.module("testJS", []);

app.controller('testJSCtrl', function ($scope) {
    $scope.items = BEmock;
    $scope.isAllChecked = false;
    $scope.isAnyChecked = false;

    $scope.$watch('isAllChecked', function () {
        angular.forEach($scope.items, function (item) {
            item.isChecked = $scope.isAllChecked;
        });
    });
});

app.directive("row", function () {
    return {
        template: '<td><input type="checkbox" data-ng-model="item.isChecked"></td> \
        <td>{{item.name}}</td> \
        <td>{{mediasNames}}</td> \
        <td data-class="{empty: isEmpty}">{{targetGroups}}</td> \
        <td>{{item.lastRefresh | dateFormat}}</td> \
        <td>{{item.reach * 100}}%</td> \
        <td> \
        <div class="inline-block pages">{{item.pagesPerUser}}</div> \
        <div data-include="\'drop_down.html\'" class="inline-block pull-right"></div> \
        </td>',
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
            millisecondsInDay = 86400,
            diffSeconds = (((new Date()).getTime() - date.getTime()) / 1000),
            diffDays = Math.floor(diffSeconds / millisecondsInDay);

        return diffSeconds < 60 && "just now" ||
            diffSeconds < 120 && "1 minute ago" ||
            diffSeconds < 3600 && Math.floor(diffSeconds / 60) + " minutes ago" ||
            diffSeconds < 7200 && "1 hour ago" ||
            diffSeconds < millisecondsInDay && Math.floor(diffSeconds / 3600) + " hours ago" ||
            diffDays == 1 && "Yesterday" ||
            diffDays < 7 && diffDays + " days ago" ||
            diffDays < 31 && Math.ceil(diffDays / 7) + " weeks ago" ||
            $filter('date')(date);
    };
});
