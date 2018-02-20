import { Template } from 'meteor/templating';
import { Allergens, ALLERGEN_LIST } from '../api/allergens.js';

import './allergens.html';

Template.allergens.helpers({
    allergens() {
        var cursor = Allergens.find();
        if (cursor.count() === 0) {
            // User is not logged in or some other error
            location.reload();
        }
        return cursor;
    },
    allergen() {
        var myAllergens = Allergens.findOne();
        if (!myAllergens) {
            // User is not logged in or some other error
            location.reload();
        }
        return myAllergens;
    }
});

function stateObjectFor(radioCategory) {
    console.log(ALLERGEN_LIST)
    var currentlySelected = $("input[name='state-" + radioCategory + "']:checked");
    if (currentlySelected.length === 0) {
        return 0;
    }
    var selection = currentlySelected.first().attr('id').split("-")[0];
    switch (selection) {
        case 'ok':
            return 0;
        case 'mild':
            return 1;
        case 'severe':
            return 2;
    }
};

function getJSONforAllergens() {
    var allergenRecord = Allergens.findOne();
    if (!allergenRecord) {
        // User is not logged in or some other error
        location.reload();
    }
    var newState = {};
    Object.keys(ALLERGEN_LIST).forEach(function (allergen) {
        var allergenState = stateObjectFor(allergen);
        newState[allergen] = allergenState;
    });
    Allergens.update(allergenRecord._id, { $set: newState });
}

function updateAllergensFromJSON() {
    console.log();
    var allergenRecord = Allergens.findOne();
    if (!allergenRecord) {
        // User is not logged in or some other error
        location.reload();
    }
    Object.keys(ALLERGEN_LIST).forEach(function (allergen) {
        var currentState = allergenRecord[allergen];
        switch (currentState) {
            case 0:
                $("#ok-" + allergen).attr('checked', 'checked');
                break;
            case 1:
                $("#mild-" + allergen).attr('checked', 'checked');
                break;
            case 2:
                $("#severe-" + allergen).attr('checked', 'checked');
                break;
        }
    });
}

Template.allergens.events({
    'change': function (e) {
        var lazyGetJSON = _.debounce(getJSONforAllergens, 500);
        lazyGetJSON();
    }.bind(this)
});

Template.allergens.onRendered(function () {
    updateAllergensFromJSON();
});
