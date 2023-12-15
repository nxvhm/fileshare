import { useContext } from 'react';
import * as yup from "yup";
import { Link, Navigate } from "react-router-dom";
import {Avatar, Button, CssBaseline, TextField, FormControlLabel, Checkbox, Grid, Box, Typography, Container, Link as MuiLink} from '@mui/material';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import { useForm, SubmitHandler  } from "react-hook-form";
import { yupResolver } from '@hookform/resolvers/yup';
import toast, { ToastOptions, Toaster } from 'react-hot-toast';
import { loginRequest } from '../api/Auth';
import AuthContext from '../lib/context/AuthContext';

function Copyright(props: any) {
  return (
    <Typography variant="body2" color="text.secondary" align="center" {...props}>
      {'Copyright © '}
      <MuiLink color="inherit" component={Link} to={'/'}>
        FileShare
      </MuiLink>{' '}
      {new Date().getFullYear()}
      {'.'}
    </Typography>
  );
}
const validationScheme = yup.object({
  email: yup.string().email().required(),
	password: yup.string().required().min(6),
}).required();

type LoginForm = yup.InferType<typeof validationScheme>

function Login() {
	const {user, loginUser} = useContext(AuthContext);

	const {register, handleSubmit, formState: {errors}} = useForm<LoginForm>({
		resolver: yupResolver(validationScheme)
	})

	const onSubmit:SubmitHandler<LoginForm> = async (data) => {
		const toastOpts: ToastOptions = {duration: 3000, position: 'top-center'};
		try {
			const result = await loginRequest(data);
			if (result.token && typeof loginUser == 'function') {
				loginUser(result.token);
				toast.success("Successfull login");
			}
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
					Sign in
				</Typography>
				<Box component="form" onSubmit={handleSubmit(onSubmit)} sx={{ mt: 1 }}>
					<TextField margin="normal" fullWidth
						{...register("email")}
						error={errors.email ? true : false}
						id="email"
						label="Email Address"
						helperText={errors.email?.message || null}
					/>
					<TextField margin="normal" fullWidth label="Password"
						{...register("password")}
						error={errors.password ? true : false}
						helperText={errors.password?.message || null}
						id="password"
						type="password"
					/>
					<FormControlLabel
						control={<Checkbox value="remember" color="primary" />}
						label="Remember me"
					/>
					<Button type="submit" fullWidth variant="contained" sx={{ mt: 3, mb: 2 }}>
						Sign In
					</Button>
					<Grid container>
						<Grid item xs>
							<MuiLink component={Link} to={'#'}>Forgot password</MuiLink>
						</Grid>
						<Grid item>
							<MuiLink component={Link} to={"/signup"}>
								Don't have an account? Sign Up
							</MuiLink>
						</Grid>
					</Grid>
				</Box>
			</Box>
			<Copyright sx={{ mt: 8, mb: 4 }} />
			<Toaster />
		</Container>
  );
}

export default Login
