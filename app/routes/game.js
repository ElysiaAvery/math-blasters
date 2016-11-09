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
      var that = this;
      this.store.findRecord('question', id%5).then(function(response) {
        response.set('display', true);
        response.save();
        that.transitionTo('game');

        startTimer(20);
      });
    },
    endGame() {
      var person = prompt("Please enter your name");
      var params = {
          score: score,
          name: person,
          timestamp: Date.now()
          // timestamp: moment().format("MMM Do, YYYY")
        };
      var newScore = this.store.createRecord('score', params);
      newScore.save();
      console.log("ENDGAME " + score);
      this.transitionTo('highscore');
    }
  }
});
