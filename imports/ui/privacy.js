import { Template } from 'meteor/templating';
import { Meteor } from 'meteor/meteor';

import './privacy.html';

var modal, span;

Template.privacy.helpers({
    dataDeleted: function() {
        if (Meteor.user() !== null) {
            return Session.get('detaDeleted') === true;
        } else {
            return true;
        }
    }
});

Template.privacy.events({
    'click .delete-button': function () {
        modal = document.getElementById('myModal');
        span = document.getElementsByClassName("close")[0];
        modal.style.display = "block";
    },
    'click .close': function() {
        modal.style.display = "none";
    },
    'click .cancel-button': function() {
        modal.style.display = "none";
    },
    'click .ok-button': function() {
        document.getElementsByClassName("ok-button")[0].disabled = true;
        document.getElementsByClassName("cancel-button")[0].disabled = true;
        document.getElementById('modal-message');
        document.getElementById('modal-message').innerHTML = "Please wait, removing data...";
        Meteor.call('deleteData', (err, res) => {
            if (err) {
                document.getElementById('modal-message').innerHTML = "An error occurred";
                document.getElementsByClassName("cancel-button")[0].disabled = false;
            } else {
                modal.style.display = "none";
                Session.set('detaDeleted', true);
                Meteor.logout();
                location.reload();
            }
        });
    }    
});