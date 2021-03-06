import DemoContent from '@fuse/core/DemoContent';
import DemoSidebarContent from '@fuse/core/DemoSidebarContent';
import FusePageCarded from '@fuse/core/FusePageCarded';
import Hidden from '@material-ui/core/Hidden';
import Icon from '@material-ui/core/Icon';
import IconButton from '@material-ui/core/IconButton';
import { makeStyles } from '@material-ui/core/styles';
import React, { useRef } from 'react';
import withReducer from 'app/store/withReducer';
import ProductsTable from '../../main/apps/e-commerce/products/ProductsTable';
import reducer from '../../main/apps/e-commerce/store';

const useStyles = makeStyles({
	layoutRoot: {}
});

function CardedLeftSidebarSample() {
	const classes = useStyles();
	const pageLayout = useRef(null);

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
					<DemoContent />
				</div>
			}
			leftSidebarHeader={
				<div className="p-24">
					<h4>Device Lists</h4>
				</div>
			}
			leftSidebarContent={
				<div className="p-24">
					<h4>Please select devices</h4>
					<br />
					<ProductsTable />
				</div>
			}
			ref={pageLayout}
		/>
	);
}

export default withReducer('eCommerceApp', reducer)(CardedLeftSidebarSample);
