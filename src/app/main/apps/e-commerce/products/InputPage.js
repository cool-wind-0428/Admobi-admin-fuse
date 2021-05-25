import React, { Component, useState, useEffect } from 'react';
import { makeStyles, useTheme } from '@material-ui/core/styles';
import Form from 'react-bootstrap/Form';
import 'bootstrap/dist/css/bootstrap.css';
import firebaseService from 'app/services/firebaseService';
import ToolbarMenu from '../../scrumboard/board/dialogs/card/toolbar/ToolbarMenu';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import Input from '@material-ui/core/Input';
import MenuItem from '@material-ui/core/MenuItem';
import Checkbox from '@material-ui/core/Checkbox';
import firebase from 'firebase/app';
import { useForm } from '@fuse/hooks';
import FuseUtils from '@fuse/utils/FuseUtils';
import AppBar from '@material-ui/core/AppBar';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Icon from '@material-ui/core/Icon';
import IconButton from '@material-ui/core/IconButton';
import Switch from '@material-ui/core/Switch';
import TextField from '@material-ui/core/TextField';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import Select from 'react-select';
//import Select from '@material-ui/core/Select';
import makeAnimated from 'react-select/animated';
import Formsy from 'formsy-react';
import { TextFieldFormsy } from '@fuse/core/formsy';
import { createMuiTheme, withStyles, ThemeProvider } from '@material-ui/core/styles';
import UserTable from './UsersTable';
// import { userRef } from 'app/services/service';
import { MDBContainer, MDBBtn, MDBModal, MDBModalBody, MDBModalHeader, MDBModalFooter } from 'mdbreact';

const useStyles = makeStyles((theme) => ({
	formControl: {
	  margin: theme.spacing(1),
	  minWidth: 120,
	  maxWidth: 300,
	},
	chips: {
	  display: 'flex',
	  flexWrap: 'wrap',
	},
	chip: {
	  margin: 2,
	},
	noLabel: {
	  marginTop: theme.spacing(3),
	},
}));

function getStyles(name, personName, theme) {
	return {
	  fontWeight:
		personName.indexOf(name) === -1
		  ? theme.typography.fontWeightRegular
		  : theme.typography.fontWeightMedium,
	};
}

