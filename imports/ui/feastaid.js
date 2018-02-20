import { Template } from 'meteor/templating';
import { RESTRICTIONS, DIET } from '../api/dietary.js';
import { ALLERGEN_LIST } from '../api/allergens.js';

import './feastaid.html';

var allergenGroups = ["Common Allergens", "Fruits", "Vegetables", "Grains & Legumes", "Proteins", "Herbs, Spices & Other"];
var noAllergens = true;
var currentAllergenGroup = "";
var currentAllergenCount = 0;
 
console.log("asdf");

var allergenIndex = function() {
    switch (true) {
        case (currentAllergenCount <= 7):
            return 0;
        case (currentAllergenCount <= 19):
            return 1;
        case (currentAllergenCount <= 30):
            return 2;
        case (currentAllergenCount <= 35):
            return 3;
        case (currentAllergenCount <= 39):
            return 4;
        default:
            return 5;
    }
};

Tracker.autorun(function() {
    if (Session.get("templateName") === "feastaid" && Session.get('evendId')) {
        var searchHandle = Meteor.subscribe('feastaid', Session.get('evendId'));
        Session.set('buildingFeastAid', ! searchHandle.ready());
    }
});

Template.feastaid.helpers({
    feastaids: function() {
        var results = FeastAid.find({});
        return results;
    },
    buildingFeastAid: function() {
      return Session.get('buildingFeastAid');
    }
});

Template.overview.helpers({
    eventDate() {
        return moment(this.eventDate).format("dd, MMM Do, YYYY");
    },
    allAllergens() {
        return Object.keys(ALLERGEN_LIST);
    },
    anyDiets() {
        return DIET.find(function (dietType) {
            console.log(this.diet);
            return this.diet[dietType].count > 0;
        }.bind(this));
    },
    hasDietValueFor(name) {
        return this.diet[name].count > 0;
    },
    getDietValueFor(name) {
        return this.diet[name].count;
    },
    allRestrictions() {
        return Object.keys(ALLERGEN_LIST);
    },
    anyRestrictions() {
        return RESTRICTIONS.find(function (restriction) {
            console.log(this.restrictions);
            return this.restrictions[restriction].notok > 0
        }.bind(this));
    },
    hasRestrictionValueFor(name) {
        return this.restrictions[name].notok > 0;
    },
    getRestrictionValueFor(name) {
        return this.restrictions[name].notok;
    },
    nameForAllergen(name) {
        return ALLERGEN_LIST[name];
    },
    hasMildValueFor(name) {
        return this.allergens[name].mild > 0;
    },
    mildValueFor(name) {
        return this.allergens[name].mild;
    },
    hasSevereValueFor(name) {
        return this.allergens[name].severe > 0;
    },
    severeValueFor(name) {
        return this.allergens[name].severe;
    },
    displayAllergen(name) {
        return this.allergens[name].mild > 0 || this.allergens[name].severe > 0;
    },
    setNoAllergens(value) {
        noAllergens = value;
    },
    getNoAllergens() {
        return noAllergens;
    },
    resetAllergentCount() {
        currentAllergenCount = 0;
    },
    getCurrentAllergenGroup() {
        return currentAllergenGroup;
    },
    incrementAllergenCount() {
        currentAllergenCount++;
    },
    updateAllergenGroup() {
        currentAllergenGroup = allergenGroups[allergenIndex()];
    },
    newAllergenGroup() {
        return allergenGroups[allergenIndex()] !== currentAllergenGroup;
    }

})