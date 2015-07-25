import Secret from './secret';
import {List, Record, Seq} from 'immutable';
import {actions} from './actions';

function revive(state) {
  return new (Record({
    // TODO: Rename to newSecret or something.
    add: new Secret,
    list: List()
  }));
}

export default function(state, action, payload) {
  if (!action) state = revive(state);

  switch (action) {

    case actions.add:
      return state.set('add', new Secret);

    case actions.onFirebaseSecrets:
      return state.set('list', Seq(payload)
        .sortBy(item => item.createdAt)
        .reverse()
        .toList()
      );

    case actions.setAddField:
      return state.setIn(['add', payload.name], payload.value);

  }

  return state;
}
