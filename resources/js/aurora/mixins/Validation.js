const validators = {
	required: (value) => {
		if (typeof value == 'boolean') return value
		return !((value == null) || (value.length == 0))
	},
	numeric: (value) => {
		return (/^-?(?:0$0(?=\d*\.)|[1-9]|0)\d*(\.\d+)?$/).test(value)
	},
	integer: (value) => {
		return (/^(-?[1-9]\d*|0)$/).test(value)
	},
	digits: (value) => {
		return (/^[\d() \.\:\-\+#]+$/).test(value)
	},
	alpha: (value) => {
		return (/^[a-zA-Z]+$/).test(value)
	},
	alphaNum: (value) => {
		return !(/\W/).test(value)
	},
	alphaNumSpaces: (value) => {
		return (!(/\W/).test(value) || !(/^[\w\-\s]+$/).test(value));
	},
	email: (value) => {
		return (/^[-a-z0-9~!$%^&*_=+}{\'?]+(\.[-a-z0-9~!$%^&*_=+}{\'?]+)*@([a-z0-9_][-a-z0-9_]*(\.[-a-z0-9_]+)*\.(aero|arpa|biz|com|coop|edu|gov|info|int|mil|museum|name|net|org|pro|travel|mobi|london|[a-z][a-z])|([0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}))(:[0-9]{1,5})?$/i
		).test(value)
	},
	url: (value) => {
		return (/^(https?|ftp|rmtp|mms):\/\/(([A-Z0-9][A-Z0-9_-]*)(\.[A-Z0-9][A-Z0-9_-]*)+)(:(\d+))?\/?/i).test(value)
	},
	min: (value, arg) => {
        if (typeof value === 'string') {
            value = value.length
        }
		return value >= +arg
	},
	max: (value, arg) => {
        if (typeof value === 'string') {
        	value = value.length
		}
		return value <= +arg
	},
	regex: (value, arg) => {
		let match = arg.match(new RegExp('^/(.*?)/([gimy]*)$'))
		let regex = new RegExp(match[1], match[2])
		
		return regex.test(value)
	}
}

const replacers = {
	min: (message, attribute, rule, parameters) => {
		return message.replace(':min', parameters[1])
	},
	max: (message, attribute, rule, parameters) => {
		return message.replace(':max', parameters[1])
	}
}

const messages = {
	alpha: 'The :attribute may only contain letters.',
	alphaNum: 'The :attribute may only contain letters and numbers.',
	alphaNumSpaces: 'The :attribute needs to be filled in.',
	digits: 'The :attribute must be :digits digits.',
	email: 'The :attribute must be a valid email address.',
	integer: 'The :attribute must be an integer.',
	max: 'The :attribute may not be greater than :max.',
	min: 'The :attribute must be at least :min.',
	numeric: 'The :attribute must be a number.',
	regex: 'The :attribute format is invalid.',
	required: 'The :attribute field is required.',
	url: 'The :attribute format is invalid.',
	minResponsibleAdults: 'The :attribute must be at least :min.'
}

export default {
	data() {
		return {
			errors: {}
		}
	},
	mounted() {
		_.forEach(this.rules, (rule, model) => {
			this.$watch(model, value => {
				this.validate(model, value, rule)
			})
		})
	},
	methods: {
		passes() {
			_.forEach(this.rules, (rule, model) => {
				this.validate(model, _.get(this, model), rule)
			});
		},
		hasError(model) {
			return this.getError(model) !== null
		},
		getError(model) {
			return _.get(this.errors, model, null)
		},
		validate(model, value, rule) {
			return _.every(rule, rule => {
				let ruleAndArgs = _.split(rule, ':')
				let args = ruleAndArgs.length > 1 ? _.split(ruleAndArgs[1], ',') : []
				
				rule = ruleAndArgs[0]
				args.unshift(value)
				
				if (!_.has(validators, rule)) {
					throw new Error('Unknown validation rule "' + rule + '"')
				}
				
				let valid = validators[rule].apply(null, args)
				
				if (valid) {
					this.$set(this.errors, model, null)
				} else {
					let error = _.get(messages, rule).split(',')[0]
					
					error = error.replace(':attribute', model.replace('.value', '')
						.replace(/([A-Z])/g, (match, p1) => {
							return ' ' + p1.toLowerCase()
						})
						.replace(/\./g, (match) => {
							return ' '
						})
					)
					
					if (_.has(replacers, rule)) {
						error = replacers[rule].call(null, error, model, rule, args)
					}
					
					this.$set(this.errors, model, error)
				}
				
				return valid
			})
		}
	}
}
