import React, { Component, useState, useEffect } from 'react';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import 'bootstrap/dist/css/bootstrap.css';
import firebaseService from 'app/services/firebaseService';
import firebase from 'firebase/app';
import Select from 'react-select';
import makeAnimated from 'react-select/animated';
import UserTable from './UsersTable';
// import { userRef } from 'app/services/service';
import { MDBContainer, MDBBtn, MDBModal, MDBModalBody, MDBModalHeader, MDBModalFooter } from 'mdbreact';

export default function InputPage(props) {
	const [state, setState] = useState(props.currentItem.data);
	const [paths, setItems] = useState([]);
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
		setSelectedOptions(selectedOptions);
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
		<div className="form-wrapper">
			<Form.Group controlId="Name">
				<Form.Label>UserName</Form.Label>
				<Form.Control
					type="text"
					value={state.displayName}
					onChange={e => setState({ ...state, displayName: e.target.value })}
				/>
			</Form.Group>

			<Form.Group controlId="Email">
				<Form.Label>Email</Form.Label>
				<Form.Control
					type="email"
					value={state.email}
					onChange={e => setState({ ...state, email: e.target.value })}
				/>
			</Form.Group>
			<br></br>
			<br></br>
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
			<br></br>
			<br></br>
			<br></br>

			<Button variant="danger" size="lg" block="block" type="submit" onClick={() => StoreTitle()}>
				Update Data
			</Button>
		</div>
	);
}

export function reload_page() {
	window.location.reload();
}
