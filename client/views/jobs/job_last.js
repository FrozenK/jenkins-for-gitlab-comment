"use strict";

function createComment(id, name, url) {
    return "![Build](http://dashboard.mr-jenkins.info/jobs/" + id + ") [" + name  + "](" + url + ")";
}

Template.jobLast.helpers({
    gitlabComment: function(_id, fullDisplayName, url) {
        return createComment(_id, fullDisplayName, url);
    },
    imageUrl: function(result) {
        return getImageUrl(result);
    },
    color: function(result) {
        return getImageColor(result);
    }
});

Template.jobLast.rendered = function() {
   jQuery('.copy-comment').clipboard({
        path: '/jquery.clipboard.swf',

        copy: function(event) {
            var selection = jQuery(this).parent().find('.gitlab-comment').val();

            jQuery('.notification').html('').parent().removeClass('blue');
            jQuery(this).parent().parent().find('.notification').html('copied!').parent().addClass('blue');
            console.log('copied to clipboard :' + selection);

            return selection;
        }
    });
};
