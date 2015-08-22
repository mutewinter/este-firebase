import getRandomString from '../lib/getrandomstring';

export const actions = create();
export const feature = 'secrets';

const formFieldMaxLength = 100;

export function create(dispatch, validate, firebase) {

  return {

    add(secret, viewer) {
      const json = secret.merge({
        createdAt: firebase.TIMESTAMP,
        id: getRandomString()
      }).toJS();
      firebase.set(['secrets', viewer.id, json.id], json);
      // Optimistic add, Firebase always dispatches local changes anyway.
      dispatch(actions.add);
    },

    delete(secret, viewer) {
      firebase.remove(['secrets', viewer.id, secret.id]);
    },

    onFirebaseSecrets(snapshot) {
      dispatch(actions.onFirebaseSecrets, snapshot.val());
    },

    setAddField({target: {name, value}}) {
      value = value.slice(0, formFieldMaxLength);
      dispatch(actions.setAddField, {name, value});
    }

  };

}
