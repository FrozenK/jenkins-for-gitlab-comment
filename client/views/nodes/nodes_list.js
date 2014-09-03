"use strict";

Template.nodesList.helpers({
    nodes: function() {
        return Nodes.find({isActive: true});
    },
    notifications: function() {
        return Notifications.find({createdAt: {$gte: Date.now() - 60000}}, {sort: {_id: -1}, limit: 5});
    }
});