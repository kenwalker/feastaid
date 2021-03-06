import { Template } from 'meteor/templating';
import { ReactiveVar } from 'meteor/reactive-var';
import { HTTP } from 'meteor/http'
import '../imports/ui/body.js';
import '../imports/ui/allergens.js';

hookContentMenuToggle = null;
toggleAll = null;
toggleClass = null;
eventHandle = null;
scrollToTop = null;
getParameterByName = null;

Meteor.startup(function () {

  // var mediaQueryList = window.matchMedia('print');
  // mediaQueryList.addListener(function(mql) {
  //   if (mql.matches) {
  //       console.log('onbeforeprint equivalent');
  //   } else {
  //       console.log('onafterprint equivalent');
  //   }
  // });

  getParameterByName = function (name) {
    var url = window.location.href;
    name = name.replace(/[\[\]]/g, "\\$&");
    var regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)"),
      results = regex.exec(url);
    if (!results) return null;
    if (!results[2]) return '';
    return decodeURIComponent(results[2].replace(/\+/g, " "));
  }

  Accounts.ui.config({
    requestPermissions: {
      facebook: ['user_events']
    },
    passwordSignupFields: 'USERNAME_ONLY',
  });

  Session.setDefault("templateName", "main");
  Meteor.subscribe('allergens');
  Meteor.subscribe('dietary');
  Events = new Mongo.Collection('events');
  FeastAid = new Mongo.Collection('feastaid');

  Accounts.onLogin(function () {
    // console.log("Calling Facebook client");
    // eventHandle = Meteor.subscribe('events');
  });

  Accounts.onLogout(function () {
    // console.log("Unsubscribing");
    // eventHandle.stop();
  })

  scrollToTop = function () {
    $("html, body").animate({ scrollTop: 0 }, "slow");
  };

  hookContentMenuToggle = function () {
    content = document.getElementById('main');
    content.onclick = function (e) {
      if (menu.className.indexOf('active') !== -1) {
        toggleAll(e);
        $("html, body").animate({ scrollTop: 0 }, "slow");
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

