import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import { Provider } from 'react-redux';

import createDummyStore from 'store/dummyStore';
import ConnectedTodoContent, { TodoContent } from '../todoContent';
import todos from './todos';

// describe
// test / it
// jest

const assertedValue = 'Apple';

const titleInput = /Title/;
const noteInput = /Note/;
const [note] = todos;

describe('TodoContent', () => {
	test('callback is called on every change', () => {
		const callbackMock = jest.fn();
		const { getByLabelText } = render(
			<TodoContent noteId={note.id} data={note} setTodoField={callbackMock} />
		);

		const title = getByLabelText(titleInput);
		for (let i = 0; i <= assertedValue.length; i++)
			fireEvent.change(title, { target: { value: assertedValue.slice(0, i) } });

		expect(callbackMock).toHaveBeenCalledTimes(assertedValue.length + 1);
	});

	test('allows to input title text', () => {
		const store = createDummyStore();
		const { getByLabelText } = render(
			<Provider store={store}>
				<ConnectedTodoContent noteId={note.id} data={note} />
			</Provider>
		);
		const title = getByLabelText(titleInput);
		fireEvent.change(title, { target: { value: assertedValue } });
		const [ updatedNote ] = store.getState().todos;

		expect(updatedNote.title).toBe(assertedValue);
	});

	test('allows to input note text', () => {
		const store = createDummyStore();
		const { getByLabelText } = render(
			<Provider store={store}>
				<ConnectedTodoContent noteId={note.id} data={note} />
			</Provider>
		);
		const notes = getByLabelText(noteInput);
		fireEvent.change(notes, { target: { value: assertedValue } });
		const [ updatedNote ] = store.getState().todos;
		
		expect(updatedNote.notes).toBe(assertedValue);
	});

	test('disable title text: text not changing', () => {
		const store = createDummyStore();
		const { getByLabelText } = render(
			<Provider store={store}>
				<ConnectedTodoContent
					noteId={1}
					data={{ title: 'Ok', notes: 'blah', id: 1 }}
					disableEdit={true}
					setTodoField={() => {}}
				/>
			</Provider>
		);
		const title = getByLabelText(titleInput);
		changeElementValue(title, true);
	});

	test('disable note text: note not changing', () => {
		const store = createDummyStore();
		const { getByLabelText } = render(
			<Provider store={store}>
				<ConnectedTodoContent
					noteId={1}
					data={{ title: 'Ok', notes: 'blah', id: 1 }}
					disableEdit={true}
					setTodoField={() => {}}
				/>
			</Provider>
		);
		const notes = getByLabelText(noteInput);
		changeElementValue(notes, true);
	});
});

function changeElementValue(element, shouldFail = false) {
	fireEvent.change(element, { target: { value: assertedValue } });
	expect(element.disabled).toBe(shouldFail);
	if (shouldFail) {
		expect(element.value).not.toBe(assertedValue);
	} else {
		expect(element.value).toBe(assertedValue);
	}
}
