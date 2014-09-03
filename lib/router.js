// var logger = Meteor.require('winston');

Router.configure({
    layoutTemplate: 'layout',
    loadingTemplate: 'loading',
    waitOn: function() {
        "use strict";

        return [
            Meteor.subscribe('nodes', {sort: {name: 1}}),
            Meteor.subscribe('notifications', {sort: {_id: -1}}),
            Meteor.subscribe('jobs', {sort: {_id: -1}})
        ];
    }
});

Router.map(function() {
    "use strict";

    this.route('nodesList', { path: '/'});

    this.route('jobPage', {
        where: 'server',
        path: '/jobs/:_id',
        action: function() {
            var job = Jobs.findOne(this.params._id);
            var result = 'BAD';

            if (job !== undefined) {
                result = job.result;
            }

            this.response.writeHead(200, {'Content-type': 'image/jpeg'});
            this.response.end(getImage(result));
        }
    });
});
