import mixpanel from 'mixpanel-browser';

const { VITE_APP_ENV, VITE_APP_MIXPANEL_TOKEN, VITE_APP_REPO } = import.meta.env;

let env_check = VITE_APP_ENV === 'production';

mixpanel.init(VITE_APP_MIXPANEL_TOKEN, { autotrack: false, debug: !env_check });

let actions = {
	identify: (id: string) => {
		if (env_check) mixpanel.identify(id);
	},
	alias: (id: string) => {
		if (env_check) mixpanel.alias(id);
	},
	track: (name: string, props: any = {}) => {
		if (env_check) {
			mixpanel.track(name, { ...props, is_web: true, channel: VITE_APP_REPO === 'ultron' ? 'Wizorder' : 'Wizshop' });
		} else {
			console.log('Event tracked: ', name, props);
		}
	},
	people: {
		set: (props: any) => {
			if (env_check) mixpanel.people.set(props);
		},
	},
	reset: () => {
		if (env_check) mixpanel.reset();
	},
	register: (props: any) => {
		if (env_check) mixpanel.register(props);
		console.log('Event Super Props: ', props);
	},
};

export let Mixpanel = actions;
