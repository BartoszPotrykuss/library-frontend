import { useEffect, useState } from 'react';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import Paper from '@mui/material/Paper';
import TableSortLabel from '@mui/material/TableSortLabel';
import { TextField, TableRow, Box } from '@mui/material';
import { Reservation } from './types';

import ReservationService from '../../service/ReservationService';
import { format } from 'date-fns';

const ReservationTable = () => {
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [order, setOrder] = useState<'asc' | 'desc'>('asc');
  const [orderBy, setOrderBy] = useState<keyof Reservation>('startDateTime');
  const [usernameFilter, setUsernameFilter] = useState('');
  const [roomFilter, setRoomFilter] = useState('');
  const [cancelledFilter, setCancelledFilter] = useState('');

  const fetchReservations = () => {
    ReservationService.getReservation()
      .then((response) => setReservations(response.data))
      .catch((err) => console.error(err));
  };

  useEffect(() => {
    fetchReservations();
  }, []);

  const handleSort = (property: keyof Reservation) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);

    const sortedReservations = [...reservations].sort((a, b) => {
      const aValue = a[property] ?? '';
      const bValue = b[property] ?? '';

      if (aValue < bValue) return isAsc ? -1 : 1;
      if (aValue > bValue) return isAsc ? 1 : -1;
      return 0;
    });

    setReservations(sortedReservations);
  };

  const formatDateTime = (dateTime: string) => {
    try {
      return format(new Date(dateTime), 'dd.MM.yyyy HH:mm');
    } catch (error) {
      console.error('Invalid date format:', dateTime);
      return dateTime; // fallback to raw value if formatting fails
    }
  };

  const filteredReservations = reservations.filter((reservation) => {
    const matchesUsername = reservation.username
      .toLowerCase()
      .includes(usernameFilter.toLowerCase());
    const matchesRoom = reservation.room.name
      .toLowerCase()
      .includes(roomFilter.toLowerCase());
    const matchesCancelled =
      cancelledFilter === ''
        ? true
        : reservation.cancelled === (cancelledFilter === 'true');

    return matchesUsername && matchesRoom && matchesCancelled;
  });

  return (
    <>
      {/* Pola filtrowania */}
      <Box display="flex" gap={2} marginBottom={2} padding={1}>
        <TextField
          label="Filtruj po użytkowniku"
          variant="outlined"
          value={usernameFilter}
          onChange={(e) => setUsernameFilter(e.target.value)}
          fullWidth
        />
        <TextField
          label="Filtruj po pokoju"
          variant="outlined"
          value={roomFilter}
          onChange={(e) => setRoomFilter(e.target.value)}
          fullWidth
        />
        <TextField
          label="Filtruj po zakończeniu (Tak/Nie)"
          variant="outlined"
          value={cancelledFilter}
          onChange={(e) => setCancelledFilter(e.target.value.toLowerCase())}
          placeholder="true/false"
          fullWidth
        />
      </Box>

      {/* Tabela */}
      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 650 }} aria-label="Tabela rezerwacji">
          <TableHead>
            <TableRow>
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
                  active={orderBy === 'startDateTime'}
                  direction={orderBy === 'startDateTime' ? order : 'asc'}
                  onClick={() => handleSort('startDateTime')}
                >
                  Data rozpoczęcia
                </TableSortLabel>
              </TableCell>
              <TableCell>
                <TableSortLabel
                  active={orderBy === 'endDateTime'}
                  direction={orderBy === 'endDateTime' ? order : 'asc'}
                  onClick={() => handleSort('endDateTime')}
                >
                  Data zakończenia
                </TableSortLabel>
              </TableCell>
              <TableCell>Pokój</TableCell>
              <TableCell>Zakończona</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredReservations.map((reservation) => (
              <TableRow key={reservation.id}
                sx={{backgroundColor: reservation.cancelled ? 'lightgray' : ''}}
              >
                <TableCell>{reservation.username}</TableCell>
                <TableCell>{formatDateTime(reservation.startDateTime)}</TableCell>
                <TableCell>{formatDateTime(reservation.endDateTime)}</TableCell>
                <TableCell>{reservation.room.name}</TableCell>
                <TableCell>
                  <span
                    style={{
                      color: reservation.cancelled ? 'red' : 'green',
                      fontWeight: 'bold',
                    }}
                  >
                    {reservation.cancelled ? 'Tak' : 'Nie'}
                  </span>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </>
  );
};

export default ReservationTable;
