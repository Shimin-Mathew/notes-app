import React from 'react';
import { Router } from 'react-router-dom';
import { render } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { createMemoryHistory } from 'history';

import AppSearch from '../AppSearch';
import { queryString } from 'utils/url';

const searchText = 'Apple';

describe('AppSearch', () => {
	test('initial search param is the value of search field', () => {
		const history = createMemoryHistory();
		history.push(`?q=${searchText}`);
		const { getByRole } = renderAppSearch(history);
		const input = getByRole('searchbox');

		expect(input).toHaveValue(searchText);
	});

	test('typing on searchbox changes the route search param', () => {
		const history = createMemoryHistory();
		const { getByRole } = renderAppSearch(history);
		const input = getByRole('searchbox');
		userEvent.type(input, searchText);

		expect(queryString(history.location.search, 'q')).toBe(searchText);
	});

	test('typing on searchbox calls onSearch', () => {
		const history = createMemoryHistory();
		const callback = jest.fn();
		const { getByRole } = renderAppSearch(history, callback);
		const input = getByRole('searchbox');
		userEvent.type(input, searchText);

		expect(callback).toHaveBeenCalledTimes(searchText.length);
	});
});

function renderAppSearch(history, onSearch) {
	return render(
		<Router history={history}>
			<AppSearch onSearch={onSearch} />
		</Router>
	);
}
