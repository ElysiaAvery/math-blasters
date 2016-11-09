import DS from 'ember-data';

export default DS.Model.extend({
  score: DS.attr(),
  name: DS.attr(),
  timestamp: DS.attr()
});
