import {createStore, applyMiddleware, Store, compose} from 'redux';
import ReduxThunk from 'redux-thunk';

import rootReducer from './reducers';

const middlewares = [ReduxThunk];

const composeEnhancers =
    (window as any).__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

const store: Store = createStore(
    rootReducer,
    composeEnhancers(applyMiddleware(...middlewares)),
);

export default store;
