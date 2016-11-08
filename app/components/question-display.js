import Ember from 'ember';

export default Ember.Component.extend({
  actions: {
    nextQuestion() {
      for (var i = 1; i < 10; i++) {
        $("#" + i).attr("opacity", 1);
        $("#" + i).attr("scale", "1 1 1");
      }
      this.sendAction('nextQuestion', this.get('question'));
    }
  }
});
