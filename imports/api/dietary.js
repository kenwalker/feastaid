import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';
import { check } from 'meteor/check';

export const Dietary = new Mongo.Collection('dietary');
export const RESTRICTIONS = [
  "dairy", "eggs", "fish", "honey", "poultry", "redmeat", "shellfish", "slaughter"
];
export const DIET = [
  "halal", "keto", "kosher", "paleo", "vegan"
];

Dietary.allow({
  update: function (userId, doc, fieldNames, modifier) {
    return userId === Meteor.userId() && doc.userId === Meteor.userId();
  }
})

if (Meteor.isServer) {
  // This code only runs on the server
  Meteor.publish('dietary', function() {
    var cursor = Dietary.find({userId: Meteor.userId()});
    if (!Meteor.userId()) {
      return cursor;
    }
    if (cursor.count() === 0) {
      Dietary.insert({ userId: Meteor.userId(), facebookId: Meteor.user().services.facebook.id });
      cursor = Dietary.find({userId: Meteor.userId()});
    }
    return cursor;
  });
}
