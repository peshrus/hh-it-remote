import { Meteor } from 'meteor/meteor';
import { assert } from 'meteor/practicalmeteor:chai';
import { SPECIALIZATIONS_STR } from './const';
import { getSpecializations, Specializations } from './specializations.js';

if (Meteor.isServer) {
  describe('specializations', () => {
    describe('api', () => {
      it('getSpecializations', () => getSpecializations().then(() => {
        const comparator = (spec1, spec2) => {
          const spec1Id = Number(spec1._id);
          const spec2Id = Number(spec2._id);

          if (spec1Id > spec2Id) {
            return 1;
          } else if (spec1Id < spec2Id) {
            return -1;
          }
          return 0;
        };

        assert.deepEqual(
            Specializations.find({}, { fields: { _id: 1 } }).fetch().sort(comparator),
            SPECIALIZATIONS_STR.split('&').map(specKeyValue => ({ _id: specKeyValue.split('=')[1] })).sort(comparator),
          );
      }));
    });
  });
}
