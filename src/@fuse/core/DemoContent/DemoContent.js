import React, { useEffect, useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import GridList from '@material-ui/core/GridList';
import GridListTile from '@material-ui/core/GridListTile';
import GridListTileBar from '@material-ui/core/GridListTileBar';
import ListSubheader from '@material-ui/core/ListSubheader';
import IconButton from '@material-ui/core/IconButton';
import DeleteForeverIcon from '@material-ui/icons/DeleteForever';
import EditIcon from '@material-ui/icons/Edit';
import firebaseService from 'app/services/firebaseService';
import { func } from 'prop-types';
import FuseLoading from '@fuse/core/FuseLoading';
import ReactPlayer from 'react-player';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import FormDialog from '../../../app/admobi/components/formDialog';
import axios from 'axios';
import { result } from 'lodash-es';

const useStyles = makeStyles(theme => ({
	root: {
		display: 'flex',
		flexWrap: 'wrap',
		justifyContent: 'space-around',
		overflow: 'hidden',
		backgroundColor: theme.palette.background.paper,
		'&.Mui-focused': {
			borderBottom: '4px solid #fff',
			fontWeight: '800',
			color: '#fff',
			'& .MuiOutlinedInput-notchedOutline': {
				border: 'none'
			}
		}
	},
	inputlabel: {
		'&.Mui-focused': {
			color: '#ffffff',
			fontWeight: '800'
		}
	},
	gridList: {
		width: 600,
		height: '100%'
	},
	icon: {
		color: 'rgba(255, 255, 255, 0.54)'
	}
}));

function DemoContent(props) {
	const [fileList, setFileList] = useState([]);
	const [loading, setLoading] = useState(false);
	const [folderDuration, setFolderDuration] = useState(0);
	const [modalState, setModalState] = useState({
		showFlag: false,
		fileName: '',
		order: '',
		duration: '',
		fileType: ''
	});
	const [selectedFileObj, setSelectedFileObj] = useState();

	async function loadDeviceList(data) {
		const temp = [];
		for (const folder of data) {
			var listRef = firebaseService.storage.ref(`admobi/${folder}`);
			await listRef.listAll().then(async res => {
				for (const itemRef of res.items) {
					const fileURL = await itemRef.getDownloadURL();
					temp.push({
						img: fileURL,
						title: folder,
						cols: 2,
						featured: true
					});
				}
			});
		}
		setLoading(false);
		getAllDuration(temp);
		setFileList(temp);
		console.log(temp);
	}

	useEffect(() => {
		setLoading(props.onLoading);
		if (!props.onLoading) preLoading();
	}, [props.onLoading]);

	useEffect(async () => {
		preLoading();
	}, [props.selectedId]);

	async function preLoading() {
		setLoading(true);
		let result = [];
		let temp = props.selectedId;
		for (const id of temp) {
			const ref = firebaseService.db.ref(id);
			const n = await ref.once('value');
			const data = n.val();
			if (!result.includes(data.uploadFolder)) result.push(data.uploadFolder);
		}
		loadDeviceList(result);
	}

	const getAllDuration = lists => {
		var result = 0;
		lists.map(tile => {
			var fileObj = firebaseService.storage.refFromURL(tile.img);
			let name = fileObj.name.toString();
			name = name.replace('.png', '');
			name = name.replace('.jpg', '');
			name = name.split('_');
			if (name.length == 3) {
				name[2] = name[2].replace('d', '');
				if (!isNaN(parseInt(name[2]))) {
					result += parseInt(name[2]);
				}
			}
		});
		setFolderDuration(result);
	};

	const isVideo = url => {
		return url.includes('.mp4') || url.includes('.avi');
	};

	const editButtonClick = tile => {
		setSelectedFileObj(tile);
		var fileObj = firebaseService.storage.refFromURL(tile.img);
		let name = fileObj.name.toString();
		let fileType = name.includes('.jpg') ? '.jpg' : '.png';
		if (name.includes('.jpg')) setModalState({ ...modalState, fileType: '.jpg' });
		else if (name.includes('.png')) setModalState({ ...modalState, fileType: '.png' });
		name = name.replace('.png', '');
		name = name.replace('.jpg', '');
		name = name.split('_');
		if (name.length == 3) {
			name[2] = name[2].replace('d', '');
			setModalState({
				...modalState,
				showFlag: true,
				order: name[0],
				name: name[1],
				duration: name[2],
				fileType: fileType
			});
		} else {
			setModalState({ ...modalState, showFlag: true, name: name[0], fileType: fileType });
		}
	};

	const deleteButtonClick = (tile, prompt) => {
		var fileRef = firebaseService.storage.refFromURL(tile.img);
		let b;
		if (prompt) b = window.confirm('VOCÊ TEM CERTEZA QUE DESEJA DELETAR?');
		else {
			b = true;
		}

		if (b) {
			fileRef
				.delete()
				.then(function () {
					preLoading();
				})
				.catch(function (error) {
					alert(error);
				});
		}
	};

	const handleClose = () => {
		setModalState({ ...modalState, showFlag: false });
	};

	function savePhoto() {}

	const handleModalSave = () => {
		setModalState({ ...modalState, showFlag: false });
		setLoading(true);
		let fileName = modalState.order ? modalState.order + '_' : '';
		fileName += modalState.name ? modalState.name + '_' : '';
		fileName += modalState.duration ? 'd' + modalState.duration : '';
		var fileObj = firebaseService.storage.refFromURL(selectedFileObj.img);

		fileObj.getDownloadURL().then(async url => {
			axios({
				method: 'GET',
				url: url,
				responseType: 'blob'
			})
				.then(response => {
					deleteButtonClick(selectedFileObj, false);
					firebaseService.storage
						.ref(`admobi/${selectedFileObj.title}/${fileName}${modalState.fileType}`)
						.put(response.data)
						.then(function (result) {
							setModalState({
								...modalState,
								showFlag: false,
								order: '',
								name: '',
								duration: '',
								fileType: ''
							});
						});
				})
				.catch(err => {
					alert(err);
				});
		});
	};

	const classes = useStyles();

	if (loading) {
		return <FuseLoading />;
	}

	return (
		<div className={classes.root}>
			<GridList cellHeight={150} className={classes.gridList}>
				<GridListTile key="Subheader" cols={2} style={{ height: 'auto' }}>
					<ListSubheader component="div">
						<b>TEMPO TOTAL DE PUBLICIDADE: {folderDuration}s</b>
					</ListSubheader>
				</GridListTile>
				{fileList.map((tile, index) => (
					<GridListTile key={index}>
						{isVideo(tile.img) ? (
							<ReactPlayer
								playing
								url={tile.img}
								width="100%"
								height="100%"
								playing={true}
								controls={false}
							/>
						) : (
							<img src={tile.img} alt={tile.title} />
						)}
						<GridListTileBar
							title={tile.title.slice(0, 7) + '..'}
							actionIcon={
								<>
									<IconButton
										size="small"
										className={classes.icon}
										onClick={() => deleteButtonClick(tile, true)}
									>
										<DeleteForeverIcon />
									</IconButton>

									<IconButton
										size="small"
										className={classes.icon}
										onClick={() => editButtonClick(tile)}
									>
										<EditIcon />
									</IconButton>
								</>
							}
						/>
					</GridListTile>
				))}
			</GridList>
			<Dialog open={modalState.showFlag} onClose={handleClose} aria-labelledby="form-dialog-title">
				<DialogTitle id="form-dialog-title">DETALHES</DialogTitle>
				<DialogContent>
					<DialogContentText>INSIRA A ORDEM, NOME E TEMPO DE DURAÇÃO DA PUBLICIDADE</DialogContentText>
					<TextField
						InputProps={{ className: classes.root }}
						InputLabelProps={{ className: classes.inputlabel }}
						autoFocus
						value={modalState.order}
						onChange={e => setModalState({ ...modalState, order: e.target.value })}
						margin="normal"
						id="order"
						label="ORDEM"
						type="string"
						fullWidth
					/>
					<TextField
						value={modalState.name}
						InputProps={{ className: classes.root }}
						InputLabelProps={{ className: classes.inputlabel }}
						onChange={e => setModalState({ ...modalState, name: e.target.value })}
						margin="normal"
						id="name"
						label="NOME"
						type="string"
						fullWidth
					/>
					<TextField
						InputProps={{ className: classes.root }}
						InputLabelProps={{ className: classes.inputlabel }}
						value={modalState.duration}
						onChange={e => setModalState({ ...modalState, duration: e.target.value })}
						margin="normal"
						id="duration"
						label="TEMPO"
						type="string"
						fullWidth
					/>
				</DialogContent>
				<DialogActions>
					<Button onClick={handleClose} color="default" variant="outlined">
						Cancel
					</Button>
					<Button onClick={handleModalSave} color="default" variant="outlined">
						Save
					</Button>
				</DialogActions>
			</Dialog>
		</div>
	);
}

export default React.memo(DemoContent);
