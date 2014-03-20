({
	baseUrl: 'js',
	mainConfigFile: 'js/mobile.js',
	name: 'mobile',
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