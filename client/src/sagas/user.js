import { call, put, takeEvery, fork } from 'redux-saga/effects';
import axios from 'axios';

import * as userActions from '../actions/user';


//= =======================================
// CHECKIN

const getProfile = () => axios.get('/api/auth/profile');

export function* checkinProcess() {
  try {
    const payload = yield call(getProfile);

    // Errors
    if (payload.data.errors) {
      yield put(userActions.userLogout());
    }

    // User data
    if (payload.data) {
      yield put(userActions.userLogin(payload.data));
    }
  } catch (e) {
    console.log('login error', e);
    yield put(userActions.userLogout());
  }
}

//= =======================================
// LOGOUT


const apiLogout = () => axios.get('/api/auth/logout');

export function* logoutProcess() {
  try {
    yield call(apiLogout);

    yield put(userActions.userLogout());
  } catch (e) {
    console.log('login error', e);
  }
}

//= ========================================
// CHANGE PASSWORD

const changePwToAPI = data => axios.post('/api/auth/profile/password', {
  currentPassword: data.currentPassword,
  nextPassword: data.nextPassword,
  repeatPassword: data.repeatPassword,
});


export function* changePwProcess(action) {
  try {
    const payload = yield call(
      changePwToAPI,
      action.changePwData,
    );

    // Errors
    if (payload.data.errors) {
      yield put(userActions.changePwFailed(payload.data.errors));
    }

    // User data
    if (payload.data) {
      yield put(userActions.changePwSuccess());
    }
  } catch (e) {
    console.log('profile error', e);
    yield put(userActions.changePwFailed([
      {
        type: 'request',
        message: e.message,
      },
    ]));
  }
}


//= ========================================
// CHANGE PROFILE's PICTURE

const changePictureToAPI = url => axios.post('/api/auth/profile/picture', {
  picture: url,
});


export function* changePictureProcess(action) {
  try {
    const payload = yield call(
      changePictureToAPI,
      action.url,
    );

    // Errors
    if (payload.data.errors) {
      yield put(userActions.changePictureFailed(payload.data.errors));
    }

    // User data
    if (payload.data) {
      yield put(userActions.changePictureSuccess(payload.data.picture));
    }
  } catch (e) {
    console.log('profile error', e);
    yield put(userActions.changePictureFailed([
      {
        type: 'request',
        message: e.message,
      },
    ]));
  }
}


//= ========================================
// SET PLAYLISTS

const setPlaylistsToAPI = playlists => axios.post('/api/playlist/all', {
  playlists,
});


export function* setPlaylistsProcess(action) {
  try {
    const payload = yield call(
      setPlaylistsToAPI,
      action.playlists,
    );

    // Errors
    if (payload.data.errors) {
      yield put(userActions.setPlaylistsFailed(payload.data.errors));
    }

    // User data
    if (payload.data) {
      yield put(userActions.setPlaylistsSuccess(payload.data.playlists));
    }
  } catch (e) {
    console.log('profile error', e);
    yield put(userActions.setPlaylistsFailed([
      {
        type: 'request',
        message: e.message,
      },
    ]));
  }
}

//= ========================================
// ADD SONG TO PLAYLIST

// const addSongToPlaylist = (song, playlist) => axios.post('/api/playlist/all', {
//   playlists,
// });


// export function* setPlaylistsProcess(action) {
//   try {
//     const payload = yield call(
//       setPlaylistsToAPI,
//       action.playlists,
//     );

//     // Errors
//     if (payload.data.errors) {
//       yield put(userActions.setPlaylistsFailed(payload.data.errors));
//     }

//     // User data
//     if (payload.data) {
//       yield put(userActions.setPlaylistsSuccess(payload.data.playlists));
//     }
//   } catch (e) {
//     console.log('profile error', e);
//     yield put(userActions.setPlaylistsFailed([
//       {
//         type: 'request',
//         message: e.message,
//       },
//     ]));
//   }
// }


//= ========================================
// WATCHER

export function* watchUserRequest() {
  yield fork(
    takeEvery,
    userActions.USER_CHECKIN,
    checkinProcess,
  );
  yield fork(
    takeEvery,
    userActions.USER_REQUEST_LOGOUT,
    logoutProcess,
  );
  yield fork(
    takeEvery,
    userActions.CHANGE_PW_REQUEST,
    changePwProcess,
  );
  yield fork(
    takeEvery,
    userActions.CHANGE_PICTURE_REQUEST,
    changePictureProcess,
  );
  yield fork(
    takeEvery,
    userActions.SET_PLAYLISTS_REQUEST,
    setPlaylistsProcess,
  );
}
