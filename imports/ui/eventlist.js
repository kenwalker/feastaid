import { Template } from 'meteor/templating';

import './eventlist.html';


Tracker.autorun(function() {
    if (Session.get("templateName") === "eventlist") {
        var searchHandle = Meteor.subscribe('events');
        Session.set('searching', ! searchHandle.ready());
    }
});

Template.eventlist.helpers({  
    events: function() {
      return Events.find({},{sort: {start_time: 1}});
    },
    searching: function() {
      return Session.get('searching');
    }
});

Template.event.helpers({
    tagDate() {
        // return this.start_time;
        return moment(this.start_time).format("dd, MMM Do, YYYY");
    },
    attending() {
        return this.status === 1;
    }
})