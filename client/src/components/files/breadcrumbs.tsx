import * as React from 'react';
import { emphasize, styled } from '@mui/material/styles';
import {Breadcrumbs as MuiBreadcrumbs} from '@mui/material';
import Chip from '@mui/material/Chip';
import HomeIcon from '@mui/icons-material/Home';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { getBreadcrumbs } from '../../api/Files';

export type BreadcrumbsProps = {
	parentId?: number|undefined
}

const StyledBreadcrumb = styled(Chip)(({ theme }) => {
  const backgroundColor = theme.palette.grey[200];
  return {
    backgroundColor,
    height: theme.spacing(3),
    color: theme.palette.text.primary,
    fontWeight: theme.typography.fontWeightRegular,
    '&:hover, &:focus': {
      backgroundColor: emphasize(backgroundColor, 0.06),
    },
    '&:active': {
      boxShadow: theme.shadows[1],
      backgroundColor: emphasize(backgroundColor, 0.12),
    },
  };
}) as typeof Chip;

function handleClick(event: React.MouseEvent<Element, MouseEvent>) {
  event.preventDefault();
  console.info('You clicked a breadcrumb.');
}

export default function Breadcrumbs(props: BreadcrumbsProps) {

	React.useEffect(() => {
		getBreadcrumbs(props.parentId).then(res => {
			console.log('breadcrumbs res', res);
		}).catch(e => {
			console.log('breadcrumbs err', e);
		})
	}, [props.parentId])

  return (
    <div role="presentation" onClick={handleClick}>
      <MuiBreadcrumbs aria-label="breadcrumb">
        <StyledBreadcrumb
          component="a"
          href="#"
          label="Home"
          icon={<HomeIcon fontSize="small" />}
        />
        <StyledBreadcrumb component="a" href="#" label="Catalog" />
        <StyledBreadcrumb
          label="Accessories"
          deleteIcon={<ExpandMoreIcon />}
          onDelete={handleClick}
        />
      </MuiBreadcrumbs>
    </div>
  );
}
