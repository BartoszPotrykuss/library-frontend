import React from 'react';
import { useForm, SubmitHandler } from 'react-hook-form';
import { TextField, Button, Box, Typography, Container } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import AuthService from '../../service/AuthService';
import { jwtDecode } from 'jwt-decode';

interface LoginFormInputs {
  username: string;
  password: string;
}

const Login: React.FC = () => {
  const { register, handleSubmit, formState: { errors } } = useForm<LoginFormInputs>();
  const navigate = useNavigate();

  const onSubmit: SubmitHandler<LoginFormInputs> = (data) => {
    AuthService.login(data.username, data.password)
      .then((response) => {
        const token = response.data; // Odbierz token JWT
        localStorage.setItem('token', token); // Zapisz cały token w localStorage

        // Dekoduj token i zapisz rolę w localStorage
        const decodedToken: { role: string } = jwtDecode(token);
        localStorage.setItem('role', decodedToken.role);

        console.log('Zalogowano jako rola:', decodedToken.role);
        navigate('/'); // Przekierowanie po zalogowaniu
        window.location.reload();
      })
      .catch(() => {
        console.error('Logowanie nie powiodło się');
        alert('Logowanie nie powiodło się. Sprawdź dane i spróbuj ponownie.');
      });
  };

  return (
    <Container maxWidth="xs" sx={{ mt: 8 }}>
      <Typography variant="h5" align="center" gutterBottom>
        Zaloguj się
      </Typography>
      <form onSubmit={handleSubmit(onSubmit)}>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          <TextField
            label="Nazwa użytkownika"
            variant="outlined"
            {...register('username', { required: 'Nazwa użytkownika jest wymagana' })}
            error={!!errors.username}
            helperText={errors.username?.message}
          />
          <TextField
            label="Hasło"
            type="password"
            variant="outlined"
            {...register('password', { required: 'Hasło jest wymagane' })}
            error={!!errors.password}
            helperText={errors.password?.message}
          />
          <Button type="submit" variant="contained" fullWidth>
            Zaloguj się
          </Button>
        </Box>
      </form>
    </Container>
  );
};

export default Login;
