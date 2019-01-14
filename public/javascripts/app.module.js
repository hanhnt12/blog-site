// Define the `blogApp` module
angular.module('blogApp', [
    // ...which depends on the `postList` module
    'postList',
    'postDetail',
    'mostView'
]);