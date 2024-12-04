import React, { useEffect, useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { TextField, Button, MenuItem, Box } from '@mui/material';
import RoomService from '../../service/RoomService';
import ReservationService from '../../service/ReservationService';
import { ReservationRequest } from '../../service/types';
import { Room } from './types';
import { toast } from 'react-toastify';

const AddReservationForm = () => {
  const { control, handleSubmit, reset } = useForm<ReservationRequest>();
  const [rooms, setRooms] = useState<Room[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Pobieranie dostępnych pokoi z RoomService
    RoomService.getRoom()
      .then((response) => setRooms(response.data))
      .catch((err) => console.error('Error fetching rooms:', err));
  }, []);

  const onSubmit = (data: ReservationRequest) => {
    setLoading(true);
    ReservationService.addReservation(data)
      .then(() => {
        toast.success('Rezerwacja została dodana!');
        reset(); // Czyszczenie formularza
      })
      .catch((err) => console.error('Error adding reservation:', err))
      .finally(() => setLoading(false));
  };

  return (
    <Box
      component="form"
      onSubmit={handleSubmit(onSubmit)}
      noValidate
      sx={{ display: 'flex', flexDirection: 'column', gap: 2, maxWidth: 400, margin: 'auto', mt: 5 }}
    >
      {/* Pole wyboru pokoju */}
      <Controller
        name="roomId"
        control={control}
        defaultValue={0}
        rules={{ required: 'Proszę wybrać pokój.' }}
        render={({ field, fieldState }) => (
          <TextField
            {...field}
            select
            label="Pokój"
            variant="outlined"
            fullWidth
            error={!!fieldState.error}
            helperText={fieldState.error?.message || 'Wybierz pokój z listy'}
          >
            {rooms.map((room) => (
              <MenuItem key={room.id} value={room.id}>
                {room.name} (Pojemność: {room.capacity})
              </MenuItem>
            ))}
          </TextField>
        )}
      />

      {/* Pole wyboru daty i godziny rozpoczęcia */}
      <Controller
        name="startDateTime"
        control={control}
        defaultValue=""
        rules={{ required: 'Proszę podać datę rozpoczęcia.' }}
        render={({ field, fieldState }) => (
          <TextField
            {...field}
            type="datetime-local"
            label="Data rozpoczęcia"
            variant="outlined"
            fullWidth
            error={!!fieldState.error}
            helperText={fieldState.error?.message || 'Podaj datę rozpoczęcia rezerwacji'}
            InputLabelProps={{ shrink: true }}
          />
        )}
      />

      {/* Pole wyboru daty i godziny zakończenia */}
      <Controller
        name="endDateTime"
        control={control}
        defaultValue=""
        rules={{
          required: 'Proszę podać datę zakończenia.',
        }}
        render={({ field, fieldState }) => (
          <TextField
            {...field}
            type="datetime-local"
            label="Data zakończenia"
            variant="outlined"
            fullWidth
            error={!!fieldState.error}
            helperText={fieldState.error?.message || 'Podaj datę zakończenia rezerwacji'}
            InputLabelProps={{ shrink: true }}
          />
        )}
      />

      {/* Przyciski */}
      <Button
        type="submit"
        variant="contained"
        color="primary"
        disabled={loading}
      >
        {loading ? 'Dodawanie...' : 'Dodaj rezerwację'}
      </Button>
    </Box>
  );
};

export default AddReservationForm;
