app.controller("mainController", function($scope, $http){
 
    $scope.apiKey = "e978908584462f3c08e8d1102f3eed29";

    $scope.results = []; //for search, what to look for // DAN: Maybe a better way of saying this is that it is the set of all content available for searching. It is the results of the API request.
    $scope.filterText = null; //for search; input on index will define value; starts with no filter

    $scope.availableGenres = []; //list formed by later function
    $scope.genreFilter = null; //starts with no filter, becomes whichever is selected

    $scope.orderFields = ["Air Date", "Rating"]; //things to sort by
    $scope.orderDirections = ["Descending", "Ascending"]; //direction to sort
    $scope.orderField = "Air Date"; //Default order field
    $scope.orderReverse = false; //default order ascending

    $scope.setGenreFilter = function(genre) { //responds to ng-click in the genres
        $scope.genreFilter = genre; //updates the genre filter to have the clicked genre selected, which in turn filters the shows to match as usual
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

    $scope.init = function() {
        //API requires a start date
        var today = new Date(); //JS function to get today's date
        //Create the date string and ensure leading zeros if required
        var apiDate = today.getFullYear() + ("0" + (today.getMonth() + 1)).slice(-2) + "" + ("0" + today.getDate()).slice(-2); //formats the date the the number-string needed by the API with the tv shows
        $http.jsonp('http://api.trakt.tv/calendar/premieres.json/' + $scope.apiKey + '/' + apiDate + '/' + 30 + '/?callback=JSON_CALLBACK').success(function(data) {
            //data from an external source, so need to format it to use for desired effect
            //For each day, get all the episodes
            angular.forEach(data, function(value, index){ //for each data, do the function
                //The API stores the full date separately from each episode. Save it so we can use it later
                var date = value.date;
                //For each episodes, add it to the results array
                angular.forEach(value.episodes, function(tvshow, index){ //each list of episodes, to imply a show? // DAN: Each episode is run through this function. The episode is being called 'tvshow' within this function.
                    //Create a date string from the timestamp so we can filter on it based on user text input
                    tvshow.date = date; //Attach the full date to each episode; from previously pulled value.date
                    $scope.results.push(tvshow); //add the show to the results list
                    angular.forEach(tvshow.show.genres, function(genre, index){ //pulling available genres from list of shows from API
                        //Only add to the availableGenres array if it doesn't already exist
                        var exists = false;
                        angular.forEach($scope.availableGenres, function(avGenre, index){
                            if (avGenre == genre) {
                                exists = true;
                            } //if it's there, do nothing
                        });
                        if (exists === false) {
                            $scope.availableGenres.push(genre);
                            //if it's not there, add it to the availableGenres array
                        }
                    });
                });
            });
        }).error(function(error) {
 
        });
    };
});

app.filter('isGenre', function() { //check each tv show for a genre match
    return function(input, genre) { //input is automated, genre is pulled from genreFilter
        if (typeof genre == 'undefined' || genre == null) {
            return input;
        } else {
            var out = [];
            for (var a = 0; a < input.length; a++){ // DAN: Also consider writing the loop this way for efficiency: for (var a = 0, len = input.length; a < len; a++) {
                for (var b = 0; b < input[a].show.genres.length; b++){ // DAN: Also consider writing the loop this way for efficiency: for (var b = 0, genreLength = input[a].show.genres.length; b < genreLength; b++) {
                    if(input[a].show.genres[b] == genre) {
                        out.push(input[a]);
                    }
                }
            }
            return out;
        }
    };
});
