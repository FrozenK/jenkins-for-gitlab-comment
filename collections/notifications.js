Notifications = new Meteor.Collection('notifications');

createNodeNotification = function(node, status) {
    'use strict';

    Notifications.insert({
        type: 'node',
        name: node.name,
        status: status,
        createdAt: Date.now()
    });
};

createJobNotification = function(job, status) {
    'use strict';

    Notifications.insert({
        type: 'job',
        name: job.fullDisplayName,
        status: status,
        jobStatus: job.status,
        createdAt: Date.now()
    });
};

createClipboardNotification = function(message) {
    'use strict';

    Notifications.insert({
        type: 'clipboard',
        message: message,
        status: 'created',
        createdAt: Date.now()
    });
};
