import React, { useEffect, useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import GridList from "@material-ui/core/GridList";
import GridListTile from "@material-ui/core/GridListTile";
import GridListTileBar from "@material-ui/core/GridListTileBar";
import ListSubheader from "@material-ui/core/ListSubheader";
import IconButton from "@material-ui/core/IconButton";
import InfoIcon from "@material-ui/icons/Info";
import firebaseService from "app/services/firebaseService";
import { func } from "prop-types";
import FuseLoading from "@fuse/core/FuseLoading";
import ReactPlayer from "react-player";

const useStyles = makeStyles((theme) => ({
  root: {
    display: "flex",
    flexWrap: "wrap",
    justifyContent: "space-around",
    overflow: "hidden",
    backgroundColor: theme.palette.background.paper,
  },
  gridList: {
    width: 500,
    height: "100%",
  },
  icon: {
    color: "rgba(255, 255, 255, 0.54)",
  },
}));

function DemoContent(props) {
  const [fileList, setFileList] = useState([]);
  const [loading, setLoading] = useState(false);

  async function loadDeviceList(data) {
    const temp = [];
    for (const folder of data) {
      var listRef = firebaseService.storage.ref(`admobi/${folder}`);
      await listRef.listAll().then(async (res) => {
        for (const itemRef of res.items) {
          const fileURL = await itemRef.getDownloadURL();
          temp.push({
            img: fileURL,
            title: folder,
            cols: 2,
            featured: true,
          });
        }
      });
    }
    setLoading(false);
    setFileList(temp);
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
      const n = await ref.once("value");
      const data = n.val();
      if (!result.includes(data.uploadFolder)) result.push(data.uploadFolder);
    }
    loadDeviceList(result);
  }
  
  function isVideo(url) {
    return url.includes(".mp4") || url.includes(".avi");
  }

  const classes = useStyles();

  if (loading) {
    return <FuseLoading />;
  }

  return (
    <div className={classes.root}>
      <GridList cellHeight={150} className={classes.gridList}>
        <GridListTile key="Subheader" cols={2} style={{ height: "auto" }}>
          <ListSubheader component="div">Admobi</ListSubheader>
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
              title={tile.title}
              actionIcon={
                <IconButton
                  aria-label={`info about ${tile.title}`}
                  className={classes.icon}
                >
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