export default function InputPage(props) {
	const [state, setState] = useState(props.currentItem.data);
	const [paths, setItems] = useState([]);
	const classes = useStyles();
  	const theme = useTheme();
	// const [paths1, setItems2] = useState([]);
	// const [allList, setItem3] = useState([]);

	const [selectedOptions, setSelectedOptions] = useState([]);

	const [items1, setItems1] = useState([]);

	useEffect(async () => {
		const storageRef = firebase.storage().ref('admobi');
		// const storageRef2 = firebase.storage().ref().child('admobi/Rio Grande do Sul');
		// const storageRef3 = firebase.storage().ref().child('admobi/Rio Grande do Sul/Guaiba');
		// const storageRef4 = firebase.storage().ref().child('admobi/Rio Grande do Sul/Porto Alegre');
		// const storageRef5 = firebase.storage().ref().child('admobi/Rio Grande do Sul/Porto Alegre/Casa dus guri');		
		// const storageRef6 = firebase.storage().ref().child('admobi/Rio Grande do Sul/Guaiba/RESTAURANTE WANG');
		// const storageRef7 = firebase.storage().ref().child('admobi/Rio Grande do Sul/Guaiba/Social Club');
		// const storageRef8 = firebase.storage().ref().child('admobi/Teste Pedro/Imagens1');
		// const storageRef9 = firebase.storage().ref().child('admobi/update_test/1Test');

		const lists = await storageRef.listAll();
		// const lists2 = await storageRef2.listAll();
		// const lists3 = await storageRef3.listAll();
		// const lists4 = await storageRef4.listAll();
		// const lists5 = await storageRef5.listAll();
		// const lists6 = await storageRef6.listAll();
		// const lists7 = await storageRef7.listAll();
		// const lists8 = await storageRef8.listAll();
		// const lists9 = await storageRef9.listAll();		
		// const allList = lists;
		console.log("lists---------------------------------",lists);
		const paths = lists.prefixes.map(({ fullPath }) => ({
			value: fullPath,
			label: fullPath
		}));
		// const paths1 = lists2.prefixes.map(({ fullPath }) => ({
		// 	value: fullPath,
		// 	label: fullPath
		// }));
		// const paths3 = lists3.prefixes.map(({ fullPath }) => ({
		// 	value: fullPath,
		// 	label: fullPath
		// }));
		// const paths4 = lists4.prefixes.map(({ fullPath }) => ({
		// 	value: fullPath,
		// 	label: fullPath
		// }));
		// const paths5 = lists5.prefixes.map(({ fullPath }) => ({
		// 	value: fullPath,
		// 	label: fullPath
		// }));
		// const paths6 = lists6.prefixes.map(({ fullPath }) => ({
		// 	value: fullPath,
		// 	label: fullPath
		// }));
		// const paths7 = lists7.prefixes.map(({ fullPath }) => ({
		// 	value: fullPath,
		// 	label: fullPath
		// }));	
		
		// const paths8 = lists8.prefixes.map(({ fullPath }) => ({
		// 	value: fullPath,
		// 	label: fullPath
		// }));		
		// const paths9 = lists9.prefixes.map(({ fullPath }) => ({
		// 	value: fullPath,
		// 	label: fullPath
		// }));
		
		// let allList = paths.push(paths1);
		// Array.prototype.push.apply(paths,paths1);
		// Array.prototype.push.apply(paths,paths3);
		// Array.prototype.push.apply(paths,paths4);
		// Array.prototype.push.apply(paths,paths5);
		setItems(paths);
		// console.log('2222222222222222', pathx);
	}, []);

	useEffect(() => {
		const value1 = state.photoURL;
		if (value1 && value1.length !== 0) {
			const formattedOption = value1.reduce((finalArry, currentItem) => {
				const formattedItem = {
					value: currentItem,
					label: currentItem
				};
				finalArry.push(formattedItem);
				return finalArry;
			}, []);
			setSelectedOptions(formattedOption);
		}
	}, []);

	const toggle = nr => () => {
		let modalNumber = 'modal' + nr;
		this.setState({
			[modalNumber]: !this.state[modalNumber]
		});
	};

	const onChange = selectedOptions => {
		//console.log(selectedOptions);
		setSelectedOptions(selectedOptions);
	};
	const handleChangeMultiple = (event) => {
		const { options } = event.target;
		const value = [];
		for (let i = 0, l = options.length; i < l; i += 1) {
		  if (options[i].selected) {
			value.push({value:options[i].value, label:options[i].value});
		  }
		}
		setSelectedOptions(value);
	};
	const animatedComponents = makeAnimated();
	const [value, setValue] = useState();
	const StoreTitle = () => {
		console.log('selectedOptions', selectedOptions);
		let optionArray = [];
		if (selectedOptions) {
			optionArray = selectedOptions.reduce((finallArray, currentItem) => {
				finallArray.push(currentItem.value);
				return finallArray;
			}, []);
		}
		console.log('props.currentItem.data:', props.currentItem.data);
		const updatedUser = {
			displayName: state.displayName,
			email: state.email,
			photoURL: optionArray,
			settings: props.currentItem.data.settings,
			shortcuts: props.currentItem.data.shortcuts
		};
		console.log('updatedUser:', updatedUser);
		firebaseService.db.ref(`users/${props.currentItem.uid}/data`).update(updatedUser);
		props.onUpdate();
	};

	return (
		<>
			<DialogContent classes={{ root: 'p-16 pb-0 sm:p-24 sm:pb-0' }} style={{minHeight:"300px"}}>
				<TextField
					id="title"
					label="Title"
					className="mt-8 mb-16"
					InputLabelProps={{
						shrink: true
					}}
					name="title"
					value={state.displayName}
					onChange={e => setState({ ...state, displayName: e.target.value })}
					variant="outlined"
					autoFocus
					required
					fullWidth
				/>
				{/* <Select
					isMulti
					name="colors"
					options={paths}
					className="basic-multi-select"
					value={selectedOptions}
					classNamePrefix="select"
					onChange={selectedOptions => onChange(selectedOptions)}
					closeMenuOnSelect={false}
					components={animatedComponents}
				/> */}
				{/* <Select
					labelId="demo-mutiple-checkbox-label"
					id="demo-mutiple-checkbox"
					multiple
					value={selectedOptions}
					onChange={selectedOptions => handleChangeMultiple(selectedOptions)}
					input={<Input />}
					renderValue={(selectedOptions) => {
						var tmp = selectedOptions.map((option) => option.value);
						return tmp.join(', ')
					}}
					// MenuProps={paths}
					>
					{paths.map((name) => (
						<MenuItem key={name.value} value={name.value}>
							<Checkbox checked={selectedOptions.indexOf(name) > -1} />
							<ListItemText primary={name.value} />
						</MenuItem>
					))}
				</Select> */}
				<Select
					isMulti
					name="colors"
					options={paths}
					className="basic-multi-select"
					value={selectedOptions}
					classNamePrefix="select"
					onChange={selectedOptions => onChange(selectedOptions)}
					closeMenuOnSelect={false}
					components={animatedComponents}
				/>
			</DialogContent>
			<DialogActions className="justify-between px-8 sm:px-16">
				<Button variant="contained" color="primary" type="submit" onClick={() => StoreTitle()}>
					Add
				</Button>
			</DialogActions>
		</>
		// <div className="form-wrapper">
		// 	<Form.Group controlId="Name">
		// 		<Form.Label>UserName</Form.Label>
		// 		<Form.Control
		// 			type="text"
		// 			value={state.displayName}
		// 			onChange={e => setState({ ...state, displayName: e.target.value })}
		// 		/>
		// 	</Form.Group>

		// 	{/* <Form.Group controlId="Email">
		// 		<Form.Label>Email</Form.Label>
		// 		<Form.Control
		// 			type="email"
		// 			value={state.email}
		// 			onChange={e => setState({ ...state, email: e.target.value })}
		// 		/>
		// 	</Form.Group> */}
		// 	<br></br>
		// 	<br></br>
		// 	<Select
		// 		isMulti
		// 		name="colors"
		// 		options={paths}
		// 		className="basic-multi-select"
		// 		value={selectedOptions}
		// 		classNamePrefix="select"
		// 		onChange={selectedOptions => onChange(selectedOptions)}
		// 		closeMenuOnSelect={false}
		// 		components={animatedComponents}
		// 	/>
		// 	<br></br>
		// 	<br></br>
		// 	<br></br>

		// 	<Button variant="danger" size="lg" block="block" type="submit" onClick={() => StoreTitle()}>
		// 		Update Data
		// 	</Button>
		// </div>
	);
}

export function reload_page() {
	window.location.reload();
}
