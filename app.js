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
    lastRefresh: 1463575887957,
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
    lastRefresh: 1463259600000,
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
    lastRefresh: 1462568400000,
    reach: 0.05,
    pagesPerUser: 8
  }
];


var app = angular.module("testJS", []);
app.controller('testJSCtrl', function($scope) {
  $scope.items = BEmock;
});

app.directive("row", function() {
  return {
    template : '<tr>' +
      '<td>{{item}}</td>' +
    '</tr>',
    link: function($scope, $element, $attr) {
    }
  };
});
