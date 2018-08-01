const SteamUser = require('steam-user');
const SteamTotp = require('steam-totp');
const config = require('./config.json');
const request = require("request");
const client = new SteamUser();
const util = require('util')
const exec = require('child_process').exec;

let profiles = [];

const findID = function(steamID) {
    for (i in profiles) {
        console.log(profiles[i]);
        if (profiles[i].id.toString() === steamID.toString()) {
            return i;
        }
    }
}

const trueID = function(steamID) {
    request({
    uri: 'https://api.steampowered.com/ISteamUser/GetPlayerSummaries/v0002/?key=D1677EC72DFDC8B7D2C2032D2B70C734&steamids=' + steamID,
    method: "GET",
    }, function(error, response, body) {
        let steamResponse = JSON.parse(body);
        theTruestID = steamResponse.response.players[0].steamid;
        addFriends(steamID);
        profiles.push(new Profile(theTruestID, steamID));
    });
};
 
class Profile {
    constructor(theTruestID, steamID) {
        this.trueID = theTruestID;
        this.id = steamID;
        this.scammed = "N/A";
        this.timesScammed = "N/A";
        this.valueScammed = "N/A";
    }
}
var net = require('net');

var socketClient = new net.Socket();
socketClient.connect(8088,'10.0.0.153', function() {
    console.log('Connected');
});

socketClient.on('close', function() {
    console.log('Connection closed');
});

const logOnOptions = {
    accountName: config.username,
    password: config.password,
};

client.logOn(logOnOptions);

client.on('loggedOn', () => {
    console.log('Logged into Steam');
    client.setPersona(SteamUser.Steam.EPersonaState.Online);
    client.gamesPlayed(440);
});

client.on('friendMessage', (senderID, message) => {
    i = findID(senderID);
    console.log(i);
    if (message == "no" || message == "no") {
        const yesMessage = "Nice! Alrighty, stay safe out there. I will now unfriend you! I will also block you so I don't bother you again (also to ensure no duplicates in my data). Thank you for your time!"
    client.chatMessage(senderID, noMessage);
    profiles[i].scammed = "No";
    client.removeFriend(senderID);
    }

    else if (message == "Yes" || message == "yes") {
        const yesMessage = "That sucks! How many times has something like that happened to you? (Please enter a positive integer (1, 2, 3, etc.) so that I can understand you!"
        client.chatMessage(senderID, yesMessage);
        profiles[i].scammed = "Yes";
    }

    else if (!isNaN(message)) {
        scammedMessage = "Aw, sorry to hear that! If I may ask, how much (in USD), have you gotten scammed for? Please include a '$' in front of your number value (ex: $30). Estimates are fine."
        client.chatMessage(senderID, scammedMessage);
        profiles[i].timesScammed = message;
    }

    else if (message.startsWith("$") == true) {
        moneyMessage = "Ouch! Well, stay safe out there. I will now unfriend you. I will also block you so I don't bother you again (also to ensure no duplicates in my data). Thank you for your time!"
        client.chatMessage(senderID, moneyMessage);
        profiles[i].valueScammed = message;
        client.removeFriend(senderID);
    }
    else {
        const errorMessage = "Sorry! I didn't quite get that. Please type either 'yes' or 'no' for the first question and a positive real number for the second question!"
        client.chatMessage(senderID, errorMessage);
    }
});

const surveyQuestion = 'Hello there! I am a survey bot collecting data for a project for my creator! I only have one question for you, and then I will automatically unfriend you and be on my merry way! Please answer the following question: "Have you ever been scammed inside the Steam platform?" Please type "Yes" or "No." You can also remove me, I will block you so I do not bother you again!';

client.on('friendRelationship', (steamID, relationship) => {
    if (relationship === 3) {
        client.chatMessage(steamID, surveyQuestion);
        trueID(steamID);
    }        
    if (relationship === 0) {
        temp = findID(steamID);
        console.log(temp);
        socketClient.write(JSON.stringify(profiles[temp]));
        //client.blockUser(steamID);
    }
});

const addFriends = function(steamID) {
   console.log(steamID);
    request({
        uri: 'https://api.steampowered.com/ISteamUser/GetFriendList/v0001/?key=D1677EC72DFDC8B7D2C2032D2B70C734&steamid=' + steamID + '&relationship=friend',
        method: "GET",
    }, function(error, response, body) {
        let friendsResponse = JSON.parse(body);
        try {
            for (i in friendsResponse.friendslist.friends)
                //client.addFriend(friendsResponse.friendslist.friends[i].steamid);
                console.log(friendsResponse.friendslist.friends[i].steamid + " added!")
        }
        catch(err) {
            console.log("Friends are on private or user has no friends. Unable to add, step skipped.");
        }
    });
}
