import {Record} from 'immutable';

const SecretRecord = Record({
  createdAt: null,
  id: '',
  text: ''
});

export default class Secret extends SecretRecord {}
