Meteor.methods({
    notify: function(notification) {
        'use strict';


        if (!notification.message) {
            throw new Meteor.Error(422, 'Need a message');
        }

        if (!notification.type) {
            throw new Meteor.Error(422, 'Need a type');
        }

        return Notifications.insert(_.extend(_.pick(notification, 'type', 'message'), {
            status: 'created',
            createdAt: Date.now()
        }));
    }
});
