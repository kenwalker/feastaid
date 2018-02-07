import { Template } from 'meteor/templating';

import './main.html';

Template.main.helpers({
  	userLoggedIn() {
  		return Meteor.userId() != null;
  	}
});