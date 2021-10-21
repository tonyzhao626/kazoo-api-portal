import React from 'react';
import { connect } from 'react-redux';
import { setLanguage } from '../../Actions/language.action';
import './Topbar.css';

class Topbar extends React.Component {
	constructor(props) {
		super(props);
		this.setLanguage = this.setLanguage.bind(this);
  }

	setLanguage = (e) => {
		let lang = e.target.value;
		this.props.setLanguage(lang);
  }

	render() {
		return (
			<div className="Topbar">
				<div>
					<span id="title">{this.props.title}</span>
				</div>
				<div className="header-avatar">
					<img id="avatar" src="avatar.png" alt="avatar" />
					{/* <div className="online"><i className="fas fa-circle"/></div> */}
					<span id="top-name">{this.props.user_name}</span>
				</div>
				{/* <div className="language">
          <select onChange={this.setLanguage} value={this.props.lng}>
           <option value="en">EN</option>
           <option value="fr">FR</option>
          </select>
        </div> */}
			</div>
		);
	}
}
const mapStateToProps = (state) => state.language;
const mapDispatchToProps = (dispatch) => ({
	setLanguage: (language) => dispatch(setLanguage(language))
});
export default connect(mapStateToProps, mapDispatchToProps)(Topbar);
