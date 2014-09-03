"use strict";

var request = Meteor.npmRequire('request');
var logger = Meteor.npmRequire('winston');
var Future = Npm.require("fibers/future");
var jenkinsURL = 'http://WWW.MY-JENKINS.URL'; // to replace with your jenkins url

function requestWithFuture (url, withLog) {
    url = url + '/api/json';
    if (withLog === true) {
        logger.info('Request :' + url);
    }

    var options = {
        url: url,
        timeout: 2000,
    };

    var future = new Future();

    request(options, function (err, res, body) {
        future.return(res, body);
    });

    return future.wait();
}

function getNodes () {
    logger.info('getNodes launched!');

    var response = requestWithFuture(jenkinsURL, true);
    if (!response || response.statusCode !== 200) {
        logger.info('error!', {error: response});
        return;
    }

    var date = Date.now();
    var availablesNodes = Nodes.find({isActive: true}).fetch();
    var nodes = JSON.parse(response.body);

    nodes = nodes.jobs;

    var nodesNames = [];
    var i, max = nodes.length - 1, exists;
    for (i = max; i >= 0; i--) {
        var newNode = nodes[i];
        nodesNames.push(newNode.name);

        exists = Nodes.find({name: newNode.name}, {limit: 1}).fetch();
        if (!exists.length) {
            newNode.createdAt = date;
            newNode.isActive = true;
            newNode.lastJob = {};

            logger.info('Insert node', newNode);
            Nodes.insert(newNode);
            createNodeNotification(newNode, 'created');
        }
    }

    // Find the inactive nodes
    for (i = availablesNodes.length - 1; i >= 0; i--) {
        var node = availablesNodes[i];

        var found = _.indexOf(nodesNames, node.name);
        if (found < 0) {
            logger.info('Not Found : ', {name: node.name, found: found});
            Nodes.update({'_id': node._id}, { $set: { isActive: false }});
            createNodeNotification(node, 'inactivated');
        }
    }
}

function updateNode(node, job)
{
    logger.info('Update Node : ', {name: node.name});
    Nodes.update( {'_id': node._id}, { $set: {
        lastJob: {
            _id: job._id,
            fullDisplayName: job.fullDisplayName,
            result: job.result,
            number: job.number,
            url: job.url,
            node: node._id
        }
    }});
}

function getJobs() {
    logger.info('getJobs launched!');

    var nodes = Nodes.find({'isActive': true}).fetch();
    if (!nodes) {
        logger.info('No nodes :', nodes.length);
        return;
    }

    var i, max = nodes.length;
    for (i = 0; i < max; i += 1) {
        var node = nodes[i];
        var response = requestWithFuture(node.url, true);
        if (!response || response.statusCode !== 200) {
            continue;
        }

        var jobs = JSON.parse(response.body).builds;
        var j = 0, maxJobs = jobs.length, exists;
        for (j; j < maxJobs; j += 1) {
            var jobNode = jobs[j];
            response = requestWithFuture(jobNode.url, true);
            if (!response || response.statusCode !== 200) {
                continue;
            }

            var job = JSON.parse(response.body);

            var newJob = {
                node: node._id,
                url: job.url,
                description: job.description,
                duration: job.duration,
                executor: job.executor,
                fullDisplayName: job.fullDisplayName,
                number: job.number,
                result: job.result,
                timestamp: job.timestamp,
            };

            exists = Jobs.find({node: node._id, number: job.number}, {sort: {_id: -1}, limit: 1}).fetch();
            if (exists.length) {
                exists = exists[0];
                if (!exists.result && newJob.result) {
                    exists.result = newJob.result;

                    logger.info('Update job : ', {name: exists.fullDisplayName});
                    Jobs.update({'_id': exists._id}, { $set: { result: newJob.result }});
                    createJobNotification(exists, 'updated');

                    updateNode(node, exists);
                }
            } else {
                logger.info('Insert job : ', {name: newJob.fullDisplayName});
                newJob._id = Jobs.insert(newJob);
                createJobNotification(newJob, 'created');

                updateNode(node, newJob);
            }
        }
    }
}

Meteor.setInterval(getNodes, 3600000);
Meteor.setInterval(getJobs, 30000);