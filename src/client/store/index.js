import { createStore, applyMiddleware } from 'redux';
import createSagaMiddleware from 'redux-saga';
import reducer from '../reducers';
import { reducer as formReducer } from 'redux-form';
import saga from '../sagas';

export default function configureStore(){
  const reducers = {
    reducer,
    form: formReducer
  }
  const sagaMiddleware = createSagaMiddleware();
  const initialState = {
    chat: {
      slideIndex: 0,
      channel: {
        username: 'hao123', 
        id: 123,
        history: [{send: true, time: '12:20', text: 'fuck you'}]
      }
    },
    login: {
      login: false, 
      loginSuccess: false, 
      friends: [],
      username: 'usrname',
      password: 'pwddd',
    },
  }
  const store = createStore(
    reducer, initialState, applyMiddleware(sagaMiddleware)
  );
  sagaMiddleware.run(saga);
  console.log('hao123', store.getState());
  return store;
}
