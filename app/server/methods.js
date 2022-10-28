import { Meteor } from 'meteor/meteor';

Meteor.methods({
  getMapsSecret: function () {
    const mapsKey = Meteor.settings.googleMapsKey;
    return mapsKey;
  },
});
