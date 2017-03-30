import { createStore, applyMiddleware } from 'redux';
import createSagaMiddleware from 'redux-saga';
import logger from 'redux-logger';
import reducer from '../reducers';
import saga from '../sagas';

export default function configureStore(){
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
      friends: []
    },
  }
  const store = createStore(
    reducer, initialState, applyMiddleware(sagaMiddleware)
  );
  sagaMiddleware.run(saga);
  console.log('hao123', store.getState());
  return store;
}
