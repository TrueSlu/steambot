const SteamUser = require('steam-user');
const SteamTotp = require('steam-totp');
const config = require('./config.json');
const client = new SteamUser();

//Steam-user returns a funky object for the steam user
//id. It works throughout the npm module and works 
//for steam web api. It's just not a real steam ID.
//The function below can help you find the real one.

const trueID = function(steamID) {
    request({
    uri: 'https://api.steampowered.com/ISteamUser/GetPlayerSummaries/v0002/?key=D1677EC72DFDC8B7D2C2032D2B70C734&steamids=' + steamID,
    method: "GET",
    }, function(error, response, body) {
        let steamResponse = JSON.parse(body);
        theTruestID = steamResponse.response.players[0].steamid;
        return theTruestID;
    });
};

//Logs the bot into Steam.

const logOnOptions = {
    accountName: config.username,
    password: config.password,
};

client.logOn(logOnOptions);

//When logged on, configures the bot's status.

client.on('loggedOn', () => {
    console.log('Logged into Steam');
    client.setPersona(SteamUser.Steam.EPersonaState.Online);
    client.gamesPlayed(440); //you can have your bot play a game while online. Simply enter the game ID, It's set to TF2 right now.
});

//Edit the below for the message handler.

client.on('friendMessage', (senderID, message) => { //When the bot receieves a message from a friend, it will process the message.

    if (message === "hello") {
        newMessage = "hi there!";
    }

    else if (message === "you are a cool dude!") {
        newMessage = "thanks!";
    }
});

//Switch cases also work:
//
//    switch (message) {
//        case "hello":
//            newMessage = "hi there!";
//            break;
//
//        case "you are a cool dude!":
//            newMessage = "thanks!";
//            break;
//    }

const initiator = "Hi there!";

//Accepts friend requests
//
//Here's a full list of friendRelationships:
//None = 0,
//Blocked = 1,
//PendingInvitee = 2,
//RequestRecipient = 2, (alias of PendingInvitee)
//Friend = 3,
//RequestInitiator = 4,
//PendingInviter = 4, (alias of RequestInitiator)
//Ignored = 5,
//IgnoredFriend = 6,
//SuggestedFriend = 7

client.on('friendRelationship', (steamID, relationship) => {
    if (relationship === 3) {
        client.chatMessage(steamID, initiator); //Initiates a conversation when a friend is added.
        trueID(steamID);
    }

    if (relationship === 2) {
        addFriend(steamID); //if there's a pending friend request, accept it.
    }
});

//Final note:
//The steam-user api is very thorough and power.
//I encourage you to try it out to the fullest.
//It's quite neat!
//
//You can make trade bots, add bots, and more!
//
//Extra resources:
//1. https://github.com/andrewda/node-steam-guide
//2. https://github.com/scholtzm/awesome-steam
