import { Template } from 'meteor/templating';
import { Dietary, RESTRICTIONS, DIET } from '../api/dietary.js';

import './dietary.html';

Template.dietary.helpers({
    dietaries() {
        console.log("here");
        var cursor = Dietary.find();
        if (cursor.count() === 0) {
            // User is not logged in or some other error
            location.reload();
        }
        return cursor;
    },
    dietary() {
        var myDietary = Dietary.findOne();
        if (!myDietary) {
            // User is not logged in or some other error
            location.reload();
        }
        return myDietary;
    }
});

function stateObjectFor(radioCategory) {
    var currentlySelected = $("input[name='state-" + radioCategory + "']:checked");
    if (currentlySelected.length === 0) {
        return 0;
    }
    var selection = currentlySelected.first().attr('id').split("-")[0];
    switch (selection) {
        case 'ok':
            return 0;
        case 'no':
            return 1;
    }
};

function getJSONforDietary() {
    var dietaryRecord = Dietary.findOne();
    if (!dietaryRecord) {
        // User is not logged in or some other error
        location.reload();
    }
    var newState = {};
    RESTRICTIONS.forEach(function (restriction) {
        var dietaryState = stateObjectFor(restriction);
        newState[restriction] = dietaryState;
    });
    DIET.forEach(function (diet) {
        var isChecked = $("#" + diet).prop('checked');
        newState[diet] = isChecked ? 1 : 0;
    })
    Dietary.update(dietaryRecord._id, { $set: newState });
}

function updateDietaryFromJSON() {
    var dietaryRecord = Dietary.findOne();
    if (!dietaryRecord) {
        // User is not logged in or some other error
        location.reload();
    }
    RESTRICTIONS.forEach(function (restriction) {
        var currentState = dietaryRecord[restriction];
        switch (currentState) {
            case 0:
                $("#ok-" + restriction).attr('checked', 'checked');
                break;
            case 1:
                $("#no-" + restriction).attr('checked', 'checked');
                break;
        }
    });
    DIET.forEach(function (diet) {
        var currentState = dietaryRecord[diet];
        $('#' + diet).prop('checked', currentState === 1 ? true : false);
    });
}

Template.dietary.events({
    'change': function (e) {
        var lazyGetJSON = _.debounce(getJSONforDietary, 500);
        lazyGetJSON();
    }.bind(this)
});

Template.dietary.onRendered(function () {
    updateDietaryFromJSON();
});
