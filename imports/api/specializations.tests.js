/* eslint-env mocha */
import {Meteor} from 'meteor/meteor';
import {getSpecializations, Specializations} from './specializations.js';
import {specializationsStr} from './const';
import {assert} from 'meteor/practicalmeteor:chai';

if (Meteor.isServer) {
    describe('specializations', () => {
        describe('api', () => {
            it('getSpecializations', () => {
                return getSpecializations().then(() => {
                    let comparator = (spec1, spec2) => {
                        let spec1Id = Number(spec1._id);
                        let spec2Id = Number(spec2._id);

                        if (spec1Id > spec2Id) {
                            return 1;
                        } else if (spec1Id < spec2Id) {
                            return -1;
                        } else {
                            return 0;
                        }
                    };

                    assert.deepEqual(
                        Specializations.find({}, {fields: {_id: 1}}).fetch().sort(comparator), // values in MongoDB
                        specializationsStr.split('&').map(specKeyValue => { // requested values
                            return {_id: specKeyValue.split('=')[1]}
                        }).sort(comparator)
                    );
                });
            });
        });
    });
}