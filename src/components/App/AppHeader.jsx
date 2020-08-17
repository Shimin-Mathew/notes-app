import React, {useContext} from 'react';
import { NavLink } from 'react-router-dom';
import AppbarSearch from './AppSearch';
import SidebarContext from 'context/sidebar';

export default function AppHeader() {

	const {toggle, isMobile, isOpenForMobile} = useContext(SidebarContext);

	return (
		<header className='app-bar'>
			<AppbarSearch onSearch={!isOpenForMobile && toggle} />
			<nav className='app-bar-nav'>
				{isMobile && <HamburgerButton onClick={toggle} />}
				<NavLink to='/notes/recent' className='app-bar-nav-link'>Recent</NavLink>
				<NavLink to='/notes/most-checked' className='app-bar-nav-link'>Most Checked</NavLink>
			</nav>
		</header>
	)
}

function HamburgerButton({onClick}) {
	const toggleSidebar = () => onClick();
	return (
		<button className="hamburger-button" onClick={toggleSidebar}>
			<span>|||</span>
		</button>
	)
}