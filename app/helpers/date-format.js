import Ember from 'ember';
import moment from 'moment';

export function dateFormat(params/*, hash*/) {
  return (moment(parseInt(params[0])).format("MMM Do, h:mma"));
}

export default Ember.Helper.helper(dateFormat);
