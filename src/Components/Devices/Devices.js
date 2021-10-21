import React from 'react';
import i18n from '../Common/i18n';
import './Devices.css';
import $ from 'jquery';
export default class Devices extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			unregister_device: [],
			register_device: [],
			unregister: 0,
			total: 0
		};
		this.scroll = this.scroll.bind(this);
	}

	scroll(direction) {
		let far = $('.device-container').width() / 2 * direction;
		let pos = $('.device-container').scrollLeft() + far;
		$('.device-container').animate({ scrollLeft: pos }, 1000);
	}

	componentDidUpdate(preProps) {
		let unregister_device = this.props.unregister_device;
		let register_device = this.props.register_device;
		let unregister = 0,
			total = 0,
			register = 0;
		if (unregister_device !== preProps.unregister_device || register_device !== preProps.register_device) {
			this.setState({ unregister_device: unregister_device, register_device: register_device });
			unregister = unregister_device ? unregister_device.length : 0;
			register = register_device ? register_device.length : 0;
			total = unregister + register;
			this.setState({ unregister: unregister, total: total });
		}
	}

	render() {
		let lng = this.props.lng;
		return (
			<div id="devices" className="text-left devices-box">
				<div className="divice-title">
					<span className="call-view-all" onClick={() => this.props.history.push('/devices')}>
						{i18n.t('devices.label', { lng })}
					</span>
				</div>
				<div>
					<span id="num">{this.state.total}</span>
					<span className="num-title mr-4">{i18n.t('total.label', { lng })}</span>
					<span id="num" className="color-red">
						{this.state.unregister}
					</span>
					<span className="num-title">{i18n.t('unregistered.label', { lng })}</span>
				</div>
				<div className="device-scroll">
					<a className="prev" onClick={this.scroll.bind(null, -1)}>
						&#10094;
					</a>
					<div className="device-container">
						{this.state.unregister_device &&
							this.state.unregister_device.map((device, index) => {
								return (
									<div className="devices devices-top-wrap-red" key={index}>
										{device.device_type === 'sip_device' && (
											<div>
												<svg className="corner corner-icon color-red">
													<use href="telicon-2.2.0.svg#device-voip-phone" />
												</svg>
												<img src="desk.png" alt="device" />
											</div>
										)}
										{device.device_type === 'cellphone' && (
											<div>
												<svg className="corner corner-icon color-red">
													<use href="telicon-2.2.0.svg#device-mobile" />
												</svg>
												<img src="cell.png" alt="device" />
											</div>
										)}
										{device.device_type === 'softphone' && (
											<div>
												<svg className="corner corner-icon color-red">
													<use href="telicon-2.2.0.svg#device-soft-phone" />
												</svg>
												<img src="device-soft.png" alt="device" />
											</div>
										)}
										{device.device_type === 'application' && (
											<div>
												<svg
													className={`corner corner-icon ${device.regsiter
														? 'color-green'
														: 'color-red'}`}
												>
													<use href="telicon-2.2.0.svg#device-sprint-phone" />
												</svg>
												<img src="application.png" alt="device" />
											</div>
										)}
										<div className="mt-2 name">{device.name}</div>
										<div className="number">{device.mac_address}</div>
									</div>
								);
							})}
						{this.state.register_device &&
							this.state.register_device.map((device, index) => {
								return (
									<div className="devices" key={index}>
										{device.device_type === 'sip_device' && (
											<div>
												<svg className="corner corner-icon color-green">
													<use href="telicon-2.2.0.svg#device-voip-phone" />
												</svg>
												<img src="desk.png" alt="device" />
											</div>
										)}
										{device.device_type === 'cellphone' && (
											<div>
												<svg className="corner corner-icon color-green">
													<use href="telicon-2.2.0.svg#device-mobile" />
												</svg>
												<img src="cell.png" alt="device" />
											</div>
										)}
										{device.device_type === 'softphone' && (
											<div>
												<svg className="corner corner-icon color-green">
													<use href="telicon-2.2.0.svg#device-soft-phone" />
												</svg>
												<img src="device-soft.png" alt="device" />
											</div>
										)}
										{device.device_type === 'application' && (
											<div>
												<svg
													className={`corner corner-icon ${device.regsiter
														? 'color-green'
														: 'color-red'}`}
												>
													<use href="telicon-2.2.0.svg#device-sprint-phone" />
												</svg>
												<img src="application.png" alt="device" />
											</div>
										)}
										<div className="mt-2 name">{device.name}</div>
										<div className="number">{device.mac_address}</div>
									</div>
								);
							})}
					</div>
					<a className="next" onClick={this.scroll.bind(null, 1)}>
						&#10095;
					</a>
				</div>
			</div>
		);
	}
}
