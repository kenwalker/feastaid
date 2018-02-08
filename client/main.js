import { Template } from 'meteor/templating';
import { ReactiveVar } from 'meteor/reactive-var';
import { HTTP } from 'meteor/http'
import '../imports/ui/body.js';
hookContentMenuToggle = null;
toggleAll = null;
toggleClass = null;
eventHandle = null;

Meteor.startup(function () {
  Accounts.ui.config({
    requestPermissions: {
      facebook: ['user_events']
    },
    passwordSignupFields: 'USERNAME_ONLY',
  });

  Session.setDefault("templateName", "main");
  Meteor.subscribe('allergens');
  Meteor.subscribe('dietary.js');
  Events = new Mongo.Collection('events');

  Accounts.onLogin(function () {
    // console.log("Calling Facebook client");
    // eventHandle = Meteor.subscribe('events');
  });

  Accounts.onLogout(function () {
    // console.log("Unsubscribing");
    // eventHandle.stop();
  })

  hookContentMenuToggle = function () {
    content = document.getElementById('main');
    content.onclick = function (e) {
      if (menu.className.indexOf('active') !== -1) {
        toggleAll(e);
      }
    };
  };
  toggleAll = function (e) {
    var active = 'active';

    e.preventDefault();
    toggleClass(layout, active);
    toggleClass(menu, active);
    toggleClass(menuLink, active);
  };
  toggleClass = function (element, className) {
    var classes = element.className.split(/\s+/),
      length = classes.length,
      i = 0;

    for (; i < length; i++) {
      if (classes[i] === className) {
        classes.splice(i, 1);
        break;
      }
    }
    // The className is not found
    if (length === classes.length) {
      classes.push(className);
    }

    element.className = classes.join(' ');
  };
});

