import {useState, useEffect} from 'react';
import { NavLink } from 'react-router-dom';

import { emphasize, styled } from '@mui/material/styles';
import {Breadcrumbs as MuiBreadcrumbs, Chip} from '@mui/material';
import {Home as HomeIcon, Folder as FolderIcon} from '@mui/icons-material';

import { getBreadcrumbs } from '../../api/Files';
import { FileModel } from '../../definitions';
import { StyledBreadcrumb } from './styled';

export type BreadcrumbsProps = {
	folderId?: number|undefined
}

function handleClick(event: React.MouseEvent<Element, MouseEvent>) {
  event.preventDefault();
}

export default function Breadcrumbs(props: BreadcrumbsProps) {

	const [folders, setFolders] = useState<FileModel[]>([]);
	useEffect(() => {
		getBreadcrumbs(props.folderId).then(res => {
			setFolders(res.data);
		}).catch(e => {
			console.log('breadcrumbs err', e);
		})
	}, [props.folderId])

	const breadcrumbsElements = () => {
		if(!folders.length)
			return;

		return folders.map(folder => {
			return(
				<NavLink to={props.folderId != folder.id ? `/folder/${folder.id}` : '#'} key={folder.id}>
					<StyledBreadcrumb label={folder.name} icon={<FolderIcon fontSize="small"/>} />
				</NavLink>
			)
		})
	}

  return (
    <div role="presentation" onClick={handleClick}>
      <MuiBreadcrumbs aria-label="breadcrumb" >
				<NavLink to={"/"}>
					<StyledBreadcrumb label="Home" icon={<HomeIcon fontSize="small" />}/>
				</NavLink>
				{breadcrumbsElements()}
      </MuiBreadcrumbs>
    </div>
  );
}
