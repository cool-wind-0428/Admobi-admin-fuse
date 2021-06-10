import DemoContent from '@fuse/core/DemoContent';
import FusePageCarded from '@fuse/core/FusePageCarded';
import Hidden from '@material-ui/core/Hidden';
import Icon from '@material-ui/core/Icon';
import IconButton from '@material-ui/core/IconButton';
import { makeStyles } from '@material-ui/core/styles';
import React, { useState, useRef } from 'react';
import ProductsTable from '../main/apps/e-commerce/products/ProductsTable';
import Button from '@material-ui/core/Button';
import firebaseService from 'app/services/firebaseService';
import Input from '@material-ui/core/Input';
import Paper from '@material-ui/core/Paper';

const useStyles = makeStyles(theme => ({
	layoutRoot: {},
	root: {
		position: 'fixed',
		width: '100%',
		zIndex: 100,
		'& > *': {
			margin: theme.spacing(0.5)
		}
	},
	input: {
		display: 'none'
	}
}));
function CardedLeftSidebarSample() {
	const classes = useStyles();
	const pageLayout = useRef(null);
	const [selected, setSelected] = useState([]);
	const [updateFlagList, setUpdateFlagList] = useState([]);
	const [showImages, setShowImages] = useState([]);
	const [onLoading, setLoading] = useState(false);
	const [onlineDevice, setOnlineDevice] = useState('');
	const [offlineDevice, setOfflineDevice] = useState('');
	const [searchKey, setSearchKey] = useState('');

	function onCheckEvent(selected) {
		setSelected(selected);
	}

	function showSelectedImages() {
		setShowImages(selected);
	}

	function updateFlag() {
		setUpdateFlagList(selected);
	}

	async function getFolderNameById(item) {
		const ref = firebaseService.db.ref(item);
		const n = await ref.once('value');
		const data = n.val();
		return data.uploadFolder;
	}

	async function handleImageAsFile(e) {
		setLoading(true);
		for (let index = 0; index < selected.length; index++) {
			let folder = await getFolderNameById(selected[index]);
			const images = e.target.files;
			for (let i = 0; i < images.length; i++) {
				await firebaseService.storage.ref(`admobi/${folder}/${images[i].name}`).put(images[i]);
			}
		}
		setLoading(false);
	}

	async function updateWiFiFlag() {
		for (let i = 0; i < selected.length; i++) {
			const ref = firebaseService.db.ref(`${selected[i]}/wifiFlag`);
			const n = await ref.once('value');
			const flag = n.val();
			await firebaseService.db.ref(`${selected[i]}/wifiFlag`).set(flag + 1);
			firebaseService.db
				.ref(`${selected[i]}/wifiFlag`)
				.orderByChild('updatedAt')
				.on('value', function (result) {
					if (result.val() == 0) {
						if (onlineDevice) {
							setOnlineDevice('');
						}
						setOnlineDevice(selected[i]);
					} else {
						if (offlineDevice) {
							setOfflineDevice('');
						}
						setOfflineDevice(selected[i]);
					}
				});
		}
	}

	const buttonStyle = { fontWeight: '900', boxShadow: '0px 1px 10px #dbdbdb' };

	return (
		<FusePageCarded
			classes={{
				root: classes.layoutRoot
			}}
			header={
				<div className="flex flex-col flex-1">
					<div className="flex items-center py-24">
						<Hidden lgUp>
							<IconButton
								onClick={ev => pageLayout.current.toggleLeftSidebar()}
								aria-label="open left sidebar"
							>
								<Icon>menu</Icon>
							</IconButton>
						</Hidden>
						{/* hidden by Serhii */}
						<div className="flex">
							<h5>AQUI VOCÊ PODE VER E MODIFICAR OS ARQUIVOS DE UM OU MAIS DISPOSITIVOS SELECIONADOS</h5>
						</div>
					</div>
				</div>
			}
			showNavigation={true}
			contentToolbar={
				<div className="px-24">
					<h4>EDITAR PUBLICIDADES DA PASTA</h4>
				</div>
			}
			content={
				<div className="p-24">
					<h4>ARQUIVOS</h4>
					<br />
					<DemoContent selectedId={showImages} onLoading={onLoading} />
				</div>
			}
			leftSidebarHeader={
				<div className={classes.root}>
					{selected.length ? (
						<>
							<input
								accept="image/*, video/*"
								className={classes.input}
								id="contained-button-file"
								multiple
								type="file"
								onChange={handleImageAsFile}
							/>
							<Button style={buttonStyle} variant="contained" onClick={updateWiFiFlag}>
								VERIFICAR STATUS WI‐FI
							</Button>
							<Button style={buttonStyle} variant="contained" color="secondary" onClick={updateFlag}>
								ENVIAR MODIFICAÇÕES
							</Button>
							<label style={buttonStyle} htmlFor="contained-button-file">
								<Button variant="contained" component="span">
									ADICIONAR PUBLICIDADES
								</Button>
							</label>
							<Button
								style={buttonStyle}
								variant="contained"
								color="secondary"
								onClick={showSelectedImages}
							>
								EXIBIR PUBLICIDADES
							</Button>
						</>
					) : (
						<>
							<Button style={buttonStyle} variant="contained">
								VERIFICAR STATUS WI‐FI
							</Button>
							<Button style={buttonStyle} variant="contained" color="secondary">
								ENVIAR MODIFICAÇÕES
							</Button>
							<Button style={buttonStyle} variant="contained" component="span">
								ADICIONAR PUBLICIDADES
							</Button>
							<Button style={buttonStyle} variant="contained" color="secondary">
								EXIBIR PUBLICIDADES
							</Button>
						</>
					)}
					<Paper className="flex items-center w-full max-w-512 px-8 py-4 rounded-8 shadow">
						<Icon color="action">search</Icon>
						<Input
							placeholder="PESQUISAR ESTABELECIMENTO"
							className="flex flex-1 mx-8"
							disableUnderline
							fullWidth
							value={searchKey}
							inputProps={{
								'aria-label': 'Search'
							}}
							onChange={ev => setSearchKey(ev.target.value)}
						/>
					</Paper>
				</div>
			}
			leftSidebarContent={
				<div className="p-24">
					<h4>SELECIONE O DISPOSITIVO</h4>
					<ProductsTable
						onLoading={onLoading}
						onCheckEvent={onCheckEvent}
						updateFlagList={updateFlagList}
						onlineDevice={onlineDevice}
						offlineDevice={offlineDevice}
						searchKey={searchKey}
					/>
				</div>
			}
			ref={pageLayout}
		/>
	);
}

export default CardedLeftSidebarSample;
