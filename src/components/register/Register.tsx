import React from 'react';
import { useForm, SubmitHandler } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { TextField, Button, Container, Typography, Box } from '@mui/material';
import AuthService from '../../service/AuthService';
import { toast } from 'react-toastify';

interface RegisterFormInputs {
    name: string;
    password: string;
    email: string;
}

const Register: React.FC = () => {
    const { register, handleSubmit, formState: { errors } } = useForm<RegisterFormInputs>();
    const navigate = useNavigate();

    const onSubmit: SubmitHandler<RegisterFormInputs> = (data) => {
        AuthService.register(data.name, data.password, data.email)
            .then(() => {
                navigate('/login'); // Przekierowanie do strony logowania po udanej rejestracji
            })
            .catch(() => {
                toast.error('Rejestracja nie powiodła się. Spróbuj ponownie.');
            });
    };

    return (
        <Container maxWidth="sm" sx={{ mt: 5 }}>
            <Typography variant="h4" component="h1" align="center" gutterBottom>
                Zarejestruj się
            </Typography>
            <form onSubmit={handleSubmit(onSubmit)}>
                <Box mb={3}>
                    <TextField
                        label="Nazwa użytkownika"
                        variant="outlined"
                        fullWidth
                        {...register('name', { required: 'Nazwa użytkownika jest wymagana' })}
                        error={!!errors.name}
                        helperText={errors.name?.message}
                    />
                </Box>
                <Box mb={3}>
                    <TextField
                        label="Hasło"
                        type="password"
                        variant="outlined"
                        fullWidth
                        {...register('password', { 
                            required: 'Hasło jest wymagane', 
                            minLength: { value: 6, message: 'Hasło musi mieć co najmniej 6 znaków' }
                        })}
                        error={!!errors.password}
                        helperText={errors.password?.message}
                    />
                </Box>
                <Box mb={3}>
                    <TextField
                        label="Email"
                        type="email"
                        variant="outlined"
                        fullWidth
                        {...register('email', { 
                            required: 'Email jest wymagany', 
                            pattern: { value: /^\S+@\S+\.\S+$/, message: 'Nieprawidłowy format email' }
                        })}
                        error={!!errors.email}
                        helperText={errors.email?.message}
                    />
                </Box>
                <Button type="submit" variant="contained" color="primary" fullWidth>
                    Zarejestruj
                </Button>
            </form>
        </Container>
    );
};

export default Register;
