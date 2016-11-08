import Ember from 'ember';

export default Ember.Component.extend({
  actions: {
    nextQuestion() {
      this.sendAction('nextQuestion', this.get('question'));
    }
  }
});
