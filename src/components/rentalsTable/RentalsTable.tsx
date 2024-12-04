import { useEffect, useState } from 'react';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import TableSortLabel from '@mui/material/TableSortLabel';
import TextField from '@mui/material/TextField';
import { Rental } from './types';
import RentalService from '../../service/RentalService';
import { Button, Box, Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions } from '@mui/material';
import { toast } from 'react-toastify';
import { saveAs } from 'file-saver'; 
import UploadIcon from '@mui/icons-material/Upload';

const RentalsTable = () => {
  const [rentals, setRentals] = useState<Rental[]>([]);
  const [order, setOrder] = useState<'asc' | 'desc'>('asc');
  const [orderBy, setOrderBy] = useState<keyof Rental>('bookTitle');
  const [bookTitleFilter, setBookTitleFilter] = useState('');
  const [usernameFilter, setUsernameFilter] = useState('');
  const [dateFilter, setDateFilter] = useState('');
  const [loading, setLoading] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedRental, setSelectedRental] = useState<Rental | null>(null);

  const role = localStorage.getItem('role');

  const fetchRentals = () => {
    setLoading(true);
    RentalService.getRentals()
      .then((response) => {
        setRentals(response.data);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchRentals();
  }, []);

  const handleSort = (property: keyof Rental) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);

    const sortedRentals = [...rentals].sort((a, b) => {
      const aValue = a[property] ?? '';
      const bValue = b[property] ?? '';

      if (aValue < bValue) return isAsc ? -1 : 1;
      if (aValue > bValue) return isAsc ? 1 : -1;
      return 0;
    });

    setRentals(sortedRentals);
  };

  const handleDeleteRental = (rental: Rental) => {
    RentalService.deleteRental(rental)
      .then(() => {
        toast.warn("Wypożyczenie usunięte");
        fetchRentals();
      })
      .catch(err => {
        console.error(err);
        toast.error("Nie udało się usunąć wypożyczenia");
      });
  };

  const handleOpenDialog = (rental: Rental) => {
    setSelectedRental(rental);
    setDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setDialogOpen(false);
    setSelectedRental(null);
  };

  const handleConfirmDeleteRental = () => {
    if (selectedRental) {
      handleDeleteRental(selectedRental);
    }
    handleCloseDialog();
  };

  const filteredRentals = rentals.filter((rental) => {
    const matchesBookTitle = rental.bookTitle.toLowerCase().includes(bookTitleFilter.toLowerCase());
    const matchesUsername = rental.username.toLowerCase().includes(usernameFilter.toLowerCase());
    const matchesDate = 
      rental.startDate.includes(dateFilter) || rental.endDate.includes(dateFilter);
    return matchesBookTitle && matchesUsername && matchesDate;
  });

  const handleGenerateReport = () => {
    setLoading(true);
    RentalService.generateReport()
      .then((response) => {
        const blob = new Blob([response.data], { type: 'application/pdf' });
        saveAs(blob, 'book_report.pdf');
        toast.success('Raport został wygenerowany!');
      })
      .catch((err) => {
        console.error(err);
        toast.error('Nie udało się wygenerować raportu.');
      })
      .finally(() => {
        setLoading(false);
      });
  };

  return (
    <>
      {/* Pola filtrowania */}
      <div style={{ display: 'flex', gap: '1rem', marginBottom: '1rem', padding: 10 }}>
        <TextField
          label="Filtruj po tytule książki"
          variant="outlined"
          fullWidth
          value={bookTitleFilter}
          onChange={(e) => setBookTitleFilter(e.target.value)}
        />
        <TextField
          label="Filtruj po użytkowniku"
          variant="outlined"
          fullWidth
          value={usernameFilter}
          onChange={(e) => setUsernameFilter(e.target.value)}
        />
        <TextField
          label="Filtruj po dacie"
          variant="outlined"
          fullWidth
          placeholder="YYYY-MM-DD"
          value={dateFilter}
          onChange={(e) => setDateFilter(e.target.value)}
        />
        {role == "ADMIN" && (
          <Button
            variant="contained"
            color="success"
            onClick={handleGenerateReport}
            disabled={loading}
            sx={{ width: '50%' }} 
          >
            <UploadIcon />
            Generuj raport
          </Button>
        )}
      </div>

      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 650 }} aria-label="Tabela wypożyczeń">
          <TableHead>
            <TableRow>
              <TableCell>
                <TableSortLabel
                  active={orderBy === 'bookTitle'}
                  direction={orderBy === 'bookTitle' ? order : 'asc'}
                  onClick={() => handleSort('bookTitle')}
                >
                  Tytuł książki
                </TableSortLabel>
              </TableCell>
              <TableCell>
                <TableSortLabel
                  active={orderBy === 'startDate'}
                  direction={orderBy === 'startDate' ? order : 'asc'}
                  onClick={() => handleSort('startDate')}
                >
                  Data wypożyczenia
                </TableSortLabel>
              </TableCell>
              <TableCell>
                <TableSortLabel
                  active={orderBy === 'endDate'}
                  direction={orderBy === 'endDate' ? order : 'asc'}
                  onClick={() => handleSort('endDate')}
                >
                  Termin oddania
                </TableSortLabel>
              </TableCell>
              <TableCell>
                <TableSortLabel
                  active={orderBy === 'username'}
                  direction={orderBy === 'username' ? order : 'asc'}
                  onClick={() => handleSort('username')}
                >
                  Użytkownik
                </TableSortLabel>
              </TableCell>
              <TableCell>
                <TableSortLabel
                  active={orderBy === 'isReturned'}
                  direction={orderBy === 'isReturned' ? order : 'asc'}
                  onClick={() => handleSort('isReturned')}
                >
                  Zwrócono
                </TableSortLabel>
              </TableCell>
              {role === 'ADMIN' && <TableCell>Akcja</TableCell>}
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredRentals.map((rental, index) => (
              <TableRow key={index}>
                <TableCell>{rental.bookTitle}</TableCell>
                <TableCell>{rental.startDate}</TableCell>
                <TableCell>{rental.endDate}</TableCell>
                <TableCell>{rental.username}</TableCell>
                <TableCell>
                  <span
                    style={{
                      color: rental.isReturned ? 'green' : 'red',
                      fontWeight: 'bold',
                    }}
                  >
                    {rental.isReturned ? 'Zwrócono' : 'Nie zwrócono'}
                  </span>
                </TableCell>
                {role === 'ADMIN' && (
                  <TableCell>
                    <Box sx={{ display: 'flex', gap: 1 }}>
                      {!rental.isReturned && (
                        <Button
                        variant="contained"
                        sx={{
                          background: 'linear-gradient(45deg, #f44336 30%, #e53935 90%)',
                          color: '#fff',
                          boxShadow: '0px 3px 5px 2px rgba(244, 67, 54, 0.3)',
                          '&:hover': {
                            background: 'linear-gradient(45deg, #d32f2f 30%, #c62828 90%)',
                          },
                        }}
                        onClick={() => handleOpenDialog(rental)}
                      >
                        ZWRÓĆ
                      </Button>
                      )}
                    </Box>
                  </TableCell>
                )}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Dialog open={dialogOpen} onClose={handleCloseDialog}>
        <DialogTitle>Potwierdzenie wypożyczenia</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Czy użytkownik {selectedRental?.username} na pewno oddał książkę {selectedRental?.bookTitle}?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog} color="secondary">
            Anuluj
          </Button>
          <Button onClick={handleConfirmDeleteRental} color="primary" autoFocus>
            Potwierdź
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default RentalsTable;
