import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';
import { check } from 'meteor/check';

export const Dietary = new Mongo.Collection('dietary');

Dietary.allow({
    update: function (userId, doc, fieldNames, modifier) {
        return false;
    }
})

if (Meteor.isServer) {
  // This code only runs on the server
  Meteor.publish('dietary', function DietaryPublication() {
    return Dietary.find({deleted: {$ne:true}});
  });
}
