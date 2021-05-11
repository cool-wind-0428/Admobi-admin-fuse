import FuseUtils from '@fuse/utils';
import appsConfigs from 'app/main/apps/appsConfigs';
import authRoleExamplesConfigs from 'app/main/auth/authRoleExamplesConfigs';
import CallbackConfig from 'app/main/callback/CallbackConfig';
import DocumentationConfig from 'app/main/documentation/DocumentationConfig';
import LoginConfig from 'app/main/login/LoginConfig';
import LogoutConfig from 'app/main/logout/LogoutConfig';
import pagesConfigs from 'app/main/pages/pagesConfigs';
import RegisterConfig from 'app/main/register/RegisterConfig';
import UserInterfaceConfig from 'app/main/user-interface/UserInterfaceConfig';
import AdmobiConfig from 'app/admobi/AdmobiConfig';
import React from 'react';
import { Redirect } from 'react-router-dom';
import EditUser from '../../app/admobi/EditUser';
import AdminRoleExample from 'app/main/auth/admin-role-example/AdminRoleExample';
import { BrowserRouter as Router, Switch, Route, Link } from "react-router-dom";
import RootPage from 'app/main/pages/rootPages';

const routeConfigs = [
	...appsConfigs,
	...pagesConfigs,
	...authRoleExamplesConfigs,
	UserInterfaceConfig,
	DocumentationConfig,
	LogoutConfig,
	LoginConfig,
	RegisterConfig,
	LogoutConfig,
	CallbackConfig,
	AdmobiConfig,
	
];

const routes = [
	// if you want to make whole app auth protected by default change defaultAuth for example:
	// ...FuseUtils.generateRoutesFromConfigs(routeConfigs, ['admin','staff','user']),
	// The individual route configs which has auth option won't be overridden.
	// ...FuseUtils.generateRoutesFromConfigs(routeConfigs, null),
	...FuseUtils.generateRoutesFromConfigs(routeConfigs, ['admin','staff','user']),
	{
		path: '/',
		exact: true,
		component: () => <Redirect to="/admobi/devicelist" />
	},
	{
		path: '/admobi/userdatalist',
		component: () => <Redirect to = "/admobi/userdatalist" />
	},
	// console.log(username);
	// {
	// 	path: '/EditUser',
	// 	component: () => <Redirect to = "/admobi/EditUser" />
	// },
	{
		component: () => <Redirect to="/pages/errors/error-404" />
	}
];


{/* <Route path={"/"} component={RootPage}></Route> */}

export default routes;
