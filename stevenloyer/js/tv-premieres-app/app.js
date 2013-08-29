app.controller("mainController", function($scope, $http){
    $scope.apiKey = "67fea54e94d36f5016e3e014445808c0";
    $scope.results = [];
    $scope.filterText = null;
    $scope.availableGenres = [];
    $scope.genreFilter = null;
    $scope.orderFields = ["Air Date", "Rating"];
    $scope.orderDirections = ["Descending", "Ascending"];
    $scope.orderField = "Air Date"; //Default order field
    $scope.orderReverse = false;
    $scope.init = function() {
        //API requires a start date
        var today = new Date();
        //Create the date string and ensure leading zeros if required
        var apiDate = today.getFullYear() + ("0" + (today.getMonth() + 1)).slice(-2) + "" + ("0" + today.getDate()).slice(-2);
        $http.jsonp('http://api.trakt.tv/calendar/premieres.json/' + $scope.apiKey + '/' + apiDate + '/' + 30 + '/?callback=JSON_CALLBACK').success(function(data) {
            //As we are getting our data from an external source, we need to format the data so we can use it to our desired affect
            //For each day get all the episodes
            angular.forEach(data, function(value, index){
                //The API stores the full date separately from each episode. Save it so we can use it later
                //SL:  Since we are using an API and one of the parameters needed is your own API so we simply pass that through.
                //SL: We also need to pass a start date and the number of days needed.
                var date = value.date;
                //For each episodes add it to the results array
                //SL: Adding episodes to the results array so we can populate our list
                angular.forEach(value.episodes, function(tvshow, index){
                    //Create a date string from the timestamp so we can filter on it based on user text input
                    tvshow.date = date; //Attach the full date to each episode
                    $scope.results.push(tvshow);
                     //Loop through each genre for this episode
                     angular.forEach(tvshow.show.genres, function(genre, index){
                         //Only add to the availableGenres array if it doesn't already exist
                         //Creating a fail safe so we don't end up with duplicates of Generes.
                         var exists = false;
                         angular.forEach($scope.availableGenres, function(avGenre, index){
                             if (avGenre == genre) {
                                exists = true;
                             }
                         });
                         if (exists === false) {
                            $scope.availableGenres.push(genre);
                         } //SL: Pushes genere to the menu
                     });

         		});
            });//SL: If there ais an error, this returns the error.
        }).error(function(error) {

        });
    };
    $scope.setGenreFilter = function(genre) {
        $scope.genreFilter = genre;
    }
    $scope.customOrder = function(tvshow) {
        switch ($scope.orderField) {
            case "Air Date":
                return tvshow.episode.first_aired;
                break;
            case "Rating":
                return tvshow.episode.ratings.percentage;
                break;
        }
    };
});

app.filter('isGenre', function() {
    return function(input, genre) {
        if (typeof genre == 'undefined' || genre == null) {
            return input;
        } else {
            var out = [];
            for (var a = 0; a < input.length; a++){
                for (var b = 0; b < input[a].show.genres.length; b++){
                    if(input[a].show.genres[b] == genre) {
                        out.push(input[a]);
                    }
                }
            }
            return out;
        }
    };
});

//SL: IseGenere is filtering based on if the users selects the genre I believe...
//It its doing a loop over what ever genre(s) is selected

