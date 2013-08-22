app.controller("mainController", function($scope, $http){
    // TRACY NOTE: put in the API key for the Trakt API - when I look at the console it threw a "400" error. Addendum: When you put an API key in place, remember to take out the [] so that it will actually work!
    $scope.apiKey = "6c66a888e72450f1a25a66c953d6918f";
    $scope.results = []; // TRACY NOTE: empty scope results variable for results array
    $scope.filterText = null; // TRACY QUESTION: why is this set to null initially? Do we set it to null initially so it acts as a placeholder until we modify it by typing in the input on the page0???
    $scope.availableGenres = [];
    $scope.genreFilter = null;

    $scope.orderFields = ['Air Date', 'Rating'];
    $scope.orderDirections = ['Descending', 'Ascending'];
    $scope.orderField = 'Air Date'; // default order field
    $scope.orderReverse = false;

    $scope.init = function() {
        //API requires a start date
        var today = new Date();
        //Create the date string and ensure leading zeros if required
        var apiDate = today.getFullYear() + ("0" + (today.getMonth() + 1)).slice(-2) + "" + ("0" + today.getDate()).slice(-2);
        $http.jsonp('http://api.trakt.tv/calendar/premieres.json/' + $scope.apiKey + '/' + apiDate + '/' + 30 + '/?callback=JSON_CALLBACK').success(function(data) {
// TRACY NOTE: Like how it's explained here... makes sense - have to grab the external data and make it work for what we want
            //As we are getting our data from an external source, we need to format the data so we can use it to our desired affect
            //For each day get all the episodes
            angular.forEach(data, function(value, index){
                //The API stores the full date separately from each episode. Save it so we can use it later
                var date = value.date;
                //For each episodes add it to the results array
// TRACY NOTE: so this next line's "forEach" is essentially a loop that will go through each date group pulled from the API store it in the date variable. value and index are the properties... 
                angular.forEach(value.episodes, function(tvshow, index){
                    //Create a date string from the timestamp so we can filter on it based on user text input
                    tvshow.date = date; //Attach the full date to each episode
                    $scope.results.push(tvshow);

// TRACY NOTE: Next part changes to be able to populate the genres array                     
                    //Loop through each genre for this episode
                    angular.forEach(tvshow.show.genres, function(genre, index){
                        //Only add to the availableGenres array if it doesn't already exist
// TRACY NOTE: i.e. if it finds it (exists = true;) then don't do anything, but if it doesn't find it (exists === false) then add the genre to the genres available - correct?
                        var exists = false;

                        angular.forEach($scope.availableGenres, function(avGenre, index){
                            if (avGenre == genre) {
                                exists = true;
                            }
                        });
                        if (exists === false) {
                            $scope.availableGenres.push(genre);
                        }
                    });
                });
            });
        }).error(function(error) {
 
        });
    };
// TRACY NOTE: time to add some "click" functionality to the genre stuff (those span items that show the genre "buttons" in the details box on the right)

// TRACY NOTE: I was a bit confused as to where to put this until I read closely that it needs to go inside this function... but it makes sense because $scope is one of the properties... so it would be undefined if it was set up outside of this 

    $scope.setGenreFilter = function(genre) {
        $scope.genreFilter = genre;
    }

// basically this is a way to sort the data by air date or rating and it ties the variables up top to the filters on line 42 of the html file (is this right?)
    $scope.customOrder = function(tvshow) {
        switch ($scope.orderField) {
            case 'Air Date':
                return tvshow.episode.first_aired;
                break;
            case 'Rating':
                return tvshow.episode.ratings.percentage;
                break;
        }
    };
    
});

// TRACY NOTE: the custom filter below allow us to filter just on one particular part of the application's data objects - the genre
app.filter('isGenre', function() {
    return function(input, genre) {
        if (typeof genre == 'undefined' || genre == null) {
            return input;
        } else {
            var out = [];
// TRACY NOTE: here below we loop through if the typeof genre was not undefined or null - i.e. user picked a genre - it goes through and filters out those that aren't matching and only shows those that are - nifty!
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
