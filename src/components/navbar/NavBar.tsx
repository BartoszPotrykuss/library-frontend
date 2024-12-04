import { useEffect, useState } from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import MenuBookIcon from '@mui/icons-material/MenuBook';
import { NavLink, useNavigate } from 'react-router-dom';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import IconButton from '@mui/material/IconButton';
import { Person, AdminPanelSettings } from '@mui/icons-material';
import AuthService from '../../service/AuthService';
import { jwtDecode } from 'jwt-decode';
import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet';

function NavBar() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [username, setUsername] = useState('');
  const [role, setRole] = useState('');
  const [wallet, setWallet] = useState<number | null>(null);  // Stan dla wartości portfela
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      setIsLoggedIn(true);
      try {
        const decodedToken: { sub: string; role: string } = jwtDecode(token);
        setUsername(decodedToken.sub);
        setRole(decodedToken.role || 'USER');

        // Pobierz wartość portfela użytkownika
        AuthService.getUserWallet(decodedToken.sub)
          .then(response => {
            setWallet(response.data);  // Zakładając, że API zwraca liczbę portfela
          })
          .catch(err => {
            console.error('Błąd podczas pobierania portfela:', err);
          });
      } catch (err) {
        console.error('Błąd dekodowania tokena:', err);
        setIsLoggedIn(false);
      }
    }
  }, []);

  const pages = role === 'ADMIN' ? [
    { name: 'Wypożycz książkę', path: '/' },
    { name: 'Dodaj książkę', path: '/addBook' },
    { name: 'Dodaj autora', path: '/addAuthor' },
    { name: 'Wypożyczenia', path: '/rentals' },
    { name: 'Rezerwacje sali', path: '/reservations' },
    { name: 'Zarezerwuj salę', path: '/addReservation' },
    { name: 'Użytkownicy', path: '/users' }
  ] : [
    { name: 'Wypożycz książkę', path: '/' },
    { name: 'Twoje wypożyczenia', path: '/rentals' },
    { name: 'Twoje rezerwacje', path: '/reservations' },
    { name: 'Zarezerwuj salę', path: '/addReservation' },
  ];

  const handleLogout = () => {
    AuthService.logout();
    setIsLoggedIn(false);
    navigate('/login');
  };

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  return (
    <AppBar position="static">
      <Toolbar>
        <MenuBookIcon sx={{ mr: 2 }} />
        <Typography
          variant="h6"
          component={NavLink}
          to="/"
          sx={{ textDecoration: 'none', color: 'inherit', flexGrow: 1 }}
        >
          Biblioteka
        </Typography>
        <Box sx={{ display: 'flex' }}>
          {pages.map((page) => (
            <Button
              key={page.name}
              component={NavLink}
              to={page.path}
              sx={{
                color: 'white',
                textTransform: 'none',
                mr: 2,
                '&.active': {
                  backgroundColor: 'rgba(255, 255, 255, 0.2)', // Wyróżnienie aktywnej zakładki
                  fontWeight: 'bold',
                },
              }}
            >
              {page.name}
            </Button>
          ))}
          {!isLoggedIn ? (
            <>
              <Button
                component={NavLink}
                to="/login"
                sx={{
                  color: 'yellow',
                  textTransform: 'none',
                  mr: 2,
                  '&.active': {
                    backgroundColor: 'rgba(255, 255, 255, 0.2)',
                    fontWeight: 'bold',
                  },
                }}
              >
                Zaloguj się
              </Button>
              <Button
                component={NavLink}
                to="/register"
                sx={{
                  color: 'yellow',
                  textTransform: 'none',
                  '&.active': {
                    backgroundColor: 'rgba(255, 255, 255, 0.2)',
                    fontWeight: 'bold',
                  },
                }}
              >
                Zarejestruj się
              </Button>
            </>
          ) : (
            <>
              <Box sx={{ display: 'flex', alignItems: 'center', mr: 2 }}>
                <AccountBalanceWalletIcon sx={{ mr: 1 }} />
                {wallet !== null && <Typography color="white">{wallet} PLN</Typography>}
              </Box>
              <IconButton
                onClick={handleMenuOpen}
                sx={{
                  color: 'white',
                  textTransform: 'none',
                  display: 'flex',
                  alignItems: 'center',
                }}
              >
                {role === 'ADMIN' ? (
                  <AdminPanelSettings sx={{ mr: 1 }} />
                ) : (
                  <Person sx={{ mr: 1 }} />
                )}
                {username}
              </IconButton>
              <Menu
                anchorEl={anchorEl}
                open={Boolean(anchorEl)}
                onClose={handleMenuClose}
              >
                <MenuItem onClick={handleLogout}>Wyloguj się</MenuItem>
              </Menu>
            </>
          )}
        </Box>
      </Toolbar>
    </AppBar>
  );
}

export default NavBar;
