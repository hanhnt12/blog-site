angular.
  module('blogApp').
  config(['$routeProvider',
    function config($routeProvider) {
      $routeProvider.
        when('/posts', {
          template: '<post-list></post-list>'
        }).
        when('/posts/:postId', {
          template: '<post-detail></post-detail>'
        }).
        otherwise('/posts');
    }
  ]);