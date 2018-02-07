import { Meteor } from 'meteor/meteor';

Meteor.startup(() => {
  // code to run on server at startup
  Meteor.publish('events', function() {
    var self = this;
    try {
      console.log("server events");
      if (Meteor.user()) {
        var accessToken = Meteor.user().services.facebook.accessToken;
        console.log("calling from server " + Meteor.user().profile.name);
        var response =  HTTP.get("https://graph.facebook.com/v2.11/me/events/not_replied?fields=id%2Cname%2Cstart_time%2Cevent_times&since=now&access_token=" + accessToken);
        console.log("not_replied");
        _.each(response.data.data, function(item) {
          if (!item.event_times) {
            var doc = {
              id: item.id,
              name: item.name,
              start_time: new Date(item.start_time),
              status: 0
            };
            self.added('events', Random.id(), doc);
            console.log("Adding " + JSON.stringify(doc));
          }
        });
        console.log("attending");
        var response =  HTTP.get("https://graph.facebook.com/v2.11/me/events/attending?fields=id%2Cname%2Cstart_time%2Cevent_times&since=now&access_token=" + accessToken);
        _.each(response.data.data, function(item) {
          if (!item.event_times) {
            var doc = {
              id: item.id,
              name: item.name,
              start_time: new Date(item.start_time),
              status: 1
            };
            self.added('events', Random.id(), doc);
            console.log("Adding " + JSON.stringify(doc));
          }
        });
      }  
      self.ready();
  
    } catch(error) {
      console.log(error);
    }
  });  
});
