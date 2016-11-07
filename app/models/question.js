import DS from 'ember-data';


export default DS.Model.extend({
  compQuestion: DS.attr(),
  answer: DS.attr(),
  display: DS.attr()
});
