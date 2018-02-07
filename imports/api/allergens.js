import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';
import { check } from 'meteor/check';

export const Allergens = new Mongo.Collection('allergens');

Allergens.allow({
    update: function (userId, doc, fieldNames, modifier) {
        return false;
    }
})

if (Meteor.isServer) {
  // This code only runs on the server
  Meteor.publish('allergens', function allergensPublication() {
    return Allergens.find({deleted: {$ne:true}});
  });
}
