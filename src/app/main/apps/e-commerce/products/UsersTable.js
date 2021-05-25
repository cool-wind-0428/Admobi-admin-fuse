import FuseScrollbars from '@fuse/core/FuseScrollbars';
import _ from '@lodash';
import Checkbox from '@material-ui/core/Checkbox';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Icon from '@material-ui/core/Icon';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import { IconButton } from '@material-ui/core';
import EditRoundedIcon from '@material-ui/icons/EditRounded';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TablePagination from '@material-ui/core/TablePagination';
import TableRow from '@material-ui/core/TableRow';
import Typography from '@material-ui/core/Typography';
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { withRouter } from 'react-router-dom';
import FuseLoading from '@fuse/core/FuseLoading';
import FuseAnimate from '@fuse/core/FuseAnimate/FuseAnimate';
import UsersTableHead from './UsersTableHead';
import firebaseService from 'app/services/firebaseService';
import { makeStyles } from '@material-ui/core/styles';
import Input from './InputPage';

function UsersTable(props) {
	const [defailtDeviceList, setDefaultDeviceList] = useState([]);
	const [devicelists, setDeviceData] = useState([]);
	const [loading, setLoading] = useState(true);
	const [selected, setSelected] = useState([]);
	const [page, setPage] = useState(0);
	const [rowsPerPage, setRowsPerPage] = useState(5);
	const [currentRow, setCurrentRow] = useState('');
	const [order, setOrder] = useState({
		direction: 'asc',
		id: null
	});
	const [modal, setModal] = useState(false);

	const user = useSelector(({ auth }) => auth.user);

	const useStyles = makeStyles(theme => ({
		modal: {
			display: 'flex',
			alignItems: 'center',
			justifyContent: 'center'
		},
		paper: {
			position: 'absolute',
			width: 450,
			backgroundColor: theme.palette.background.paper,
			boxShadow: theme.shadows[5],
			padding: theme.spacing(2, 4, 3)
		},
		successIcon: {
			color: 'green',
		},
		errorIcon: {
			color: 'red',
		},
	}))();

	const [flag, setFlag] = useState(false);

	useEffect(() => {
		setLoading(props.onLoading);
	}, [props.onLoading]);

	useEffect(() => {
		setRowsPerPage(10);
		loadDeviceList();
	}, []);

	useEffect(() => {
		let temp = devicelists;
		for (let i = 0; i < temp.length; i++) {
			if (temp[i].deviceId == props.onlineDevice) {
				temp[i].wifiFlag = 0;
				setDeviceData(temp);
				setFlag(!flag);
			}
		}
	}, [props.onlineDevice]);

	useEffect(() => {
		if (props.searchKey == '') setDeviceData(defailtDeviceList);
		else {
			const filteredArr = defailtDeviceList.filter(ele => {
				let temp = ele.uploadFolder;
				if (temp) {
					if (temp.indexOf(props.searchKey) !== -1) {
						return ele;
					}
				}
			});
			setDeviceData(filteredArr);
		}
	}, [props.searchKey]);

	useEffect(() => {
		let temp = devicelists;
		if (props.offlineDevice != '') {
			for (let i = 0; i < temp.length; i++) {
				if (temp[i].deviceId == props.offlineDevice) {
					temp[i].wifiFlag = 1;
					setDeviceData(temp);
					setFlag(!flag);
				}
			}
		}
	}, [props.offlineDevice]);

	useEffect(() => {
		if (props.updateFlagList) {
			for (const item of props.updateFlagList) {
				firebaseService.db.ref(`${item}/updateFlag`).set(1);
			}
			loadDeviceList();
		}
	}, [props.updateFlagList]);

	const handleClickEdit = (item, key) => {
		var newItem = {};
		for(var a in devicelists)
		{
			var device = devicelists[a];
			if(device.uid == item.uid)
			{
				setCurrentRow(device);
				setModal(true);
				return;
			}
		}
	};

	function loadDeviceList() {
		const result = [];
		const ref = firebaseService.db.ref('users');
		ref.once('value').then(n => {
			const data = n.val();
			Object.keys(data).map(key => {
				result.push(data[key]);
			});
			setData1(result);
		});
	}

	function setData1(data) {
		setLoading(false);
		setDefaultDeviceList(data);
		setDeviceData(data);
	}

	function handleRequestSort(event, property) {
		const id = property;
		let direction = 'desc';

		if (order.id === property && order.direction === 'desc') {
			direction = 'asc';
		}

		setOrder({
			direction,
			id
		});
	}

	function handleSelectAllClick(event) {
		if (event.target.checked) {
			props.onCheckEvent(devicelists.map((n, key) => n.uid));
			setSelected(devicelists.map((n, key) => n.uid));
			return;
		}
		props.onCheckEvent([]);
		setSelected([]);
	}

	function handleDeselect() {
		setSelected([]);
	}

	function handleCheck(event, id) {
		const selectedIndex = selected.indexOf(id);
		let newSelected = [];

		if (selectedIndex === -1) {
			newSelected = newSelected.concat(selected, id);
		} else if (selectedIndex === 0) {
			newSelected = newSelected.concat(selected.slice(1));
		} else if (selectedIndex === selected.length - 1) {
			newSelected = newSelected.concat(selected.slice(0, -1));
		} else if (selectedIndex > 0) {
			newSelected = newSelected.concat(selected.slice(0, selectedIndex), selected.slice(selectedIndex + 1));
		}
		setSelected(newSelected);
		props.onCheckEvent(newSelected);
	}

	function handleChangePage(event, value) {
		setPage(value);
	}

	function handleChangeRowsPerPage(event) {
		setRowsPerPage(event.target.value);
	}

	const delete_row = (event, n) => {
		event.preventDefault();
		firebaseService.db.ref(`users/${n.uid}`).remove();
		loadDeviceList();
	};

	if (loading) {
		return <FuseLoading />;
	}

	if (devicelists.length === 0) {
		return (
			<FuseAnimate delay={100}>
				<div className="flex flex-1 items-center justify-center h-full">
					<Typography color="textSecondary" variant="h5">
						There are no users!
					</Typography>
				</div>
			</FuseAnimate>
		);
	}
	if (user.data.email == 'brzden32@gmail.com') {
		return (
			<div className="w-full flex flex-col">
				<FuseScrollbars className="flex-grow overflow-x-auto">
					<Table stickyHeader className="min-w-xl" aria-labelledby="tableTitle">
						<UsersTableHead
							selectedProductIds={selected}
							order={order}
							onSelectAllClick={handleSelectAllClick}
							onRequestSort={handleRequestSort}
							rowCount={devicelists.length}
							onMenuItemClick={handleDeselect}
						/>

						<TableBody>
							{_.orderBy(
								devicelists,
								[
									o => {
										switch (order.id) {
											default: {
												return o[order.id];
											}
										}
									}
								],
								[order.direction]
							)
								.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
								.map(n => {
									const isSelected = selected.indexOf(n.data.displayName) !== -1;
									return (
										<TableRow
											className="h-64 cursor-pointer"
											hover
											role="checkbox"
											aria-checked={isSelected}
											tabIndex={-1}
											key={n.data.displayName}
											selected={isSelected}
											onClick={event => handleCheck(event, n.data.displayName)}
										>
											<TableCell className="w-40 md:w-64 text-center" padding="none">
												<Checkbox
													checked={isSelected}
													onClick={event => event.stopPropagation()}
													onChange={event => handleCheck(event, n.data.displayName)}
												/>
											</TableCell>

											<TableCell
												className="w-52 px-4 md:px-0"
												component="th"
												scope="row"
												padding="none"
											>
												<img
													className="w-full block rounded"
													src="assets/images/avatars/profile.png"
													alt={n.name}
												/>
											</TableCell>

											<TableCell className="w-40 md:w-100" component="th" scope="row">
												{n.data.displayName}
											</TableCell>

											<TableCell className="w-40 md:w-100" component="th" scope="row">
												{n.data.email}
											</TableCell>

											<TableCell className="w-40 md:w-100" component="th" scope="row">
												{n.data.photoURL &&
													n.data.photoURL.map(photourl => {
														return <p>{photourl}&nbsp&nbsp</p>;
												})}
											</TableCell>
											<TableCell className="w-40 md:w-100 text-left" component="th" scope="row">
												<Button onClick={() => handleClickEdit(n)}>
													<Icon className="text-green text-20">edit</Icon>
												</Button>
											</TableCell>
										</TableRow>
									);
								})}
						</TableBody>
					</Table>
					<Dialog
						open={modal}
						onClose={() => setModal(false)}
						fullWidth
						maxWidth="xs"
						component="form"
						classes={{
							paper: 'rounded-8'
						}}
					>
						<AppBar position="static">
							<Toolbar className="flex w-full">
								<Typography variant="subtitle1" color="inherit">
									{'Edit User'}
								</Typography>
							</Toolbar>
						</AppBar>
						<div
							style={{
								backgroundColor: 'white',
								width: 400,
								height: 500,
								padding: 30
							}}
						>
							<h1>Edit User</h1>
							<Input currentItem={currentRow} 
							onUpdate={() => 
								{
									setModal(false);
									loadDeviceList()
								}
								} />
						</div>
					</Dialog>
				</FuseScrollbars>

				<TablePagination
					className="flex-shrink-0 border-t-1"
					component="div"
					count={devicelists.length}
					rowsPerPage={rowsPerPage}
					page={page}
					backIconButtonProps={{
						'aria-label': 'Previous Page'
					}}
					nextIconButtonProps={{
						'aria-label': 'Next Page'
					}}
					onChangePage={handleChangePage}
					onChangeRowsPerPage={handleChangeRowsPerPage}
				/>
				<br />
				<br />
			</div>
		);
	} else {
		var devicelistsFormed = devicelists.map((device)=>{
			return {uid:device.uid, displayName:device.data.displayName, email:device.data.email, photoURL:(device.data.photoURL instanceof Array ? device.data.photoURL.join(','):device.data.photoURL)};
		})
		
		return (
			<div className="w-full flex flex-col" style={{width:"100%"}}>
				<FuseScrollbars className="flex-grow overflow-x-auto">
					<Table stickyHeader className="min-w-xl" aria-labelledby="tableTitle">
						<UsersTableHead
							selectedProductIds={selected}
							order={order}
							onSelectAllClick={handleSelectAllClick}
							onRequestSort={handleRequestSort}
							rowCount={devicelistsFormed.length}
							onMenuItemClick={handleDeselect}
						/>

						<TableBody>
							{_.orderBy(
								devicelistsFormed,
								[
									o => {
										switch (order.id) {
											case 'username':{
												return o['displayName'];
											}
											case 'donwload_folder':{
												return o['photoURL'];
											}
											default: {
												return o[order.id];
											}
										}
									}
								],
								[order.direction]
							)
								.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
								.map((n, key) => {
									const isSelected = selected.indexOf(n.uid) !== -1;
									return (
										<TableRow
											className="h-64 cursor-pointer"
											hover
											role="checkbox"
											aria-checked={isSelected}
											tabIndex={-1}
											key={n.uid}
											selected={isSelected}
											onClick={event => handleCheck(event, n.uid)}
										>
											<TableCell className="w-40 md:w-64 text-center" padding="none">
												<Checkbox
													checked={isSelected}
													onClick={event => event.stopPropagation()}
													onChange={event => handleCheck(event, n.uid)}
												/>
											</TableCell>

											<TableCell
												className="w-52 px-4 md:px-0"
												component="th"
												scope="row"
												padding="none"
											>
												<img
													className="w-full block rounded"
													src="assets/images/avatars/profile.png"
													alt={n.name}
												/>
											</TableCell>

											<TableCell className="w-40 md:w-100" component="th" scope="row">
												{n.displayName}
											</TableCell>

											<TableCell className="w-40 md:w-100" component="th" scope="row">
												{n.email}
											</TableCell>

											<TableCell className="w-40 md:w-100" component="th" scope="row">
												{/* {n.data.photoURL} */}
												{n.photoURL && n.photoURL
													// n.photoURL.map(photourl => {
													// 	return <p>{photourl}</p>;
													// })
												}
											</TableCell>
											<TableCell className="w-40 md:w-100 text-left" component="th" scope="row">
												<IconButton  className={useStyles.successIcon} aria-label="add to shopping cart" onClick={() => handleClickEdit(n,key)}>
													<EditRoundedIcon></EditRoundedIcon>
												</IconButton >
											</TableCell>
										</TableRow>
									);
								})}
						</TableBody>
					</Table>
				</FuseScrollbars>
				<Dialog
					open={modal}
					onClose={() => setModal(false)}
					fullWidth
					maxWidth="xs"
					component="form"
					classes={{
						paper: 'rounded-8'
					}}
				>
					<AppBar position="static">
						<Toolbar className="flex w-full">
							<Typography variant="subtitle1" color="inherit">
								{'Edit User'}
							</Typography>
						</Toolbar>
					</AppBar>
					<Input currentItem={currentRow} onUpdate={() => {setModal(false); loadDeviceList()}} />
				</Dialog>

				<TablePagination
					className="flex-shrink-0 border-t-1"
					component="div"
					count={devicelists.length}
					rowsPerPage={rowsPerPage}
					page={page}
					backIconButtonProps={{
						'aria-label': 'Previous Page'
					}}
					nextIconButtonProps={{
						'aria-label': 'Next Page'
					}}
					onChangePage={handleChangePage}
					onChangeRowsPerPage={handleChangeRowsPerPage}
				/>
				<br />
				<br />
			</div>
		);
	}
}

export default withRouter(UsersTable);

export function reload_page() {
	window.location.reload();
}
