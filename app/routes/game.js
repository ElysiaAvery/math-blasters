import Ember from 'ember';

export default Ember.Route.extend({
  model() {
    return this.store.findAll('question');
  },
  actions: {
    nextQuestion(question) {
      question.set('display', false);
      var id = question.get('id');
      question.save();
      id++;
      this.store.findRecord('question', id%5).then(function(response) {
        response.set('display', true);
        response.save();
        that.transitionTo('game');

        startTimer(20);
      });
    }
  }
});
