import { styled, emphasize } from '@mui/material/styles';
import {TableRow, Box} from '@mui/material';
import {Chip} from '@mui/material';

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

export const UploadDialogBox = styled(Box)(({ theme }) => {
	return {
		backgroundColor: theme.palette.background.default,
		boxShadow: theme.shadows[10],
		borderRadius: 2,
		color: theme.palette.text.primary,
		position: 'absolute',
		right: 15,
		bottom: 15,
		zIndex: 1300,
		[theme.breakpoints.up("sm")]: {
			width: '100%'
		},
		[theme.breakpoints.up("md")]: {
			width: '300px'
		},
		[theme.breakpoints.up("lg")]: {
			width: '500px'
		},
		'.MuiListItemText-primary, .MuiListItemText-secondary': {
			fontSize: '0.8rem'
		}
	}
});

