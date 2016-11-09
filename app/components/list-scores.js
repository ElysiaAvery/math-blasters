import Ember from 'ember';

export default Ember.Component.extend({
  sortBy: ['score:desc'],
  sortedScores: Ember.computed.sort('scores', 'sortBy'),
});
