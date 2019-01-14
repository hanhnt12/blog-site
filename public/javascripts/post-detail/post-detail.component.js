// Register the `postList` component on the `postList` module,
angular
    .module('postDetail')
    .component('postDetail', {
        templateUrl: '/javascripts/post-detail/post-detail.template.html',
        controller: function PostDetailController($http) {
            console.log(this.postId);
            $http
                .get('/api/posts/{{$ctrl.postId}}')
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
        }
    });