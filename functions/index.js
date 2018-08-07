/*
Chatfuel Info to Firebase Database
Purpose: Save user SkinCare Profile information gathered from Chatfuel Chatbot in 
Firebase Database
Author: Carolyne Pelletier carolyne.pelletier12@gmail.com
Docs: https://firebase.google.com/docs/functions/write-firebase-functions
*/

// The Cloud Functions for Firebase SDK to create Cloud Functions and setup triggers.
const functions = require('firebase-functions');

// The Firebase Admin SDK to access the Firebase Realtime Database.
const admin = require('firebase-admin');
admin.initializeApp(functions.config().firebase);

// Save user SkinCare Profile information to this endpoint in Chatfuel
//https://us-central1-beautybot-guru.cloudfunctions.net/skinCareBotSaveAnswer

exports.skinCareBotSaveAnswer = functions.https.onRequest((request, response) => {

  console.log("skinCareBotSaveAnswer : " + JSON.stringify(request.body));

  const userId = request.body["chatfuel user id"];
  const firstName = request.body["first name"];
  const lastName = request.body["last name"];
  const profilePicURL = request.body["profile pic url"];
  const skinTone = request.body["SkinTone"]?request.body["SkinTone"]:"na";
  const skinComplexity = request.body["SkinComplexity"]?request.body["SkinComplexity"]:"na";
  const skinUndertone = request.body["SkinUndertone"]?request.body["SkinUndertone"]:"na";

  if (!verifyParam(userId)) {
   badRequest(response, "Unable to find the user id.");
   return;
  }

  if (!verifyParam(skinTone)) {
   badRequest(response, "Unable to find SkinTone.");
   return;
  }

  if (!verifyParam(skinComplexity)) {
   badRequest(response, "Unable to find SkinComplexity.");
   return;
  }

  if (!verifyParam(skinUndertone)) {
   badRequest(response, "Unable to find SkinUndertone.");
   return;
  }

  var userProfile = {
   "firstName" : firstName,
   "lastName" : lastName,
   "profilePicURL" : profilePicURL,
   "skinTone" : skinTone,
   "skinComplexity" : skinComplexity,
   "skinUndertone" : skinUndertone
  }

  const userProfileRef = admin.database().ref('/beautybot-guru/profile').child(userId);

  userProfileRef.update(userProfile)
  .then(() => {
   response.end();
   return null;
  }).catch(error => {
   console.error(error);
   response.error(500);
  });
  });

/*
Helper Functions
*/

function verifyParam(value) {
  if ( value === undefined || value === null ) {
  	return false;
  }
  return true;
}

function badRequest(response, message) {
  console.log(message);
  response.status(400).json({ "messages": [ { "text": message } ] });
}
