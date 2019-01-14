// Register the `mostView` component on the `mostView` module,
angular
    .module('mostView')
    .component('mostView', {
        templateUrl: '/javascripts/side-bar/most-view/most-view.template.html',
        controller: function MostViewController($http) {
            $http
                .post('/api/posts/search', {
                    "perPage": 5,
                    "orderBy": {
                        "view": -1
                    }
                })
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