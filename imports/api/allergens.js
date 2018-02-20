import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';
import { check } from 'meteor/check';

export const Allergens = new Mongo.Collection('allergens');

export const ALLERGEN_LIST = {
  'eggs' : 'Eggs', 'latex': 'Latex', 'milk':'Milk', 'peanuts':'Peanuts', 'soy':'Soy', 
  'treenuts': 'Tree Nuts', 'nonwheatgluten':'Non Wheat Gluten', 'wheat':'Wheat',
  'apple':'Apple', 'avocado':'Avocado', 'citrus':'Citrus', 'kiwi':'Kiwi', 'melons':'Melons', 
  'pear':'Pear', 'peppers':'Peppers', 'pineapple':'Pineapple', 'stonefruits':'Stone Fruits', 
  'strawberry':'Strawberry', 'tomato':'Tomato', 'zucchini':'Zucchini',
  'beet':'Beet', 'cabbage':'Cabbage', 'carrot':'Carrot', 'celery':'Celery', 'cucumber':'Cucumber',
  'eggplant':'Eggplant', 'lettuce':'Lettuce', 'mushroom':'Mushroom', 'onion':'Onion', 'potato':'Potato',
  'sweetpotato':'Sweet Potato','chickpeas':'Chickpeas', 'corn':'Corn', 'lentil':'Lentil', 'oat':'Oat', 'rice':'Rice',
  'chicken':'Chicken', 'fish':'Fish', 'redmeat':'Red Meat', 'shellfish':'Shellfish',
  'cinnamon':'Cinnamon', 'cocoa':'Cocoa', 'garlic':'Garlic', 'mustard':'Mustard',
  'peppercorn':'Peppercorn', 'sesame':'Sesame', 'sunflower':'Sunflower'
};

Allergens.allow({
    update: function (userId, doc, fieldNames, modifier) {
      return userId === Meteor.userId() && doc.userId === Meteor.userId();
    }
})

if (Meteor.isServer) {
  // This code only runs on the server
  Meteor.publish('allergens', function() {
    var cursor = Allergens.find({userId: Meteor.userId()});
    if (!Meteor.userId()) {
      return cursor;
    }
    if (cursor.count() === 0) {
      Allergens.insert({ userId: Meteor.userId(), facebookId: Meteor.user().services.facebook.id });
      cursor = Allergens.find({userId: Meteor.userId()});
    }
    return cursor;
  });
}
