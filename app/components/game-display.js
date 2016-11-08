import Ember from 'ember';

export default Ember.Component.extend({
  actions: {
    testAction() {

      var comparison = this.get('comparison');
      console.log(comparison);
      if(comparison) {
        console.log('hey Elysia');
      }
    }
  }
});
