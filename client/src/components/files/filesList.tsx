import * as React from 'react';
import FolderIcon from '@mui/icons-material/Folder';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';

function generate(element: React.ReactElement) {
  return [0, 1, 2].map((value) =>
    React.cloneElement(element, {
      key: value,
    }),
  );
}

export default function FilesList() {

  const [dense, setDense] = React.useState(false);
  const [secondary, setSecondary] = React.useState(false);

	return(
		<List dense={dense}>
			{generate(
				<ListItem>
					<ListItemIcon>
						<FolderIcon />
					</ListItemIcon>
					<ListItemText
						primary="Single-line item"
						secondary={secondary ? 'Secondary text' : null}
					/>
				</ListItem>,
			)}
		</List>
	);
}
