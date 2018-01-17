var twit = require('twit');
var config = require('./config.js');
var Twitter = new twit(config);

// RETWEET BOT ==========================

// find latest tweet according the query 'q' in params
var retweet = function() {
    var params = {
        q: '#nba, #nfl',  // REQUIRED
        result_type: 'recent',
        lang: 'en'
    }
    Twitter.get('search/tweets', params, function(err, data) {
      // if there no errors
        if (!err) {
          // grab ID of tweet to retweet
            var retweetId = data.statuses[0].id_str;
            // Tell TWITTER to retweet
            Twitter.post('statuses/retweet/:id', {
                id: retweetId
            }, function(err, response) {
                if (response) {
                    console.log('Retweeted!!!');
                }
                // if there was an error while tweeting
                if (err) {
                    console.log('Something went wrong while RETWEETING... Duplication maybe...');
                }
            });
        }
        // if unable to Search a tweet
        else {
          console.log('Something went wrong while SEARCHING...');
        }
    });
}

// grab & retweet as soon as program is running...
//retweet();
// retweet in every 50 minutes
//setInterval(retweet, 30000);

// FAVORITE BOT====================

// find a random tweet and 'favorite' it
var favoriteTweet = function(){
  var params = {
      q: '#kobe, #curry',  // REQUIRED
      result_type: 'recent',
      lang: 'en'
  }
  // find the tweet
  Twitter.get('search/tweets', params, function(err,data){

    // find tweets
    var tweet = data.statuses;
    var randomTweet = ranDom(tweet);   // pick a random tweet

    // if random tweet exists
    if(typeof randomTweet != 'undefined'){
      // Tell TWITTER to 'favorite'
      Twitter.post('favorites/create', {id: randomTweet.id_str}, function(err, response){
        // if there was an error while 'favorite'
        if(err){
          console.log('CANNOT BE FAVORITE... Error');
        }
        else{
          console.log('FAVORITED... Success!!!');
        }
      });
    }
  });
}
// grab & 'favorite' as soon as program is running...
//favoriteTweet();
// 'favorite' a tweet in every 60 minutes
//setInterval(favoriteTweet, 36000);

// function to generate a random tweet tweet
function ranDom (arr) {
  var index = Math.floor(Math.random()*arr.length);
  return arr[index];
};

//Get random coordinates and 
var randomLocation = function() {
  var long1 = randomInRange(-180,180);
  console.log(long1);
  var long2 = randomInRange(-180,180);
  console.log(long2);
  var lat1 = randomInRange(-90,90);
  console.log(lat1);
  var lat2 = randomInRange(-90,90);
  console.log(lat2);
  
  
  var locations = [ long1, lat1, long2, lat2 ]
 
  var stream = Twitter.stream('statuses/filter', { locations: locations })
  console.log('stream success');
  
  stream.on('tweet', function (tweet) {
    console.log('reached');
    var loc = tweet.user.location;
    console.log('reached2');
    Twitter.post('statuses/update', { status: 'Tweet from ' + loc }, function(err, data, response) {
      console.log(loc)
    })
    // Tell TWITTER to retweet
            Twitter.post('statuses/retweet/:id', {
                id: tweet.id
            }, function(err, response) {
                if (response) {
                    console.log('Retweeted!!!');
                }
                // if there was an error while tweeting
                if (err) {
                    console.log('Something went wrong while RETWEETING... Duplication maybe...');
                }
            })
  })
}

function randomInRange(min, max) {
  return Math.random() < 0.5 ? ((1-Math.random()) * (max-min) + min) : (Math.random() * (max-min) + min);
}

randomLocation();
setInterval(randomLocation, 30000);

