
// var keys = require("./keys.js");
// var userCommand = process.argv[2];
// var input = process.argv[3];
// for( var j = 4; j < process.argv.length; j++){ //loop through the arguments to concatinate a multi-word title with "+"
//         input += ("+" + process.argv[j]);
//     }

// if (userCommand === "my-tweets"){
//     var Twitter = require("twitter");
//     var client = new Twitter(keys[0]); //keys[0] is the object of twitter keys imported from keys.js
//     var params = {
//         screen_name: "barroncncn", //look up the handle barroncncn
//         count: 20 //limit return to 20 tweets
//     };
    
//     client.get("statuses/user_timeline", params, function(error, tweets, response){
//         if(!error){ //if there is no error
//             for( var i = 0; i < tweets.length; i++){ //loop through the 20 responses and log the text and date created
//                 console.log(tweets[i].text);
//                 console.log(tweets[i].created_at);
//             }
//         }
//     });
// }
// else if (userCommand === "spotify-this-song"){
    
//     var Spotify = require("node-spotify-api");
//     var spotify = new Spotify(keys[1]); //keys[1] is the object of spotify keys imported from keys.js
//     spotify.search({ type: 'track', query: encodeURI(input) }, function(error, data) { //encode the input in case the user put a multi-word title in quotation marks
//       if (error) {
//       return console.log('Error occurred: ' + error);
//       }
//         console.log("Song Name: " + data.tracks.items[0].name);
//         console.log("Artist: " + data.tracks.items[0].artists[0].name);
//         // for(var i = 0; i < data.tracks.items[0].artists; i ++){
//         //     console.log(data.tracks.items[0].artists[i].name);
//         // }
//         console.log("Preview Link: " + data.tracks.items[0].preview_url);
//         console.log("Album: " + data.tracks.items[0].album.name);
//     });
// }
// else if (userCommand === "movie-this"){
//     function getMovie(){
//             var movieURL = "http://www.omdbapi.com/?apikey=trilogy&t=" + input;
//             request(movieURL, function(error, data){
//                 if(error){
//                     return console.log(error);
//                 }
//                 console.log("Title: " + JSON.parse(data.body).Title);
//                 console.log("Release Year: " + JSON.parse(data.body).Year);
//                 console.log("IMDB Rating: " + JSON.parse(data.body).Ratings[0].Value);
//                 console.log("Rotten Tomatoes Rating: " + JSON.parse(data.body).Ratings[1].Value);
//                 console.log("Language: " + JSON.parse(data.body).Language);
//                 console.log("Produced in " + JSON.parse(data.body).Country);
//                 console.log("Plot: " + JSON.parse(data.body).Plot);
//                 console.log("Leading Actors: " + JSON.parse(data.body).Actors);
//             });
//     }
//     var request = require("request");
//     if(!input){
//         input = "Mr. Nobody";
//         getMovie();
//     }
//     else{
//         getMovie();
//     }
// }
// else if (userCommand === "do-what-it-says"){
//     var fs = require("fs");
//     fs.readFile("random.txt", "utf8", function(error, data){
//         var dataArr = (data.split(","));
//         input = dataArr[1];
//         userCommand = dataArr[0];
//     });
// }

// =============================================================================================================
var keys = require("./keys.js");
var inquirer = require("inquirer");
var userCommand = "";
var response = "";

inquirer.prompt([
    {
        type: "list",
        message: "Hello! What can I help you with today?",
        choices: ["Show Me Recent Tweets", "Get Spotify Information for a Song Title", "Get Information for a Movie Title", "Take Instruction from Text File"],
        name: "command",
    },
    {   
        message: "What song would you like to hear about?",
        type: "input",
        name: "response",
        when : function( answers ) {
                return answers.command === "Get Spotify Information for a Song Title";
              },
        default: "If you're not sure, just press enter. I know a good one!"
    },
    {
        message: "What movie would you like information about?",
        type: "input",
        name: "response",
        when : function( answers ) {
                return answers.command === "Get Information for a Movie Title";
              },
        default: "If you're not sure, just press enter. I know a good one!"
    }
    
]).then(function(answers){
    console.log(answers);
    userCommand = answers.command;
    response = answers.response;
    runApp();
});
// when: (Function, Boolean) Receive the current user answers hash and should return true or false depending on whether or not this question should be asked. The value can also be a simple boolean.
// // function doIt(){
    
// };
function tweet(){
    var Twitter = require("twitter");
    var client = new Twitter(keys[0]); //keys[0] is the object of twitter keys imported from keys.js
    var params = {
        screen_name: "barroncncn", //look up the handle barroncncn
        count: 20 //limit return to 20 tweets
    };
    //request recent tweets
    client.get("statuses/user_timeline", params, function(error, tweets, response){
        if(!error){ //if there is no error
            for( var i = 0; i < tweets.length; i++){ //loop through the 20 responses and log the text and date created
                console.log(tweets[i].text);
                console.log(tweets[i].created_at);
            }
        }
    });
}
function movie(){
    var request = require("request");
    var movieURL = "http://www.omdbapi.com/?apikey=trilogy&t=" + input;
    request(movieURL, function(error, data){
        if(error){
            return console.log(error);
        }
        console.log("Title: " + JSON.parse(data.body).Title);
        console.log("Release Year: " + JSON.parse(data.body).Year);
        console.log("IMDB Rating: " + JSON.parse(data.body).Ratings[0].Value);
        console.log("Rotten Tomatoes Rating: " + JSON.parse(data.body).Ratings[1].Value);
        console.log("Language: " + JSON.parse(data.body).Language);
        console.log("Produced in " + JSON.parse(data.body).Country);
        console.log("Plot: " + JSON.parse(data.body).Plot);
        console.log("Leading Actors: " + JSON.parse(data.body).Actors);
    });
}
function spotify(){
    var Spotify = require("node-spotify-api");
    var spotify = new Spotify(keys[1]); //keys[1] is the object of spotify keys imported from keys.js
    spotify.search({ type: 'track', query: encodeURI(response) }, function(error, data) { //encode the input in case the user put a multi-word title in quotation marks
      if (error) {
      return console.log('Error occurred: ' + error);
      }
    console.log("Song Name: " + data.tracks.items[0].name);
    console.log("Artist: " + data.tracks.items[0].artists[0].name);
    // for(var i = 0; i < data.tracks.items[0].artists; i ++){
    //     console.log(data.tracks.items[0].artists[i].name);
    // }
    console.log("Preview Link: " + data.tracks.items[0].preview_url);
    console.log("Album: " + data.tracks.items[0].album.name);
    });
}
function doText(){
    var fs = require("fs");
    fs.readFile("random.txt", "utf8", function(error, data){
        var dataArr = (data.split(","));
        response = dataArr[1];
        userCommand = dataArr[0];
        runApp();
    });
}
function runApp(){
    if (userCommand === "Show Me Recent Tweets" || userCommand === "my-tweets"){
        tweet();
    }
    else if(userCommand === "Get Spotify Information for a Song Title" || userCommand === "spotify-this-song"){
        if(response !== answers.default){
            spotify();
        }
        else{
            response = "The Sign ace";
            spotify();
        }
    }
    else if(userCommand === "Get Information for a Movie Title" || userCommand === "movie-this"){
        if(response !== answers.default){
            movie();
        }
        else{
            response = "Mr. Nobody";
            movie();
        }
    }
    else if(userCommand === "Take Instruction from Text File"){
        doText();
    }
}