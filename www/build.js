({
	baseUrl: 'js',
	mainConfigFile: 'js/main.js',
	name: 'main',
	out: 'main.min.js',
	preserveLicenseComments: false,
	shim: {
		bootstrap: {
			deps: ['jquery']
		}
	},
	paths: {
		requireLib: 'libs/require'
	},
	include: 'requireLib'
	
})