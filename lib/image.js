
getImageName = function (result) {
    'use strict';

    var status = 'running';

    if (result === 'SUCCESS') {
        status = 'good';
    } else if (result === 'FAILURE') {
        status = 'bad';
    } else if (result === 'ABORTED') {
        status = 'aborted';
    } else if (result === 'UNSTABLE') {
        status = 'yellow';
    } else if (result === 'BAD') {
        status = 'bad-request';
    }

    return status + '.png';
};

getImageUrl = function (result) {
    'use strict';

    return '/images/' + getImageName(result);
};

getImageColor = function (result) {
    'use strict';

    var color = '';

    if (result === 'SUCCESS') {
        color = 'blue';
    } else if (result === 'FAILURE') {
        color = 'red';
    } else if (result === 'ABORTED') {
        color = '';
    } else if (result === 'UNSTABLE') {
        color = 'orange';
    }

    return color;
};


getImagePath = function (result) {
    'use strict';

    return "/images/" + getImageName(result);
};

getImage = function(result) {
    'use strict';

    var fs = Meteor.npmRequire('fs');
    var wrappedFs = Async.wrap(fs, ['readFile']);

    return wrappedFs.readFile(getImagePath(result));
};
