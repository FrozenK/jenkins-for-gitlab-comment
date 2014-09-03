"use strict";

Meteor.publish('nodes', function() {
    return Nodes.find();
});

Meteor.publish('jobs', function() {
    return Jobs.find();
});

Meteor.publish('notifications', function() {
    return Notifications.find();
});

Notifications.allow({
  insert: function (notification) {
    return true;
  }
});
