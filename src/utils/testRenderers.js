import React from 'react';
import { render } from '@testing-library/react';
import { Provider } from 'react-redux';
import { createStore } from 'redux';

import rootReducer from 'reducers';
import notes from 'components/noteList/__test__/dummyNotesData';
import { Router } from 'react-router';
import { createMemoryHistory } from 'history';

const dummyStore = createStore(rootReducer, { notes });
const dummyHistory = createMemoryHistory();

export function renderWithStore(component) {
	return render(<Provider store={dummyStore}>{component}</Provider>);
}

export function renderWithRouter(component) {
	const wrap = render(<Router history={dummyHistory}>{component}</Router>);
	const rerender = component =>
		wrap.rerender(<Router history={dummyHistory}>{component}</Router>);
	return { ...wrap, history: dummyHistory, rerender };
}

export default function renderWithStoreAndRouter(component) {
	const wrap = render(<Router history={dummyHistory}>{component}</Router>);
	return { ...wrap, history: dummyHistory };
}
