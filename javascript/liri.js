//USING PROMPTS/INQUIRER
//================================================================================================================================================

var keys = require("./keys.js");
var inquirer = require("inquirer");
var fs = require("fs");
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
        //If the user wants to know about a song, ask this follow up question
        when : function( answers ) {
                return answers.command === "Get Spotify Information for a Song Title";
              },
        default: "If you're not sure, just press enter. I know a good one!"
    },
    {
        message: "What movie would you like information about?",
        type: "input",
        name: "response",
        //If the user wants to know about movie, ask this follow up question
        when : function( answers ) {
                return answers.command === "Get Information for a Movie Title";
              },
        default: "If you're not sure, just press enter. I know a good one!"
}]).then(function(answers){
            userCommand = answers.command;
            response = answers.response;
            runApp();
});

function tweet(){
    var Twitter = require("twitter");
    var client = new Twitter(keys[0]); //keys[0] is the object of twitter keys imported from keys.js
    var params = {
        screen_name: "barroncncn", //look up the handle barroncncn
        count: 20 //limit return to 20 tweets
    };
    //request recent tweets
    client.get("statuses/user_timeline", params, function(error, tweets, response){
        if(error){
            return console.log('Error occurred: ' + error)
        }
        
        //Create the beginning of the ouptut array
        var outputArr = [
                        "==============================================================================================",
                        "",
                        "Here are the 20 most recent tweets:",
                        "" 
                      ];
        for( var i = 0; i < tweets.length; i++){ //loop through the 20 responses and push the text and date created to the output array
            outputArr.push((i+1) + "." + tweets[i].text);
            outputArr.push("   (" + tweets[i].created_at + ")")
            outputArr.push("");
        }
        //Push the ending lines to the output Array
        outputArr.push("");
        outputArr.push("==============================================================================================");
        
        //Write the array to log.txt
        fs.appendFile("log.txt", outputArr.join("\n"));
        
        //Log each item in the array 
        outputArr.forEach(function(item){
            console.log(item);
        });
        
    });
}

function spotify(){
    var Spotify = require("node-spotify-api");
    var spotify = new Spotify(keys[1]); //keys[1] is the object of spotify keys imported from keys.js
    spotify.search({ type: 'track', query: encodeURI(response) }, function(error, data) { //encode the input in case the user put a multi-word title in quotation marks
      if (error) {
        return console.log('Error occurred: ' + error);
      }
      //create an output array
      var outputArr = [
                        "==============================================================================================",
                        "",
                        "Here is your song information:",
                        "",
                        "Song Name: " + data.tracks.items[0].name,
                        "Artist: " + data.tracks.items[0].artists[0].name,
                        "Preview Link: " + data.tracks.items[0].preview_url,
                        "Album: " + data.tracks.items[0].album.name,
                        "",
                        "==============================================================================================",
                      ];
        
        //Write the array to log.txt
        fs.appendFile("log.txt", outputArr.join("\n"));
        
        //log each item in the array
        outputArr.forEach(function(item){
            console.log(item);
        });
    });
}

function movie(){
    var request = require("request"); //This is the only function requiring "request"
    var movieURL = "http://www.omdbapi.com/?apikey=trilogy&t=" + response; //OMDB endpoint & parameters
    request(movieURL, function(error, data){
        if(error){
            return console.log('Error occurred: ' + error);
        }
        //create the ouput array
        var outputArr = [
                            "==============================================================================================",
                            "",
                            "Here's your movie infomation:",
                            "",
                            "Title: " + JSON.parse(data.body).Title,
                            "Release Year: " + JSON.parse(data.body).Year,
                            "IMDB Rating: " + JSON.parse(data.body).Ratings[0].Value,
                            "Rotten Tomatoes Rating: " + JSON.parse(data.body).Ratings[1].Value,
                            "Language: " + JSON.parse(data.body).Language,
                            "Produced in " + JSON.parse(data.body).Country,
                            "Plot: " + JSON.parse(data.body).Plot,
                            "Leading Actors: " + JSON.parse(data.body).Actors,
                            "",
                            "=============================================================================================="
                        ];
        
        //Write the array to log.txt
        fs.appendFile("log.txt", outputArr.join("\n"));
        
        //log each item in the array             
        outputArr.forEach(function(item){
            console.log(item);
        });
    });
}

function doText(){
    fs.readFile("random.txt", "utf8", function(error, data){ //Read the user's random.txt input
        if(error){
            return console.log('Error occurred: ' + error)
        }
        var dataArr = (data.split(",")); //create an array with items split at the comma
        userCommand = dataArr[0]; //The command is the first item in the array
        response = dataArr[1]; //The response is the second item in the array
        runApp(); //Now runApp() will get the proper information for the user
    });
}

function runApp(){ //This function decides what to do based on the users choice and/or input into random.txt
    var defaultFollowUp = "If you're not sure, just press enter. I know a good one!";
    
    if (userCommand === "Show Me Recent Tweets" || userCommand === "my-tweets"){
        tweet();
    }
    else if(userCommand === "Get Spotify Information for a Song Title" || userCommand === "spotify-this-song"){
        //If the user entered a movie title
        if(response !== defaultFollowUp){
            spotify();
        }
        //If the user elected to be surprised, we default to The Sign by Ace of Base
        else{
            response = "The Sign ace";
            spotify();
        }
    }
    else if(userCommand === "Get Information for a Movie Title" || userCommand === "movie-this"){
        //If the user entered a movie title
        if(response !== defaultFollowUp){
            movie();
        }
        //If the user elected to be surprised, we default to Mr. Nobody
        else{
            response = "Mr. Nobody";
            movie();
        }
    }
    else if(userCommand === "Take Instruction from Text File"){
        doText();
    }
}











