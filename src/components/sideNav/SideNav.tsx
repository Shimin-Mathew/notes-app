import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';

import FloatButton from './floatButton';
import ContextMenu from './contextMenu';
import SideNavItems from './sideNavItems';
import NotesFilterer from './filter';
import { useBackdrop } from 'context/backdrop';
import { useSidebar } from 'context/sidebar';
import { pushToast } from 'actions/notificationActions';

import { NotesAppState } from 'reducers';

import 'styles/list.css';

interface SideNavProps {
	noteItems: NoteI[];
	isEditingNote: null | NoteI['id'];
	pushToast(msg: string): void;
}

export function SideNav({ noteItems, isEditingNote, pushToast }: SideNavProps) {
	const { isOpenForMobile, isMobile, toggle } = useSidebar();
	const togglebackdrop = useBackdrop();
	const [selectedOnContextMenu, setSelected] = useState(new Set<number>([]));
	const shouldOpenSidebar = selectedOnContextMenu.size > 0 || isOpenForMobile;
	const sidebarClass = `sidenav-left${shouldOpenSidebar ? ' open' : ''}`;

	function handleContextMenu(noteId: number) {
		const newSet = new Set(selectedOnContextMenu);

		if (selectedOnContextMenu.has(noteId)) {
			newSet.delete(noteId);
			setSelected(newSet);
		} else {
			newSet.add(noteId);
		}

		setSelected(newSet);
	}

	function handelDeleteSelected() {
		setSelected(prev => {
			pushToast(`Deleted ${prev.size} notes`);
			return new Set([]);
		});
	}

	function handleCxSelectAll() {
		setSelected(new Set(noteItems.map(t => t.id)));
	}

	function handleCxDeselectAll() {
		setSelected(new Set([]));
	}

	useEffect(() => {
		// @ts-ignore
		const [sidebar] = document.getElementsByClassName('sidenav-left');

		function handleClickOutside(event: MouseEvent) {
			const { target } = event;
			const isClickOutside = !sidebar.contains(target);
			//@ts-ignore
			const isAllowedClickOutside = target.matches(
				'.hamburger-button, .hamburger-button span, .contextmenu-delete-button'
			);

			if (isOpenForMobile && !isAllowedClickOutside && isClickOutside) {
				toggle(false);
			}
		}

		window.addEventListener('mousedown', handleClickOutside);
		return () => window.removeEventListener('mousedown', handleClickOutside);
	}, [isOpenForMobile, toggle, togglebackdrop]);

	return (
		<React.Fragment>
			<aside className={sidebarClass}>
				<NotesFilterer list={noteItems}>
					{notes => (
						<SideNavItems
							data={notes}
							isMobile={isMobile}
							isSelectionModeOn={selectedOnContextMenu.size > 0}
							selectedItemsSet={selectedOnContextMenu}
							onContextMenu={handleContextMenu}
							onClick={isMobile && toggle}
						/>
					)}
				</NotesFilterer>
			</aside>
			{!(isEditingNote && isMobile) && <FloatButton label="+" />}
			<ContextMenu
				selectedItems={selectedOnContextMenu}
				onDeleted={handelDeleteSelected}
				onSelectAll={handleCxSelectAll}
				onDeselectAll={handleCxDeselectAll}
			/>
		</React.Fragment>
	);
}

const mapStateToProps = (state: NotesAppState) => ({
	noteItems: state.notes,
	isEditingNote: state.appData.noteEditing
});
const mapDispatchToProps = { pushToast };

export default connect(mapStateToProps, mapDispatchToProps)(SideNav);
