import React from 'react';
import ReactQuill from 'react-quill';
import { Button, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';
import './Faxes.css';
import 'react-quill/dist/quill.snow.css';
import axios from 'axios';

import CONFIG from '../../Config.json';

export default class SendFaxPage extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			text: '',
			sendTo: '',
			sendFrom: '',
			uploadFile: ''
		};
	}

	faxTextChange = (value) => {
		this.setState({ text: value });
	};

	modules = {
		toolbar: [
			[ 'bold' ],
			[ 'italic' ],
			[ 'underline' ],
			[ 'strike' ],
			[ { align: [] } ],
			[ { list: 'ordered' } ],
			[ { list: 'bullet' } ],
			[ { indent: '-1' } ],
			[ { indent: '+1' } ]
		]
	};
	onChangeFile = () => {
		var name = this.uploadInput.files[0].name;
		this.setState({ uploadFile: name });
	};
	handleTextChange = (e) => {
		this.setState({
			[e.target.name]: e.target.value
		});
	};
	clearForm = () => {
		this.setState({
			text: '',
			sendTo: '',
			sendFrom: '',
			uploadFile: ''
		});
	};

	handleUploadFile = (ev) => {
		ev.preventDefault();
		let account_id = localStorage.getItem('account_id');
		var file = this.uploadInput.files[0];
		let URL = `${CONFIG.API_URL}/accounts/${account_id}/faxes`;
		let from_number = this.state.sendFrom;
		let to_number = this.state.sendTo;
		let reader = new FileReader();
		reader.readAsDataURL(file);
		reader.onload = () => {
			let b64data = reader.result;
			let json = {
				from_number: from_number,
				to_number: to_number
			};
			let data = this.craftMessage(b64data, json);
			var boundary = 'multipart-message-boundary';
			axios
				.put(URL, data, {
					headers: {
						'Content-Type': 'multipart/mixed; boundary=' + boundary
					}
				})
				.then((res) => {
					if (res.data.status === 'success') {
						setTimeout(() => {
							this.props.successFax();
							this.props.sendFax();
						}, 2000);
					}
				})
				.catch((error) => {
					console.log(error);
				});
		};
		reader.onerror = function(error) {
			console.log('Error: ', error);
		};
	};

	craftMessage = (base64Document, metadata) => {
		var boundary = 'multipart-message-boundary';
		var message = '';
		var bodyParts = [
			{
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify({
					data: metadata
				})
			},
			{
				headers: {
					'Content-Type': 'application/pdf',
					'Content-Length': atob(base64Document.split(',')[1]).length,
					'Content-Transfer-Encoding': 'base64'
				},
				body: base64Document.replace(/\s/g, '')
			}
		];

		bodyParts.forEach(function(part) {
			message += '--' + boundary + '\r\n';
			for (var header in part.headers) {
				message += header + ': ' + part.headers[header] + '\r\n';
			}
			message += '\r\n' + part.body + '\r\n';
		});
		return message + '--' + boundary + '--';
	};

	render() {
		return (
			<div id="sendfax-modal2">
				<form onSubmit={this.handleUploadFile}>
					<ModalHeader toggle={this.props.sendFax}>Send a Fax</ModalHeader>
					<ModalBody>
						<div className="sendfax-main">
							<div className="number mb-1">Send To *</div>
							<div>
								<input
									type="text"
									className="form-control"
									name="sendTo"
									value={this.state.sendTo}
									onChange={this.handleTextChange}
									required
								/>
							</div>
							<div className="number mt-3 mb-1">Send From *</div>
							<div>
								<input
									type="text"
									className="form-control"
									name="sendFrom"
									value={this.state.sendFrom}
									onChange={this.handleTextChange}
									required
								/>
							</div>
							<div className="number mt-4 mb-1">Upload File to Fax </div>
							<div className="input-group">
								<input
									type="text"
									className="form-control"
									name="uploadFile"
									value={this.state.uploadFile}
									onChange={this.handleTextChange}
									required
								/>
								<div className="input-group-append">
									<label className="choose-btn" type="button">
										Choose File
										<input
											ref={(ref) => {
												this.uploadInput = ref;
											}}
											type="file"
											onChange={this.onChangeFile}
										/>
									</label>
								</div>
							</div>
							<div className="upload-label">
								<strong>15mb</strong> size restriction and .pdf and .tiff type per fax.
							</div>
							<div className="number mt-4 mb-1">Message Content</div>
							<div>
								<ReactQuill
									theme="snow"
									modules={this.modules}
									value={this.state.text}
									onChange={this.faxTextChange}
								/>
							</div>
						</div>
					</ModalBody>
					<ModalFooter>
						<button className="cancel-btn" onClick={this.props.sendFax}>
							Cancel
						</button>
						<Button color="secondary" onClick={this.clearForm}>
							Clear Form
						</Button>
						<Button color="success" type="submit">
							Send Fax
						</Button>
					</ModalFooter>
				</form>
			</div>
		);
	}
}
