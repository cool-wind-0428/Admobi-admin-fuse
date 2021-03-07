import React from 'react';
import { Redirect } from 'react-router-dom';

const AdmobiConfig = {
	settings: {
		layout: {}
	},
	routes: [
		{
			path: '/admobi/devicelist',
			component: React.lazy(() => import('./admobi'))
		}
	]
};

export default AdmobiConfig;
