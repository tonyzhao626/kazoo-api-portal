import React from 'react';
import { NavLink } from 'react-router-dom';
import i18n from '../Common/i18n';
import './Sidebar.css';

export class SidebarLink extends React.Component {

	render() {
		let lng = this.props.lng;
		return (
			<div>
				<NavLink exact to={this.props.route} activeClassName="Sidebar-active">
					<div className="Sidebar-Link">
						<svg className="sidebar-icon">
							<use href={`telicon-2.2.0.svg#${this.props.img}`} />
						</svg>
						{this.props.title}
						{this.props.title === i18n.t('voicemails.label', { lng }) ? (
							this.props.newmails > 0 && (
								<span className="notification text-right">{this.props.newmails}</span>
							)
						) : (
							''
						)}
						{this.props.title === i18n.t('callhistory.label', { lng }) ? (
							this.props.missedcalls > 0 && (
								<span className="notification text-right">{this.props.missedcalls}</span>
							)
						) : (
							''
						)}
					</div>
				</NavLink>
			</div>
		);
	}
}
