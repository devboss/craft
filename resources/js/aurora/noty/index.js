import Noty from 'noty';
const noty = {
	displayNoty(message, stack, id, theme = false, includeContactUs = true) {

		const notymessage = `
						<h1>${message ? message : `Sorry there has been an error.`}</h1>
						${includeContactUs ? `
							<h1>Please contact us at: <a href="mailto:enquiries@laplanduk.co.uk" style="text-decoration: underline;">enquiries@laplanduk.co.uk</a></h1>
						`: ``}
						
						${id ? `
							<h1>
								Request ID: ${id}
							</h1>
						
						` : ``}
						${stack ? `
							<div>
								<code style="overflow:auto; word-break: break-word;">
									${stack}
								</code>
							</div>
						` : ``}
					`;


		new Noty({
			type: theme ? theme : 'error',
			text: notymessage,
			timeout: false,
			closeWith: ['button'],
			theme: 'semanticui'
		}).show();
	}
};

export default noty;