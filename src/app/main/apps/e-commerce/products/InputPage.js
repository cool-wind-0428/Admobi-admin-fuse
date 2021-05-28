import React, { Component, useState, useEffect } from 'react';
import { makeStyles, useTheme } from '@material-ui/core/styles';
import Form from 'react-bootstrap/Form';
import 'bootstrap/dist/css/bootstrap.css';
import firebaseService from 'app/services/firebaseService';
import { LinearProgress } from '@material-ui/core';
import ToolbarMenu from '../../scrumboard/board/dialogs/card/toolbar/ToolbarMenu';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import FormControl from '@material-ui/core/FormControl';
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
//import Select from 'react-select';
import Select from '@material-ui/core/Select';
import makeAnimated from 'react-select/animated';
import Formsy from 'formsy-react';
import { TextFieldFormsy } from '@fuse/core/formsy';
import { createMuiTheme, withStyles, ThemeProvider } from '@material-ui/core/styles';
import UserTable from './UsersTable';
// import { userRef } from 'app/services/service';
import { MDBContainer, MDBBtn, MDBModal, MDBModalBody, MDBModalHeader, MDBModalFooter } from 'mdbreact';
import Chip from '@material-ui/core/Chip';
import logger from 'redux-logger';

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

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: 250,
    },
  },
};

function getStyles(name, personName, theme) {
	function isSelected(){
		if(personName instanceof Array){
			for(var key in personName){
				var value = personName[key];
				if(value.value == name) return true;
			}
		}
		return false;
	}
	 console.log(personName);
	 console.log(name+' '+isSelected())
	return {
	  fontWeight:
		!isSelected()
		  ? theme.typography.fontWeightRegular
		  : theme.typography.fontWeightMedium,
	};
}

export default function InputPage(props) {
	const [state, setState] = useState(props.currentItem.data);
	const [paths, setItems] = useState([]);
	// const [paths1, setItems2] = useState([]);
	// const [allList, setItem3] = useState([]);

	const [selectedOptions, setSelectedOptions] = useState([]);

	const [items1, setItems1] = useState([]);

	useEffect(() => {

		const getPaths = async () =>{
			let ar = [];
			ar.push("admobi");
			var paths = [];

			while((ar.length > 0)){
				let k = ar.pop();
				
				const storageRef = firebase.storage().ref(k);
				const lists = await storageRef.listAll();
				
				const paths2 = lists.prefixes.map(({ fullPath }) => ({
					value: fullPath,
					label: fullPath
				}));
	
				var i = 0;
				for(i = 0;i < paths2.length;i++){
					ar.push(paths2[i].label);
				}
				paths = [...paths, ...paths2];	

			}
			setItems(paths);
		
		};

		getPaths();

	}, []);


	useEffect(() => {
		const value1 = state.photoURL;
		if (value1 && value1.length !== 0) {
			const formattedOption = value1.reduce((finalArry, currentItem) => {
				const formattedItem = currentItem;
				// {
				// 	value: currentItem,
				// 	label: currentItem
				// };
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
		setSelectedOptions(selectedOptions.target.value);
	};
	const classes = useStyles();
  	const theme = useTheme();
	const [personName, setPersonName] = React.useState([]);

	const names = [
		'Oliver Hansen',
		'Van Henry',
		'April Tucker',
		'Ralph Hubbard',
		'Omar Alexander',
		'Carlos Abbott',
		'Miriam Wagner',
		'Bradley Wilkerson',
		'Virginia Andrews',
		'Kelly Snyder',
	];

	const handleChange = (event) => {
		setPersonName(event.target.value);
	};

	// const handleChange = (event) => {
	// 	setPersonName(event.target.value);
	// };

	const handleChangeMultiple = (event) => {
		const { options } = event.target;
		const value = [];
		for (let i = 0, l = options.length; i < l; i += 1) {
		if (options[i].selected) {
			value.push(options[i].value);
		}
		}
		setPersonName(value);
	};
	const animatedComponents = makeAnimated();
	const [value, setValue] = useState();
	const StoreTitle = () => {
		console.log('selectedOptions', selectedOptions);
		let optionArray = [];
		if (selectedOptions) {
			optionArray = selectedOptions.reduce((finallArray, currentItem) => {
				finallArray.push(currentItem);
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
			<DialogContent classes={{ root: 'p-16 pb-0 sm:p-24 sm:pb-0' }} style={{minHeight:"80vh"}}>
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
				<FormControl style={{width:"100%"}}>
					<Select
						labelId="demo-mutiple-chip-label"
						id="demo-mutiple-chip"
						multiple
						value={selectedOptions}
						onChange={onChange}
						input={<Input id="select-multiple-chip" />}
						renderValue={(selected) => (
							<div className={classes.chips}>
								{selected.map((value) => (
									<Chip key={value} label={value} className={classes.chip} />
								))}
							</div>
						)}
						MenuProps={MenuProps}

					>
						
						{paths.length == 0 ? <LinearProgress color="secondary" /> : paths.map((path) => (
							<MenuItem key={path.value} value={path.value} style={getStyles(path.value, selectedOptions, theme)} selected={true}>
								{`${path.value}`}
							</MenuItem>
						))}
						
						
					</Select>
				</FormControl>
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
