app.controller("mainController", function($scope, $http){
 
    $scope.apiKey = "e978908584462f3c08e8d1102f3eed29";
    $scope.results = []; //for search, what to look for
    $scope.filterText = null; //for search; input on index will define value; starts with no filter
    $scope.availableGenres = []; //list formed by later function
    $scope.genreFilter = null; //starts with no filter, becomes whichever is selected
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
                angular.forEach(value.episodes, function(tvshow, index){ //each list of episodes, to imply a show?
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