import React from 'react';
import { connect } from 'react-redux';
import Topbar from '../Common/Topbar';
import { getCallFlow } from '../../Actions/callhistory.action';
import { HistorySearch } from './HistorySearch';
import { HistoryTable } from './HistoryTable';
import i18n from '../Common/i18n';
import './History.css';

class History extends React.Component {
	constructor(props) {
		super(props);
		const day = new Date();
		this.state = {
			startDate: new Date(day.setDate(day.getDate() - 7)),
			endDate: new Date(),
			filter: '',
			call_list: [],
			perPage: 10,
			currentPage: 0,
			call_flow: '',
			total: 0,
			user_name: ''
		};
	}

	componentDidMount() {
		if (this.props.callreducer.loading) {
			this.props.getCallFlow(this.state.startDate, this.state.endDate);
		} else {
			let { call_flow } = this.props.callreducer;
			let call_data = call_flow.call_data;
			let total = call_data.length;
			this.setState({ call_flow: call_data, total: total, user_name: call_flow.full_name });
		}
	}

	componentDidUpdate(preProps) {
		let { call_flow } = this.props.callreducer;
		if (call_flow !== preProps.callreducer.call_flow) {
			let call_data = call_flow.call_data;
			let total = call_data.length;
			this.setState({ call_flow: call_data, total: total, user_name: call_flow.full_name });
		}
	}

	startDateChange = (date) => {
		this.setState(
			{
				startDate: date
			},
			() => {
				var dateDiff = parseInt(
					(this.state.endDate.getTime() - this.state.startDate.getTime()) / (24 * 3600 * 1000),
					10
				);
				if (dateDiff > 30) {
					this.setState({
						endDate: new Date(this.state.startDate.getTime() + 30 * 24 * 3600 * 1000)
					});
				}
			}
		);
	};

	endDateChange = (date) => {
		this.setState(
			{
				endDate: date
			},
			() => {
				var dateDiff = parseInt(
					(this.state.endDate.getTime() - this.state.startDate.getTime()) / (24 * 3600 * 1000),
					10
				);
				if (dateDiff > 30) {
					this.setState({
						startDate: new Date(this.state.endDate.getTime() - 30 * 24 * 3600 * 1000)
					});
				}
			}
		);
	};

	changeFilter = (data) => {
		this.setState({
			filter: data
		});
	};

	prev = () => {
		let tmp = this.state.currentPage;
		this.setState({
			currentPage: tmp - 1
		});
	};

	next = () => {
		let tmp = this.state.currentPage;
		this.setState({
			currentPage: tmp + 1
		});
	};

	apply = () => {
		this.setState({ currentPage: 0 });
		this.props.getCallFlow(this.state.startDate, this.state.endDate);
	};

	selectPerPage = (e) => {
		this.setState({ perPage: e.target.value, currentPage: 0 });
	};

	setCountLabel = (total) => {
		if (this.state.perPage * (this.state.currentPage + 1) < total)
			return this.state.perPage * (this.state.currentPage + 1);
		else return total;
	};

	render() {
		let { lng } = this.props.language;
		let { systemmessage } = this.props.systemmessage;
		if (systemmessage === 'Authentication failed.') {
			window.location.reload();
		}
		return (
			<div className="history">
				{this.props.callreducer.loading && (
					<div className="loader_container">
						<div className="loader" />
					</div>
				)}
				<Topbar title={i18n.t('callhistory.label',{ lng })} user_name={this.state.user_name} />
				<div className="main-container">
					<HistorySearch
						startDateChange={this.startDateChange}
						endDateChange={this.endDateChange}
						changeFilter={this.changeFilter}
						apply={this.apply}
						state={this.state}
						lng={lng}
					/>
					<HistoryTable
						list={this.state.call_flow}
						perPage={this.state.perPage}
						currentPage={this.state.currentPage}
						filter={this.state.filter}
						lng={lng}
					/>

					<div className="bottom-nav">
						<label>{i18n.t('view.label', { lng })}</label>
						<select value={this.state.perPage} onChange={this.selectPerPage}>
							<option value="10">10</option>
							<option value="25">25</option>
							<option value="50">50</option>
							<option value="100">100</option>
						</select>
						<label>{i18n.t('per_page.label', { lng })}</label>
						<span id="page-num">
							{this.state.perPage * this.state.currentPage + 1}-{this.setCountLabel(this.state.total)} of{' '}
							{this.state.total}
						</span>
						{this.state.currentPage === 0 ? (
							<button onClick={this.prev} className="button-disable" disabled>
								&#60;
							</button>
						) : (
							<button onClick={this.prev} className="button-enable">
								&#60;
							</button>
						)}
						{(this.state.currentPage + 1) * this.state.perPage >= this.state.total ? (
							<button onClick={this.next} className="button-disable" disabled>
								&#62;
							</button>
						) : (
							<button onClick={this.next} className="button-enable">
								&#62;
							</button>
						)}
					</div>
				</div>
			</div>
		);
	}
}

const mapStateToProps = (state) => ({
	callreducer: state.callreducer,
	language: state.language,
	systemmessage: state.systemmessage
});
const mapDispatchToProps = (dispatch) => ({
	getCallFlow: (startDate, endDate) => dispatch(getCallFlow(startDate, endDate))
});
export default connect(mapStateToProps, mapDispatchToProps)(History);
