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
        startTimer(20);
        that.transitionTo('game');
      });
    },

    resetGame() {
      var person = prompt("Please enter your name");
      var params = {
          score: score,
          name: person,
          timestamp: Date.now()
        };
      if(person) {
        var newScore = this.store.createRecord('score', params);
        newScore.save();
      }
      score = 0;
      startTimer(20);
      window.location.reload(true);
    }

    // endGame() {
    //   var person = prompt("Please enter your name");
    //   var params = {
    //       score: score,
    //       name: person,
    //       timestamp: Date.now()
    //     };
    //   score = 0;
    //   var newScore = this.store.createRecord('score', params);
    //   newScore.save();
    //   this.transitionTo('highscore');
    //   window.location.reload(true);
    //
    // }
  }
});
