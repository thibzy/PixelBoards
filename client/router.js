var subscriptions = new SubsManager();

Router.configure({
    layoutTemplate: 'layout',
    loadingTemplate: 'loading',
    notFoundTemplate: 'notFound',
    trackPageView: true,
    fastRender: true,
    progressSpinner: false
});

Router.route('/', {
    name: 'boardsList',
    subscriptions: function() {
        return subscriptions.subscribe('boards');
    }
});
Router.route('/board/create', function() {;
    if (!Meteor.userId()) {
        alert('Please login first.');
    } else {
        var boardId = BoardsCollections.insert({title: 'My pixel art'}); // TODO Unsafe
        Router.go('board', {_id: boardId});
    }
});

Router.route('/board/:_id', {
    name: 'board',
    subscriptions: function() {
        return subscriptions.subscribe('boardOwner', this.params._id);
    },
    waitOn: function() {
        return subscriptions.subscribe('board', this.params._id);
    },
    data: function() {
        return BoardsCollections.findOne(this.params._id);
    }
});

Router.route('/changelog', function() {
    Meteor.call('getChangelog', function(err, data) {
        if (err)
            console.log(err);

        if (data)
            Session.set('changelog', data.content);
    });

    this.render('changelog');
});

Router.onBeforeAction(function() {
    Session.set('message', null); // Clear flash message on page change
    this.next();
});
Router.onBeforeAction('dataNotFound', {only: 'board'});