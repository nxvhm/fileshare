import { Avatar, Button, CssBaseline, TextField, Link as MuiLink, Grid, Box, Typography, Container} from '@mui/material';
import { useForm, SubmitHandler  } from "react-hook-form";
import toast, { ToastOptions, Toaster } from 'react-hot-toast';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import { yupResolver } from '@hookform/resolvers/yup';
import AuthContext from '../lib/context/AuthContext';
import { Link, Navigate } from "react-router-dom";
import {signupRequest} from '../api/Auth'
import { useContext } from 'react';
import * as yup from "yup";

function Copyright(props: any) {
  return (
    <Typography variant="body2" color="text.secondary" align="center" {...props}>
      {'Copyright © '}
      <MuiLink component={Link} to={'/'}>
        FileShare
      </MuiLink>{' '}
      {new Date().getFullYear()}
      {'.'}
    </Typography>
  );
}

const validationScheme = yup.object({
  name: yup.string().required(),
  email: yup.string().email().required(),
	password: yup.string().required().min(6),
	password_repeat: yup.string().required().oneOf([yup.ref('password')], 'Passwords does not match')
}).required();

type SignupForm = yup.InferType<typeof validationScheme>

export default function Signup() {

	const {user} = useContext(AuthContext);

  const { register, handleSubmit, formState: { errors } } = useForm<SignupForm>({
		resolver: yupResolver(validationScheme)
	});
  const onSubmit:SubmitHandler<SignupForm> = async (data) => {
		const toastOpts: ToastOptions = {duration: 3000, position: 'top-center'};
		try {
			const result = await signupRequest(data);
			result.success
				? toast.success("Successfull signup. You can login to your account now", toastOpts)
				: toast.error(result.message ?? "Error during signup", toastOpts)
		} catch (error) {
			toast.error(error instanceof Error ? error.message 	: 'Error Occured, please try again later', toastOpts)
			console.log(error, error instanceof Error);
		}
	}

  return (
		<Container component="main" maxWidth="xs">
			{user && <Navigate to={'/'} replace />}
			<CssBaseline />
			<Box
				sx={{
					marginTop: 8,
					display: 'flex',
					flexDirection: 'column',
					alignItems: 'center',
				}}
			>
				<Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
					<LockOutlinedIcon />
				</Avatar>
				<Typography component="h1" variant="h5">
					Sign up
				</Typography>
				<Box component="form" onSubmit={handleSubmit(onSubmit)} sx={{ mt: 3 }}>
					<Grid container spacing={2}>
						<Grid item xs={12}>
							<TextField fullWidth
								error={errors.name ? true : false}
								{...register("name")}
								id="name"
								label="Username"
								helperText={errors.name?.message || null}
							/>
						</Grid>
						<Grid item xs={12}>
							<TextField fullWidth
								error={errors.email ? true : false}
								{...register("email")}
								id="email"
								label="Email Address"
								helperText={errors.email?.message || null}
							/>
						</Grid>
						<Grid item xs={12}>
							<TextField fullWidth
								error={errors.password ? true : false}
								{...register("password")}
								name="password"
								label="Password"
								type="password"
								id="password"
								helperText={errors.password?.message || null}
							/>
						</Grid>
						<Grid item xs={12}>
							<TextField fullWidth
								error={errors.password_repeat ? true : false}
								{...register("password_repeat", {required: true})}
								name="password_repeat"
								label="Repeat Password"
								type="password"
								id="password_repeat"
								helperText={errors.password_repeat?.message || null}
							/>
						</Grid>
					</Grid>
					<Button
						type="submit"
						fullWidth
						variant="contained"
						sx={{ mt: 3, mb: 2 }}
					>
						Sign Up
					</Button>
					<Grid container justifyContent="flex-end">
						<Grid item>
							<MuiLink component={Link} to="/login" variant="body2">
								Already have an account? Sign in
							</MuiLink>
						</Grid>
					</Grid>
				</Box>
			</Box>
			<Copyright sx={{ mt: 5 }} />
			<Toaster />
		</Container>
  );
}
