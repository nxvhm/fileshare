import { styled, emphasize } from '@mui/material/styles';
import {Icon, TableRow} from '@mui/material';
import {Chip} from '@mui/material';
import {Home as HomeIcon, Folder as FolderIcon} from '@mui/icons-material';

export const VisuallyHiddenInput = styled('input')({
	clip: 'rect(0 0 0 0)',
	clipPath: 'inset(50%)',
	height: 1,
	overflow: 'hidden',
	position: 'absolute',
	bottom: 0,
	left: 0,
	whiteSpace: 'nowrap',
	width: 1,
});

export const FileTableRow = styled(TableRow)( ({theme}) => ({
	'&:hover': {
		background: theme.palette.mode == 'light' ? '#dbdbdb' : '#3a3a3a',
		cursor: 'pointer'
	}
}))

export const StyledBreadcrumb = styled(Chip)(({ theme }) => {
  return {
    backgroundColor: theme.palette.mode == 'light' ? theme.palette.grey[200] : theme.palette.primary.main,
    height: theme.spacing(3),
    color: theme.palette.mode == 'light' ? theme.palette.text.primary : theme.palette.grey[900],
		fontWeight: theme.typography.fontWeightRegular,
    '&:hover, &:focus': {
      backgroundColor: emphasize(theme.palette.grey[200], 0.06),
    },
    '&:active': {
      boxShadow: theme.shadows[1],
      backgroundColor: emphasize(theme.palette.grey[200], 0.12),
    },
		'.MuiChip-icon': {
			color: theme.palette.grey[900]
		}
  };
}) as typeof Chip;


