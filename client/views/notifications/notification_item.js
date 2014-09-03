Template.notificationItem.helpers({
    dateAgo: function(createdAt) {
        'use strict';

        return moment(createdAt).fromNow();
    },
    getContent: function(type, name, status) {
        'use strict';

        var content = '';
        if (type === 'node') {
            if (status === 'created') {
                content = 'Node ' + name + ' added!';
            } else {
                content = 'Node ' + name + ' deleted!';
            }
        }

        if (type === 'job') {
            if (status === 'created') {
                content = 'Job ' + name + ' added!';
            } else {
                content = 'The job ' + name + ' is ' + status;
            }
        }

        return content;
    }
});
