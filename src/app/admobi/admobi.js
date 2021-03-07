import DemoContent from "@fuse/core/DemoContent";
import FusePageCarded from "@fuse/core/FusePageCarded";
import Hidden from "@material-ui/core/Hidden";
import Icon from "@material-ui/core/Icon";
import IconButton from "@material-ui/core/IconButton";
import { makeStyles } from "@material-ui/core/styles";
import React, { useState, useRef } from "react";
import ProductsTable from "../main/apps/e-commerce/products/ProductsTable";
import Button from "@material-ui/core/Button";
import firebaseService from "app/services/firebaseService";

const useStyles = makeStyles((theme) => ({
  layoutRoot: {},
  root: {
    "& > *": {
      margin: theme.spacing(0.5),
    },
  },
  input: {
    display: "none",
  },
}));

function CardedLeftSidebarSample() {
  const classes = useStyles();
  const pageLayout = useRef(null);
  const [selected, setSelected] = useState([]);
  const [updateFlagList, setUpdateFlagList] = useState([]);
  const [showImages, setShowImages] = useState([]);
  const [onLoading, setLoading] = useState(false);

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
    const n = await ref.once("value");
    const data = n.val();
    return data.uploadFolder;
  }

  async function handleImageAsFile(e) {
    setLoading(true);
    for (let index = 0; index < selected.length; index++) {
      let folder = await getFolderNameById(selected[index]);
      const images = e.target.files;
      for (let i = 0; i < images.length; i++) {
        await firebaseService.storage
          .ref(`admobi/${folder}/${images[i].name}`)
          .put(images[i]);
      }
    }
    setLoading(false);
  }

  return (
    <FusePageCarded
      classes={{
        root: classes.layoutRoot,
      }}
      header={
        <div className="flex flex-col flex-1">
          <div className="flex items-center py-24">
            <Hidden lgUp>
              <IconButton
                onClick={(ev) => pageLayout.current.toggleLeftSidebar()}
                aria-label="open left sidebar"
              >
                <Icon>menu</Icon>
              </IconButton>
            </Hidden>
            <div className="flex-1">
              <h4>This card will show selected device's lists</h4>
            </div>
          </div>
        </div>
      }
      contentToolbar={
        <div className="px-24">
          <h4>Selected Device Images</h4>
        </div>
      }
      content={
        <div className="p-24">
          <h4>Images</h4>
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
              <Button variant="contained">Update Wi-Fi Status</Button>
              <Button
                variant="contained"
                color="secondary"
                onClick={updateFlag}
              >
                Update Flag Key
              </Button>
              <label htmlFor="contained-button-file">
                <Button variant="contained" component="span">
                  Add File
                </Button>
              </label>
              <Button
                variant="contained"
                color="secondary"
                onClick={showSelectedImages}
              >
                Show Image
              </Button>
            </>
          ) : (
            <>
              <Button variant="contained" disabled>
                Update Wi-Fi Status
              </Button>
              <Button variant="contained" color="secondary" disabled>
                Update Flag Key
              </Button>
              <Button variant="contained" component="span" disabled>
                Add File
              </Button>
              <Button variant="contained" color="secondary" disabled>
                Show Image
              </Button>
            </>
          )}
        </div>
      }
      leftSidebarContent={
        <div className="p-24">
          <h4>Please select devices</h4>
          <ProductsTable
            onLoading={onLoading}
            onCheckEvent={onCheckEvent}
            updateFlagList={updateFlagList}
          />
        </div>
      }
      ref={pageLayout}
    />
  );
}

export default CardedLeftSidebarSample;
