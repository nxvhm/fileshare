import { useContext, useEffect } from 'react';
import * as yup from "yup";
import { useForm, SubmitHandler  } from "react-hook-form";
import toast, { Toaster } from 'react-hot-toast';
import {TextField, Box, Typography, Grid, Button} from '@mui/material';
import { blue } from '@mui/material/colors'
import { yupResolver } from '@hookform/resolvers/yup';
import AuthContext from '../lib/context/AuthContext';
import { profileUpdate } from '../api/Auth';

export default function Profile () {

	const {user} = useContext(AuthContext)
	const validationScheme = yup.object().shape({
		name: yup.string().required(),
		email: yup.string().email().required(),
		password: yup.string().required().min(6),
		newPassword: yup.string().nullable().transform((v, o) => (o === '' ? null : v)).min(6),
		rePassword: yup.string().when('newPassword', {
			is: (newPassword: string) => newPassword ? newPassword.length > 0 : false,
			then: (schema) => schema.oneOf([yup.ref('newPassword')], 'Repeated password does not match new password')
		})
	}, [['newPassword', 'password']]);

	type ProfileUpdateForm = yup.InferType<typeof validationScheme>

	useEffect(() => {
		if(!user)
			return;

		setValue('name', user.data.name);
		setValue('email', user.data.email);
	}, [user]);

	const { register, handleSubmit, formState: { errors }, setValue } = useForm({
		resolver: yupResolver(validationScheme),
		defaultValues: {
			name: '',
			email: ''
		}
	});

	const onSubmit:SubmitHandler<ProfileUpdateForm> = async (data) => {
		if(!data.newPassword)
			delete data.newPassword;

		if(!data.rePassword)
			delete data.rePassword;

		profileUpdate(data).then(res => {
			console.log('profile update', res);
		}).catch(e => {
			toast.error(
				e instanceof Error ? e.message 	: 'Error Occured, please try again later',
				{duration: 3000, position: 'top-center'}
			);
			console.log('profile update erro', e);
		})
	}

	return(
		<>
		<Box>
			<Typography variant={'h4'} sx={{borderBottom: 1, borderColor: blue['100']}}>Profile</Typography>
		</Box>
		<Box sx={{marginTop: 3}} component="form" onSubmit={handleSubmit(onSubmit)}>
			<Grid container rowSpacing={2} flexDirection={'column'} justifyContent={'center'} alignItems={'center'}>
				<Grid item md={6} xs={12} width={'100%'}>
					<TextField
						id="outlined-basic"
						error={errors.name ? true : false}
						helperText={errors.name?.message || null}
						{...register("name")}
						label="Username"
						variant="outlined"
						fullWidth
						InputLabelProps={{ shrink: true }}
					/>
				</Grid>

				<Grid item md={6} xs={12} width={'100%'}>
					<TextField id="outlined-basic" label="Email" variant="outlined" type="email" fullWidth
						error={errors.email ? true : false}
						helperText={errors.email?.message || null}
						{...register("email")}
						InputLabelProps={{ shrink: true }}
					/>
				</Grid>

				<Grid item md={6} xs={12} width={'100%'}>
					<TextField id="outlined-basic" label="Password" variant="outlined" type="password" fullWidth
						error={errors.password ? true : false}
						helperText={errors.password?.message || null}
						{...register("password")}
					/>
				</Grid>

				<Grid item md={6} xs={12} width={'100%'}>
					<TextField id="outlined-basic" label="New Password" variant="outlined" type="password" fullWidth
						error={errors.newPassword ? true : false}
						helperText={errors.newPassword?.message || null}
						{...register("newPassword")}
					/>
				</Grid>

				<Grid item md={6} xs={12} width={'100%'}>
					<TextField id="outlined-basic" label="Repeat New Password" variant="outlined" type="password" fullWidth
						error={errors.rePassword ? true : false}
						helperText={errors.rePassword?.message || null}
						{...register("rePassword")}
					/>
				</Grid>

				<Grid item md={6} xs={12} width={'100%'}>
					<Button variant='contained' color='primary' type="submit" fullWidth>UPDATE</Button>
				</Grid>

			</Grid>
		</Box>
		<Toaster />
		</>
	);
}
