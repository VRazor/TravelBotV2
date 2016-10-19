"use strict";

var builder = require('botbuilder');

var https = require('https');
var querystring = require('querystring');
var prompts = require('./prompts.js');
var HashMap = require('hashmap');

var model = process.env.LUIS_MODEL;
var recognizer = new builder.LuisRecognizer(model)
var dialog = new builder.IntentDialog({ recognizers: [recognizer] });

module.exports = dialog
    
    .matches('book', [
        confirmQuery, searchProfiles
    ])
    .matches('G', [confirmBookingGO])
    .matches('X', [confirmBookingX])
    .matches('XL', [confirmBookingXL])
    .onDefault([sendInstructions]);

function confirmQuery(session, args, next) {
    session.dialogData.entities = args.entities;

    var locationTo = builder.EntityRecognizer.findEntity(args.entities, 'location::to');
    var cabEntity = builder.EntityRecognizer.findEntity(args.entities, 'cab');

    if (cabEntity && locationTo) {
        //show all ubers
        console.log("Book uber to location");
        next({ response: locationTo.entity });
    }

    else if(cabEntity) {
      builder.Prompts.text(session, 'Where do you want to go in UBER?');
        
    }

    else {
        builder.Prompts.choice(session, 'What you want me to book for you?', options);
        next();
    }

    
}

function confirmBookingGO(session, args, next) {
   console.log('Booking started for GO');
   var imgURL = 'https://2q72xc49mze8bkcog2f01nlh-wpengine.netdna-ssl.com/wp-content/uploads/2011/12/New-Logo-Vertical-Dark.jpg';
   var text = '';
    text += ' \n\n';
    text += 'Total Amount INR: 172.90' + ' \n';
    text += 'Driver: Johnson R' + ' \n';
    text += 'Vehicle: Tata Indica (KA W 7741)';
   var thumbnail = bookUBERCars(session,'Uber Go', 'Booking is Successful!', imgURL, text);
   var message = new builder.Message(session).attachments([thumbnail]);
         session.send(message);

}

function confirmBookingX(session, args, next) {
   console.log('Booking started for X');
   var imgURL = 'http://cdn.bgr.com/2014/11/uber-car-cheap.png';
   var text = '';
    text += ' \n\n';
    text += 'Total Amount INR: 254.90' + ' \n';
    text += 'Driver: Harison Reddy' + ' \n';
    text += 'Vehicle: Ford Fiesta (KA WX 0741)';
   var thumbnail = bookUBERCars(session,'Uber X', 'Booking is Successful!', imgURL, text);
   var message = new builder.Message(session).attachments([thumbnail]);
         session.send(message);
}

function confirmBookingXL(session, args, next) {
   console.log('Booking started for XL');
   var imgURL = 'http://blogs-images.forbes.com/alanohnsman/files/2016/09/Exterior3Small-1200x650.jpg?width=960';
   var text = '';
    text += ' \n\n';
    text += 'Total Amount INR: 356.14' + ' \n';
    text += 'Driver: Rafeal Nadal' + ' \n';
    text += 'Vehicle: Tata Safari (AP WP 7741)';
   var thumbnail = bookUBERCars(session,'Uber XL', 'Booking is Successful!', imgURL, text);
   var message = new builder.Message(session).attachments([thumbnail]);
         session.send(message);
}


function bookUBERCars(session, cabType, subtext, imageURL, text) {
    var thumbnail = new builder.ThumbnailCard(session);
    thumbnail.title(cabType);
    thumbnail.images([builder.CardImage.create(session, imageURL)]);

    thumbnail.subtitle(subtext);
    thumbnail.text(text);

    thumbnail.tap(new builder.CardAction.openUrl(session, 'www.uber.com'));
    return thumbnail;
}

var options = [
    'Book a Flight',
    'Book Train',
    'Book an UBER Cab'
    
]

function sendInstructions(session, results, next) {
    builder.Prompts.choice(session, 'What you want me to book for you?', options);
    next();
}

function searchProfiles(session, results, next) {
    var toLocation = results.response;

    if (!toLocation) {
        session.endDialog('Please select the travel mode...');
    } else {
        console.log("Book uber to location");
        var thumbnail1 = getCarsThumbnailGO(session, toLocation);
         var thumbnail2 = getCarsThumbnailX(session, toLocation);
         var thumbnail3 = getCarsThumbnailXL(session, toLocation);
         var thumbnails = [thumbnail1, thumbnail2, thumbnail3];
         
         var message = new builder.Message(session).attachments(thumbnails).attachmentLayout('carousel');
         session.send(message);

    }
}



// -- helper functions


function getCarsThumbnailGO(session, toLocation) {
    var thumbnail = new builder.ThumbnailCard(session);
    thumbnail.title('Uber GO');
    thumbnail.images([builder.CardImage.create(session,'https://2q72xc49mze8bkcog2f01nlh-wpengine.netdna-ssl.com/wp-content/uploads/2011/12/New-Logo-Vertical-Dark.jpg')]);

    thumbnail.subtitle('To: ' + toLocation);

    var text = '';
    text += ' \n\n';
    text += 'Est. Price: 172.90' + ' \n';
    text += 'Duration: 35 min' + ' \n';
    text += 'Distance: 15.4 km';
    thumbnail.text(text);

    thumbnail.tap(new builder.CardAction.postBack(session, 'G'));
    return thumbnail;
}

function getCarsThumbnailX(session, toLocation) {
    var thumbnail = new builder.ThumbnailCard(session);
    thumbnail.title('Uber X');
    thumbnail.images([builder.CardImage.create(session,'http://cdn.bgr.com/2014/11/uber-car-cheap.png')]);

    thumbnail.subtitle('To: ' + toLocation);

    var text = '';
    text += ' \n\n';
    text += 'Est. Price: 254.90' + ' \n';
    text += 'Duration: 30 min' + ' \n';
    text += 'Distance: 15.4 km';
    thumbnail.text(text);

    thumbnail.tap(new builder.CardAction.postBack(session, 'X'));
    return thumbnail;
}

function getCarsThumbnailXL(session, toLocation) {
    var thumbnail = new builder.ThumbnailCard(session);
    thumbnail.title('Uber XL');
    thumbnail.images([builder.CardImage.create(session,'http://blogs-images.forbes.com/alanohnsman/files/2016/09/Exterior3Small-1200x650.jpg?width=960')]);

    thumbnail.subtitle('To: ' + toLocation);

    var text = '';
    text += ' \n\n';
    text += 'Est. Price: 356.14' + ' \n';
    text += 'Duration: 25 min' + ' \n';
    text += 'Distance: 15.4 km';
    thumbnail.text(text);

    thumbnail.tap(new builder.CardAction.postBack(session, 'XL'));
    return thumbnail;
}



