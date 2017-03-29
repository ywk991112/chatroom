import { createStore, applyMiddleware } from 'redux';
import createSagaMiddleware from 'redux-saga';
import logger from 'redux-logger';
import reducer from '../reducers';
import saga from '../sagas';

export default configureStore = () => {
  const sagaMiddleware = createSagaMiddleware();
  const initialState = {
    chat:{login: false, loginSuccess: false}
  }
  const store = createStore(
    reducer, initialState, applyMiddleware(
      sagaMiddleware, logger()
    )
  );
  sagaMiddleware.run(saga);
  return store;
}
