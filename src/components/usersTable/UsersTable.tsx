import React, { useEffect, useState } from 'react';
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TableSortLabel, TextField, Paper, FormControl, InputLabel, Select, MenuItem } from '@mui/material';
import { User } from './types'; // Zakładając, że masz taki typ
import { toast } from 'react-toastify';
import AuthService from '../../service/AuthService';

const UsersTable = () => {
  const [users, setUsers] = useState<User[]>([]); // Lista użytkowników
  const [order, setOrder] = useState<'asc' | 'desc'>('asc'); // Kierunek sortowania
  const [orderBy, setOrderBy] = useState<keyof User>('name'); // Kolumna do sortowania
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [walletDialogOpen, setWalletDialogOpen] = useState(false);
  const [roleDialogOpen, setRoleDialogOpen] = useState(false);
  const [fee, setFee] = useState(0); // Kwota do zmiany w portfelu
  const [newRole, setNewRole] = useState(''); // Nowa rola użytkownika

  const fetchUsers = () => {
    AuthService.getUsers()
      .then(response => setUsers(response.data))
      .catch(err => {
        toast.error('Nie udało się pobrać użytkowników');
      });
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleSort = (property: keyof User) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
    const sortedUsers = [...users].sort((a, b) => {
      const aValue = a[property] ?? '';
      const bValue = b[property] ?? '';
      if (aValue < bValue) return isAsc ? -1 : 1;
      if (aValue > bValue) return isAsc ? 1 : -1;
      return 0;
    });
    setUsers(sortedUsers);
  };

  const handleOpenWalletDialog = (user: User) => {
    setSelectedUser(user);
    setWalletDialogOpen(true);
  };

  const handleCloseWalletDialog = () => {
    setWalletDialogOpen(false);
    setSelectedUser(null);
  };

  const handleUpdateWallet = () => {
    if (selectedUser) {
      AuthService.updateUserWallet(selectedUser.name, fee)
        .then(() => {
          toast.success(`Portfel użytkownika ${selectedUser.name} został zaktualizowany!`);
          fetchUsers(); 
        })
        .catch(err => {
          toast.error('Nie udało się zaktualizować portfela użytkownika.');
        });
    }
    handleCloseWalletDialog();
  };

  const handleOpenRoleDialog = (user: User) => {
    setSelectedUser(user);
    setRoleDialogOpen(true);
  };

  const handleCloseRoleDialog = () => {
    setRoleDialogOpen(false);
    setSelectedUser(null);
  };

  const handleConfirmRoleChange = () => {
    if (selectedUser) {
      AuthService.updateUserRole(selectedUser.name, newRole)
        .then(() => {
          toast.success(`Rola użytkownika ${selectedUser.name} została zmieniona na ${newRole}.`);
          fetchUsers();
        })
        .catch(err => {
          toast.error('Nie udało się zmienić roli użytkownika.');
        });
    }
    handleCloseRoleDialog();
  };

  return (
    <div>
      {/* Tabela użytkowników */}
      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 650 }} aria-label="Tabela użytkowników">
          <TableHead>
            <TableRow>
              <TableCell>
                <TableSortLabel
                  active={orderBy === 'name'}
                  direction={orderBy === 'name' ? order : 'asc'}
                  onClick={() => handleSort('name')}
                >
                  Nazwa użytkownika
                </TableSortLabel>
              </TableCell>
              <TableCell>
                <TableSortLabel
                  active={orderBy === 'email'}
                  direction={orderBy === 'email' ? order : 'asc'}
                  onClick={() => handleSort('email')}
                >
                  Email
                </TableSortLabel>
              </TableCell>
              <TableCell>
                <TableSortLabel
                  active={orderBy === 'role'}
                  direction={orderBy === 'role' ? order : 'asc'}
                  onClick={() => handleSort('role')}
                >
                  Rola
                </TableSortLabel>
              </TableCell>
              <TableCell>
                <TableSortLabel
                  active={orderBy === 'wallet'}
                  direction={orderBy === 'wallet' ? order : 'asc'}
                  onClick={() => handleSort('wallet')}
                >
                  Portfel
                </TableSortLabel>
              </TableCell>
              <TableCell>Akcje</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {users.map((user, index) => (
              <TableRow key={index}>
                <TableCell>{user.name}</TableCell>
                <TableCell>{user.email}</TableCell>
                <TableCell>{user.role}</TableCell>
                <TableCell>{user.wallet}zł</TableCell>
                <TableCell>
                  <Button sx={{marginRight: 2}} variant="contained" color="primary" onClick={() => handleOpenWalletDialog(user)}>
                    Zmien portfel
                  </Button>
                  <Button variant="contained" color="secondary" onClick={() => handleOpenRoleDialog(user)}>
                    Zmień rolę
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Dialog do zmiany portfela */}
      <Dialog open={walletDialogOpen} onClose={handleCloseWalletDialog}>
        <DialogTitle>Jaką kwotę wpłacił użytkownik</DialogTitle>
        <DialogContent>
          <TextField
            label="Kwota"
            variant="outlined"
            type="number"
            value={fee}
            onChange={(e) => setFee(Number(e.target.value))}
            fullWidth
            margin="normal"
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseWalletDialog} color="secondary">Anuluj</Button>
          <Button onClick={handleUpdateWallet} color="primary">Zatwierdź</Button>
        </DialogActions>
      </Dialog>

      {/* Dialog do zmiany roli */}

      <Dialog open={roleDialogOpen} onClose={handleCloseRoleDialog}>
        <DialogTitle>Zmień rolę</DialogTitle>
        <DialogContent>
            <FormControl fullWidth margin="normal">
            <InputLabel>Nowa rola</InputLabel>
            <Select
                label="Nowa rola"
                value={newRole}
                onChange={(e) => setNewRole(e.target.value)}
            >
                <MenuItem value="ADMIN">ADMIN</MenuItem>
                <MenuItem value="USER">USER</MenuItem>
            </Select>
            </FormControl>
        </DialogContent>
        <DialogActions>
            <Button onClick={handleCloseRoleDialog} color="secondary">Anuluj</Button>
            <Button onClick={handleConfirmRoleChange} color="primary">Zatwierdź</Button>
        </DialogActions>
        </Dialog>
    </div>
  );
};

export default UsersTable;
