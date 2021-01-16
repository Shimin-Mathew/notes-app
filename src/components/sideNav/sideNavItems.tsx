import React from 'react';
import { NavLink } from 'react-router-dom';
import { useLocation } from 'react-router';
// import { connect } from 'react-redux';
import { queryString } from 'utils/url';
import lastOf from 'utils/array';
import { getMostVisited } from 'utils/storage';
import { total, done } from 'utils/todos';

// TODO: scroll to the selected item in the sidebar

interface SideNavItemsProps {
	data: NoteI[],
	isSelectionModeOn: boolean,
	selectedItemsSet: Set<number>,
	onContextMenu(id: NoteI['id']): void,
	onClick(): void
}

export default function SideNavItems({
	data,
	isSelectionModeOn,
	selectedItemsSet,
	onContextMenu,
	onClick
}: SideNavItemsProps) {
	const search = useLocation().search;
	const query = queryString(search, 'q');
	const mostCheckedNote = getMostVisited();
	const recentNote = lastOf(data);

	const matchedNote = data.filter(
		note =>
			query === null || note.title.toLowerCase().includes(query.toLowerCase())
	);

	if (matchedNote.length) {
		return (
			<>
				{matchedNote.map(note => {
					const noteTitle =
						note.title || getTitleFromNote(note.notes) || 'Empty Note';
					const noteByLines = note.notes.split('\n');
					const numberOftasksTotal = noteByLines.filter(total).length;
					const numberOftasksDone = noteByLines.filter(done).length;

					const hasSubTasks = numberOftasksTotal !== 0;
					const isComplete = numberOftasksDone === numberOftasksTotal;
					const progress = isComplete
						? 'Done'
						: `${numberOftasksDone}/${numberOftasksTotal}`;
					const itemSelectionCssState = selectedItemsSet.has(note.id)
						? ' selected'
						: '';

					function toggleNoteSelect(
						event: React.MouseEvent<HTMLAnchorElement>
					) {
						event.preventDefault();
						onContextMenu(note.id);
					}

					function handleClick(event: React.MouseEvent<HTMLAnchorElement>) {
						if (isSelectionModeOn) {
							toggleNoteSelect(event);
						}
						if (onClick) {
							onClick();
						}
					}

					// @ts-ignore
					function handleActiveLink(match, location) {
						const isRecentNote = recentNote.id === note.id;
						const isMostViewedNote = mostCheckedNote === String(note.id);
						const shouldShowMostViewed = location.pathname.includes(
							'most-checked'
						);
						const shouldShowRecentNote = location.pathname.includes('recent');
						const isRecentMatch = shouldShowRecentNote && isRecentNote;
						const isMostViewMatch = shouldShowMostViewed && isMostViewedNote;
						return match || isRecentMatch || isMostViewMatch;
					}

					return (
						<NavLink
							to={`/notes/${note.id}${search}`}
							isActive={handleActiveLink}
							onClick={handleClick}
							onContextMenu={toggleNoteSelect}
							className={`todo-link${itemSelectionCssState}`}
							key={note.id}>
							{noteTitle} {hasSubTasks ? `[${progress}]` : null}
						</NavLink>
					);
				})}
			</>
		);
	}
	return (
		<div className="msg-sidenav-empty">
			{query ? (
				<h2>
					Nothing matched your search <em style={{ color: '#eee' }}>{query}</em>
				</h2>
			) : (
				<h2>You have nothing on your notes</h2>
			)}
			<i>Start editing to add a new note to the list.</i>
		</div>
	);
}

function getTitleFromNote(note: string) {
	if (!note) return;

	const firstFewWords = note.split(' ').slice(0, 4).join(' ');
	const firstWordsSliced = firstFewWords.length > 12
		? firstFewWords.slice(0, 12)
		: firstFewWords;
	return `${firstWordsSliced}...`;
}