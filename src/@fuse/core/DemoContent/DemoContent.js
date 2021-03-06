import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import GridList from '@material-ui/core/GridList';
import GridListTile from '@material-ui/core/GridListTile';
import GridListTileBar from '@material-ui/core/GridListTileBar';
import ListSubheader from '@material-ui/core/ListSubheader';
import IconButton from '@material-ui/core/IconButton';
import InfoIcon from '@material-ui/icons/Info';



const useStyles = makeStyles((theme) => ({
	root: {
	  display: 'flex',
	  flexWrap: 'wrap',
	  justifyContent: 'space-around',
	  overflow: 'hidden',
	  backgroundColor: theme.palette.background.paper,
	},
	gridList: {
	  width: 500,
	  height: "100%"
	},
	icon: {
	  color: 'rgba(255, 255, 255, 0.54)',
	},
}));

function DemoContent() {
	const tileData = [
		{
		  img: '/material-ui-static/images/grid-list/breakfast.jpg',
		  title: 'Social Clud',
		  cols: 2,
		  featured: true,
		},
		{
		  img: '/material-ui-static/images/grid-list/burgers.jpg',
		  title: 'Coffee',
		},
		{
		  img: '/material-ui-static/images/grid-list/camera.jpg',
		  title: 'Social Clud',
		},
		{
		  img: '/material-ui-static/images/grid-list/morning.jpg',
		  title: 'Tribeca',
		  featured: true,
		},
		{
		  img: '/material-ui-static/images/grid-list/hats.jpg',
		  title: 'Social Clud',
		},
		{
		  img: '/material-ui-static/images/grid-list/honey.jpg',
		  title: 'Social Clud',
		},
		{
		  img: '/material-ui-static/images/grid-list/vegetables.jpg',
		  title: 'CMPC',
		  author: 'jill111',
		  cols: 2,
		},
		{
		  img: '/material-ui-static/images/grid-list/plant.jpg',
		  title: 'TOCA DO MALTE',
		},
		{
		  img: '/material-ui-static/images/grid-list/mushroom.jpg',
		  title: 'Restaurante Querência',
		},
		{
		  img: '/material-ui-static/images/grid-list/olive.jpg',
		  title: 'Tribeca',
		  author: 'congerdesign',
		},
	  ];

	const classes = useStyles();

	return (
	  <div className={classes.root}>
		<GridList cellHeight={150} className={classes.gridList}>
		  <GridListTile key="Subheader" cols={2} style={{ height: 'auto' }}>
			<ListSubheader component="div">Admobi</ListSubheader>
		  </GridListTile>
		  {tileData.map((tile) => (
			<GridListTile key={tile.img}>
			  <img src={tile.img} alt={tile.title} />
			  <GridListTileBar
				title={tile.title}
				actionIcon={
				  <IconButton aria-label={`info about ${tile.title}`} className={classes.icon}>
					<InfoIcon />
				  </IconButton>
				}
			  />
			</GridListTile>
		  ))}
		</GridList>
	  </div>
	);
}

export default React.memo(DemoContent);
