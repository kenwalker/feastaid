import { Meteor } from 'meteor/meteor';

import { Allergens, ALLERGEN_LIST } from '../imports/api/allergens.js';
import { Dietary, RESTRICTIONS, DIET } from '../imports/api/dietary.js';
import { read } from 'fs';

Meteor.startup(() => {
  // code to run on server at startup

  Meteor.publish('events', function () {
    var self = this;
    try {
      if (Meteor.user()) {
        var accessToken = Meteor.user().services.facebook.accessToken;
        var attendingURL = "https://graph.facebook.com/v2.11/me/events/attending?fields=id%2Cname%2Cstart_time%2Cevent_times&since=now&access_token=" + accessToken;
        var response = HTTP.get(attendingURL);
        _.each(response.data.data, function (item) {
          if (!item.event_times) {
            var adminsURL = "https://graph.facebook.com/v2.11/" + item.id + "/admins?access_token=" + accessToken;
            var response = HTTP.get(adminsURL);
            var amAdmin = response.data.data.find(function(anAdmin) {
              return anAdmin.id === Meteor.user().services.facebook.id;
            })
            if (amAdmin) {
              var doc = {
                id: item.id,
                name: item.name,
                start_time: new Date(item.start_time),
                status: 1
              };
              self.added('events', Random.id(), doc);
            }
          }
        });
      }
      self.ready();

    } catch (error) {
      console.log(error);
    }
  });

  Meteor.publish('feastaid', function (eventId) {
    var self = this;
    try {
      if (Meteor.user() && eventId) {
        var accessToken = Meteor.user().services.facebook.accessToken;
        var queryURL = "https://graph.facebook.com/v2.11/" + eventId + "/attending?access_token=" + accessToken;
        var attendees = [];
        while (true) {
          var response = HTTP.get(queryURL);
          attendees = attendees.concat(response.data.data.map(function (item) { return item.id }));
          if (response.data.paging && response.data.paging.next) {
            queryURL = response.data.paging.next;
          } else {
            break;
          }
        };

        // Get current event information
        var eventInfo = HTTP.get("https://graph.facebook.com/v2.11/" + eventId + "?access_token=" + accessToken).data;

        var query = { facebookId: { $in: attendees } };
        var allergenRecords = Allergens.find(query);

        // Assume number in allergens and dietary are the same count for registered
        var doc = {
          'eventName': eventInfo.name,
          'eventDate': eventInfo.start_time,
          'attendees': attendees.length, 
          'registered': allergenRecords.count(), 
          'allergens': {}, 
          'restrictions': {}, 
          'diet': {} 
        };

        Object.keys(ALLERGEN_LIST).forEach(function (allergen) {
          doc['allergens'][allergen] = Object.assign({}, { ok: 0, mild: 0, severe: 0 });
        })
        RESTRICTIONS.forEach(function (restriction) {
          doc['restrictions'][restriction] = Object.assign({}, { ok: 0, notok: 0 });
        })
        DIET.forEach(function (diet) {
          doc['diet'][diet] = Object.assign({}, { count: 0 });
        })

        allergenRecords.forEach(function (record) {
          Object.keys(ALLERGEN_LIST).forEach(function (allergen) {
            switch (record[allergen]) {
              case 0:
                doc['allergens'][allergen].ok++;
                break;
              case 1:
                doc['allergens'][allergen].mild++;
                break;
              case 2:
                doc['allergens'][allergen].severe++;
            }
          });
        });

        var dietaryRecords = Dietary.find(query);
        dietaryRecords.forEach(function (record) {
          RESTRICTIONS.forEach(function (restriction) {
            switch (record[restriction]) {
              case 0:
                doc['restrictions'][restriction].ok++;
                break;
              case 1:
                doc['restrictions'][restriction].notok++;
                break;
            }
          });
          DIET.forEach(function (diet) {
            if (record[diet] === 1) {
              doc['diet'][diet].count++;
            }
          })
        });

        self.added('feastaid', Random.id(), doc);
      }
      self.ready();

    } catch (error) {
      console.log(error);
    }
  });
});
