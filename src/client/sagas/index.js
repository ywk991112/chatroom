import io from 'socket.io-client';
import { eventChannel } from 'redux-saga';
import { fork, take, call, put, cancel, race } from 'redux-saga/effects';
import {
  loginSuccess, loginFailure, login, logout, getMessage
} from '../actions';

function connect() {
  const socket = io('http://localhost:3000');
  return new Promise(resolve => {
    socket.on('connect', () => {
      resolve(socket);
    });
  });
}

//function* getLoginStatus(socket) {
  //socket.on('login.success', (data) => {
    //console.log(data);
    //put(loginSuccess(data));
  //});
  //socket.on('login.failure', (message) => {
    //put(loginFailure(message));
  //});
//}

function subscribe(socket) {
  return eventChannel(emit => {
    socket.on('get messages', ( message ) => {
      emit(getMessage(message));
    });
    return () => {};
  });
}

function loginSubscribe(socket) {
  return eventChannel(emit => {
    socket.on('login.success', (data) => {
      console.log(data);
      emit(loginSuccess(data));
    });
    socket.on('login.failure', (message) => {
      emit(loginFailure(data));
    });
    return () => {};
  });
}

function* getLoginStatus(socket) {
  const channel = yield call(loginSubscribe, socket);
  while(true) {
    let action = yield take(channel);
    yield put(action);
  }
}

function* read(socket) {
  const channel = yield call(subscribe, socket);
  while (true) {
    let action = yield take(channel);
    yield put(action);
  }
}

function* write(socket) {
  while (true) {
    let action = yield take('SEND_MESSAGE');
    socket.emit('send message', action.message);
  }
}

function* handleIO(socket) {
  yield fork(read, socket);
  yield fork(write, socket);
}

function* flow() {
  while (true) {
    console.log('start');
    const {username, password} = yield take('LOGIN');
    console.log('start login');
    const socket = yield call(connect);
    console.log('connect');
    console.log("username: ", username);
    //const loginTask = yield fork(getLoginStatus, socket, username, password); 
    socket.emit('login', {username: username, password: password});
    const loginTask = yield fork(getLoginStatus, socket);
    const {data, msg} = yield race({
      data: take('LOGIN_SUCCESS'),
      msg: take('LOGIN_FAILURE')
    }); 
    yield cancel(loginTask);
    if(msg) continue;

    const task = yield fork(handleIO, socket);

    let action = yield take('LOGOUT');
    yield cancel(task);
    yield put(logout())
    socket.emit('logout');
  }
}

export default function* rootSaga() {
  yield fork(flow);
}
