// Register the `postList` component on the `postList` module,
angular
    .module('postList')
    .component('postList', {
        templateUrl: '/javascripts/post-list/post-list.template.html',
        controller: function PostListController($http) {
            $http
                .get('/api/posts')
                .then((response) => {
                    if (response.data.success) {
                        this.posts = response.data.responseData.list;
                    } else {
                        throw new Error(response.data.message);
                    }
                })
                .catch((err) => {
                    alert(err.message);
                });
            this.postWrapperClass = function (index) {
                if (index === 1 || index == 2) {
                    return 'col-md-6'
                }
                return 'col-md-12';
            };
            this.postInnerClass = function (index) {
                if (index === 0) {
                    return 'post post-thumb'
                }
                if (index === 1 || index == 2) {
                    return 'post'
                }
                return 'post post-row';
            };
        }
    });