// SAME FUNCTIONALITY WITHOUT PROMPTS/INQUIRE
//=========================================================================================================
// var keys = require("./keys.js");
// var fs = require("fs");
// var userCommand = process.argv[2];
// var response = process.argv[3];

// function tweet(){
//     var Twitter = require("twitter");
//     var client = new Twitter(keys[0]); //keys[0] is the object of twitter keys imported from keys.js
//     var params = {
//         screen_name: "barroncncn", //look up the handle barroncncn
//         count: 20 //limit return to 20 tweets
//     };
//     //request recent tweets
//     client.get("statuses/user_timeline", params, function(error, tweets, response){
//         if(error){
//             return console.log('Error occurred: ' + error)
//         }
        
//         //Create the beginning of the ouptut array
//         var outputArr = [
//                         "==============================================================================================",
//                         "",
//                         "Here are the 20 most recent tweets:",
//                         "" 
//                       ];
//         for( var i = 0; i < tweets.length; i++){ //loop through the 20 responses and push the text and date created to the output array
//             outputArr.push((i+1) + "." + tweets[i].text);
//             outputArr.push("   (" + tweets[i].created_at + ")")
//             outputArr.push("");
//         }
//         //Push the ending lines to the output Array
//         outputArr.push("");
//         outputArr.push("==============================================================================================");
        
//         //Write the array to log.txt
//         fs.appendFile("log.txt", outputArr.join("\n"));
        
//         //Log each item in the array 
//         outputArr.forEach(function(item){
//             console.log(item);
//         });
        
//     });
// }

// function spotify(){
//     console.log("Command: " + userCommand);
//     console.log("Response: " + response);
//     var Spotify = require("node-spotify-api");
//     var spotify = new Spotify(keys[1]); //keys[1] is the object of spotify keys imported from keys.js
//     spotify.search({ type: 'track', query: encodeURI(response) }, function(error, data) { //encode the input in case the user put a multi-word title in quotation marks
//       if (error) {
//         return console.log('Error occurred: ' + error);
//       }
//       //create an output array
//       var outputArr = [
//                         "==============================================================================================",
//                         "",
//                         "Here is your song information:",
//                         "",
//                         "Song Name: " + data.tracks.items[0].name,
//                         "Artist: " + data.tracks.items[0].artists[0].name,
//                         "Preview Link: " + data.tracks.items[0].preview_url,
//                         "Album: " + data.tracks.items[0].album.name,
//                         "",
//                         "==============================================================================================",
//                       ];
        
//         //Write the array to log.txt
//         fs.appendFile("log.txt", outputArr.join("\n"));
        
//         //log each item in the array
//         outputArr.forEach(function(item){
//             console.log(item);
//         });
//     });
// }

// function movie(){
//     console.log("Command: " + userCommand);
//     console.log("Response: " + response);
//     var request = require("request"); //This is the only function requiring "request"
//     var movieURL = "http://www.omdbapi.com/?apikey=trilogy&t=" + response; //OMDB endpoint & parameters
//     request(movieURL, function(error, data){
//         if(error){
//             return console.log('Error occurred: ' + error);
//         }
//         //create the ouput array
//         var outputArr = [
//                             "==============================================================================================",
//                             "",
//                             "Here's your movie infomation:",
//                             "",
//                             "Title: " + JSON.parse(data.body).Title,
//                             "Release Year: " + JSON.parse(data.body).Year,
//                             "IMDB Rating: " + JSON.parse(data.body).Ratings[0].Value,
//                             "Rotten Tomatoes Rating: " + JSON.parse(data.body).Ratings[1].Value,
//                             "Language: " + JSON.parse(data.body).Language,
//                             "Produced in " + JSON.parse(data.body).Country,
//                             "Plot: " + JSON.parse(data.body).Plot,
//                             "Leading Actors: " + JSON.parse(data.body).Actors,
//                             "",
//                             "=============================================================================================="
//                         ];
        
//         //Write the array to log.txt
//         fs.appendFile("log.txt", outputArr.join("\n"));
        
//         //log each item in the array             
//         outputArr.forEach(function(item){
//             console.log(item);
//         });
//     });
// }

// function doText(){
//     console.log(userCommand)
//     fs.readFile("random.txt", "utf8", function(error, data){ //Read the user's random.txt input
//         if(error){
//             return console.log('Error occurred: ' + error)
//         }
//         var dataArr = (data.split(",")); //create an array with items split at the comma
//         userCommand = dataArr[0]; //The command is the first item in the array
//         response = dataArr[1]; //The response is the second item in the array
//         runApp(); //Now runApp() will get the proper information for the user
//     });
// }

// function runApp(){ //This function decides what to do based on the users choice and/or input into random.txt
    
//     for( var j = 4; j < process.argv.length; j++){ //loop through the arguments to concatinate a multi-word title with "+"
//         response += ("+" + process.argv[j]);
//     } 
    
//     if (userCommand === "my-tweets"){
//         tweet();
//     }
//     else if(userCommand === "spotify-this-song"){
//         //If the user entered a movie title
//         if(response !== undefined){
//             spotify();
//         }
//         //If the user elected to be surprised, we default to The Sign by Ace of Base
//         else{
//             response = "The Sign ace";
//             spotify();
//         }
//     }
//     else if(userCommand === "movie-this"){
//         //If the user entered a movie title
//         if(response){
//             movie();
//         }
//         //If the user elected to be surprised, we default to Mr. Nobody
//         else{
//             response = "Mr. Nobody";
//             movie();
//         }
//     }
//     else if(userCommand === "do-what-it-says"){
//         doText();
//     }
// }

// runApp();