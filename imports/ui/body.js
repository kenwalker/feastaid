import { Template } from 'meteor/templating';
import { Allergens } from '../api/allergens.js';
import { Dietary } from '../api/dietary.js';

import './main.js';
import './about.js';
import './eventlist.js';
import './allergens.js';
import './dietary.js';
import './feastaid.js';
import './privacy.js';
import './body.html';

Template.body.onRendered(function bodyOnRendered() {
  var layout   = document.getElementById('layout'),
      menu     = document.getElementById('menu'),
      menuLink = document.getElementById('menuLink'),
      allMenus = document.getElementById('allMenus');

  menuLink.onclick = function (e) {
      toggleAll(e);
  };

  allMenus.onclick = function (e) {
      toggleAll(e);
  };

  hookContentMenuToggle();

  var requestPage = getParameterByName("page");
  if (requestPage) {
    Session.set("templateName", requestPage);
  }
});

Template.body.onCreated(function bodyOnCreated() {
});

Template.body.helpers({
  Allergens() {
    return Allergens.find({});
  },
  Dietary() {
    return Dietary.find({});
  },
  template_name: function(){
    var currentTemplate = Session.get("templateName");
    return currentTemplate;
  }
});

Template.body.events({
  "click .home": function(e) {
    if (Session.get("templateName") === "main") {
      return;
    }
    Session.set("templateName", "main");
    setTimeout(hookContentMenuToggle, 100);
  },
  "click .help": function(e) {
    if (Session.get("templateName") === "help") {
      return;
    }
    Session.set("templateName", "help");
    setTimeout(hookContentMenuToggle, 100);
    setTimeout(scrollToTop, 200);
  },
  "click .eventlist": function(e) {
    if (Session.get("templateName") === "eventlist") {
      return;
    }
    Session.set("templateName", "eventlist");
    setTimeout(hookContentMenuToggle, 100);
    setTimeout(scrollToTop, 200);
  },
  "click .allergens": function(e) {
    if (Session.get("templateName") === "allergens") {
      return;
    }
    Session.set("templateName", "allergens");
    setTimeout(hookContentMenuToggle, 100);
    setTimeout(scrollToTop, 200);
  },
  "click .main": function(e) {
    if (Session.get("templateName") === "main") {
      return;
    }
    Session.set("templateName", "main");
    setTimeout(hookContentMenuToggle, 100);
    setTimeout(scrollToTop, 200);
  },
  "click .dietary": function(e) {
    if (Session.get("templateName") === "dietary") {
      return;
    }
    Session.set("templateName", "dietary");
    setTimeout(hookContentMenuToggle, 100);
    setTimeout(scrollToTop, 200);
  },
  "click .privacy": function() {
    if (Session.get("templateName") === "privacy") {
      return;
    }
    Session.set("templateName", "privacy");
    setTimeout(hookContentMenuToggle, 100);
    setTimeout(scrollToTop, 200);
  },
  "click .about": function() {
    if (Session.get("templateName") === "about") {
      return;
    }
    Session.set("templateName", "about");
    setTimeout(hookContentMenuToggle, 100);
    setTimeout(scrollToTop, 200);
  }
});
