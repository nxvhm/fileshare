import {Avatar, Button, CssBaseline, TextField, FormControlLabel, Checkbox, Link, Grid, Box, Typography, Container} from '@mui/material';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import { useForm, SubmitHandler  } from "react-hook-form";
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from "yup";

function Copyright(props: any) {
  return (
    <Typography variant="body2" color="text.secondary" align="center" {...props}>
      {'Copyright © '}
      <Link color="inherit" href="#">
        FileShare
      </Link>{' '}
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

	const {register, handleSubmit, formState: {errors}} = useForm<LoginForm>({
		resolver: yupResolver(validationScheme)
	})

	const onSubmit:SubmitHandler<LoginForm> = async (data) => {
		console.log(data);
	}

  return (
		<Container component="main" maxWidth="xs">
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
							<Link href="#" variant="body2">
								Forgot password?
							</Link>
						</Grid>
						<Grid item>
							<Link href="/signup" variant="body2">
								{"Don't have an account? Sign Up"}
							</Link>
						</Grid>
					</Grid>
				</Box>
			</Box>
			<Copyright sx={{ mt: 8, mb: 4 }} />
		</Container>
  );
}

export default Login
