import FuseScrollbars from "@fuse/core/FuseScrollbars";
import _ from "@lodash";
import Checkbox from "@material-ui/core/Checkbox";
import Icon from "@material-ui/core/Icon";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TablePagination from "@material-ui/core/TablePagination";
import TableRow from "@material-ui/core/TableRow";
import Typography from "@material-ui/core/Typography";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { withRouter } from "react-router-dom";
import FuseLoading from "@fuse/core/FuseLoading";
import FuseAnimate from "@fuse/core/FuseAnimate/FuseAnimate";
import ProductsTableHead from "./ProductsTableHead";
import firebaseService from "app/services/firebaseService";
import { RestoreOutlined } from "@material-ui/icons";

function ProductsTable(props) {
  const [defailtDeviceList, setDefaultDeviceList] = useState([]);
  const [devicelists, setDeviceData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [order, setOrder] = useState({
    direction: "asc",
    id: null,
  });

  const [ flag, setFlag ] = useState(false)

  useEffect(() => {
    setLoading(props.onLoading);
  }, [props.onLoading]);

  useEffect(() => {
	  setRowsPerPage(10)
    loadDeviceList();
  }, []);

  useEffect(() => {
    let temp = devicelists;
    for(let i = 0 ; i < temp.length ; i ++){
        if(temp[i].deviceId == props.onlineDevice){
          console.log(props.onlineDevice);
          temp[i].wifiFlag = 0;
          setDeviceData(temp);
          setFlag(!flag);
        }
    }
  }, [props.onlineDevice])

  useEffect(() => {
    // console.log(props.searchKey);
    if(props.searchKey == "")
      setDeviceData(defailtDeviceList)
    else{
      const filteredArr = defailtDeviceList.filter(
        (ele) => {
          let temp = ele.uploadFolder;
          // temp = temp.toString();
          if(temp){
            if(temp.indexOf(props.searchKey) !== -1){
              return ele;
            }
          }
          // return ele.uploadFolder.includes('CM')
        }
      )
      setDeviceData(filteredArr);
    }
  }, [props.searchKey])

  useEffect(() => {
    let temp = devicelists;
    if(props.offlineDevice != ''){
      for(let i = 0 ; i < temp.length ; i ++){
          if(temp[i].deviceId == props.offlineDevice){
            temp[i].wifiFlag = 1;
            setDeviceData(temp);
            setFlag(!flag);
          }
      }
    }
  }, [props.offlineDevice])

  useEffect(() => {
    if (props.updateFlagList) {
      for (const item of props.updateFlagList) {
        firebaseService.db.ref(`${item}/updateFlag`).set(1);
      }
      loadDeviceList();
    }
  }, [props.updateFlagList]);

  function loadDeviceList() {
    const result = [];
    const ref = firebaseService.db.ref();
    ref.once("value").then((n) => {
      const data = n.val();
      Object.keys(data).map((key) => {
        data[key].wifiFlag = 5;
        if (key != "users") result.push(data[key]);
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
    let direction = "desc";

    if (order.id === property && order.direction === "desc") {
      direction = "asc";
    }

    setOrder({
      direction,
      id,
    });
  }

  function handleSelectAllClick(event) {
    if (event.target.checked) {
      props.onCheckEvent(devicelists.map((n) => n.deviceId));
      setSelected(devicelists.map((n) => n.deviceId));
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
      newSelected = newSelected.concat(
        selected.slice(0, selectedIndex),
        selected.slice(selectedIndex + 1)
      );
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

  if (loading) {
    return <FuseLoading />;
  }

  if (devicelists.length === 0) {
    return (
      <FuseAnimate delay={100}>
        <div className="flex flex-1 items-center justify-center h-full">
          <Typography color="textSecondary" variant="h5">
            There are no products!
          </Typography>
        </div>
      </FuseAnimate>
    );
  }

  return (
    <div className="w-full flex flex-col">
      <FuseScrollbars className="flex-grow overflow-x-auto">
        <Table stickyHeader className="min-w-xl" aria-labelledby="tableTitle">
          <ProductsTableHead
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
                (o) => {
                  switch (order.id) {
                    default: {
                      return o[order.id];
                    }
                  }
                },
              ],
              [order.direction]
            )
              .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
              .map((n) => {
                const isSelected = selected.indexOf(n.deviceId) !== -1;
                return (
                  <TableRow
                    className="h-64 cursor-pointer"
                    hover
                    role="checkbox"
                    aria-checked={isSelected}
                    tabIndex={-1}
                    key={n.deviceId}
                    selected={isSelected}
                    onClick={(event) => handleCheck(event, n.deviceId)}
                  >
                    <TableCell
                      className="w-40 md:w-64 text-center"
                      padding="none"
                    >
                      <Checkbox
                        checked={isSelected}
                        onClick={(event) => event.stopPropagation()}
                        onChange={(event) => handleCheck(event, n.deviceId)}
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
                        src="assets/images/ecommerce/product-image-placeholder.png"
                        alt={n.name}
                      />
                    </TableCell>

                    <TableCell
                      className="w-40 md:w-100"
                      component="th"
                      scope="row"
                    >
                      {n.deviceId}
                    </TableCell>

                    <TableCell
                      className="w-40 md:w-100"
                      component="th"
                      scope="row"
                    >
                      {n.duration}
                    </TableCell>

                    <TableCell
                      className="w-40 md:w-100"
                      component="th"
                      scope="row"
                    >
                      {n.password}
                    </TableCell>

                    <TableCell
                      className="w-40 md:w-100"
                      component="th"
                      scope="row"
                    >
                      {n.uploadFolder}
                    </TableCell>
                    {/* <TableCell
                      className="w-40 md:w-100"
                      component="th"
                      scope="row"
                    >
                      {n.updateFlag}
                    </TableCell> */}
                    <TableCell
                      className="w-40 md:w-100 text-left"
                      component="th"
                      scope="row"
                    >
                      {n.wifiFlag == 0 ? (
                        <Icon className="text-green text-20">check_circle</Icon>
                      ) : (
                        <Icon className="text-red text-20">remove_circle</Icon>
                      )
                      }
                    </TableCell>
                  </TableRow>
                );
              })}
          </TableBody>
        </Table>
      </FuseScrollbars>

      <TablePagination
        className="flex-shrink-0 border-t-1"
        component="div"
        count={devicelists.length}
        rowsPerPage={rowsPerPage}
        page={page}
        backIconButtonProps={{
          "aria-label": "Previous Page",
        }}
        nextIconButtonProps={{
          "aria-label": "Next Page",
        }}
        onChangePage={handleChangePage}
        onChangeRowsPerPage={handleChangeRowsPerPage}
      />
	  <br/><br/>
    </div>
  );
}

export default withRouter(ProductsTable);
