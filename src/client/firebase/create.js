import Firebase from 'firebase';
import Promise from 'bluebird';
import {ValidationError} from '../lib/validation';

// Promisify Firebase onComplete callback.
const promisify = callback => new Promise((resolve, reject) => {
  callback((error, data) => {
    if (error) {
      reject(firebaseError(error));
      return;
    }
    resolve(data);
  });
});

export default function create(firebaseUrl) {
  const firebase = new Firebase(firebaseUrl);

  return {

    TIMESTAMP: Firebase.ServerValue.TIMESTAMP,

    root: firebase,

    // const options = {
    //   scope: {
    //     facebook: 'email,user_friends',
    //     google: 'email',
    //     twitter: '' // email must be requested ad hoc
    //   }[provider]
    // }
    authWithOAuth(provider, options) {
      return promisify(onComplete => {
        // https://www.firebase.com/docs/web/guide/user-auth.html#section-popups
        firebase.authWithOAuthPopup(provider, (error, authData) => {
          if (error && error.code === 'TRANSPORT_UNAVAILABLE') {
            firebase.authWithOAuthRedirect(provider, onComplete, options);
            return;
          }
          onComplete(error, authData);
        }, options);
      });
    },

    authWithPassword(params) {
      return promisify(onComplete => {
        firebase.authWithPassword(params, onComplete);
      });
    },

    unauth() {
      firebase.unauth();
      // Always reload app on logout for security reasons.
      location.href = '/';
    },

    createUser(params) {
      return promisify(onComplete => {
        firebase.createUser(params, onComplete);
      });
    },

    change(method, path, value) {
      const child = firebase.child(path.join('/'));
      return promisify(onComplete => {
        child[method](value, onComplete);
      });
    },

    set(path, data) {
      return this.change('set', path, data);
    },

    push(path, data) {
      return this.change('push', path, data);
    },

    update(path, data) {
      return this.change('update', path, data);
    },

    remove(path) {
      // set(null) is equivalent to calling remove().
      return this.change('set', path, null);
    },

    once(eventType, path) {
      return new Promise((resolve, reject) => {
        firebase
          .child(path.join('/'))
          .once(eventType, resolve, reject);
      });
    }

  };
}

export function hasFirebaseErrorCode(error) {
  const codes = [
    'AUTHENTICATION_DISABLED',
    'EMAIL_TAKEN',
    'INVALID_ARGUMENTS',
    'INVALID_CONFIGURATION',
    'INVALID_CREDENTIALS',
    'INVALID_EMAIL',
    'INVALID_ORIGIN',
    'INVALID_PASSWORD',
    'INVALID_PROVIDER',
    'INVALID_TOKEN',
    'INVALID_USER',
    'NETWORK_ERROR',
    'PROVIDER_ERROR',
    'TRANSPORT_UNAVAILABLE',
    'UNKNOWN_ERROR',
    'USER_CANCELLED',
    'USER_DENIED'
  ];
  return codes.indexOf(error.code) !== -1;
}

export function firebaseError(error) {
  if (!hasFirebaseErrorCode(error)) return error;
  // Heuristic field detection.
  const prop = error.message.indexOf('password') > -1 ? 'password' : 'email';
  // Transform Firebase error to ValidationError.
  return new ValidationError(error.message, prop);
}

// Firebase key can't contain URL specific chars.
// http://stackoverflow.com/questions/24412393/how-to-index-by-email-in-firebase
// https://groups.google.com/forum/#!topic/firebase-talk/vtX8lfxxShk
export function escapeEmail(email) {
  return email.replace(/\./g, ',');
}

export function unescapeEmail(email) {
  return email.replace(/\,/g, '.');
}
