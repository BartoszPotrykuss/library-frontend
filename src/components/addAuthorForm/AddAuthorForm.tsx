import React from "react";
import { useForm } from "react-hook-form";
import { TextField, Button, Box } from "@mui/material";
import { toast } from "react-toastify";
import AuthorService from "../../service/AuthorService";

// Typ danych formularza
export interface AuthorFormData {
  name: string;
  surname: string;
}

const AddAuthorForm = () => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<AuthorFormData>();

  const onSubmit = (data: AuthorFormData) => {
    AuthorService.addAuthor(data)
      .then(() => {
        toast.success("Autor został pomyślnie dodany!");
        reset(); // Resetuje formularz po sukcesie
      })
      .catch((err) => {
        console.error("Błąd podczas dodawania autora:", err);
        toast.error("Nie udało się dodać autora.");
      });
  };

  return (
    <Box
      component="form"
      onSubmit={handleSubmit(onSubmit)}
      sx={{ maxWidth: 400, margin: "auto", mt: 4, p: 3, boxShadow: 2, borderRadius: 2 }}
    >
      {/* Imię */}
      <TextField
        label="Imię"
        variant="outlined"
        fullWidth
        margin="normal"
        {...register("name", { required: "Imię jest wymagane" })}
        error={!!errors.name}
        helperText={errors.name?.message}
      />

      {/* Nazwisko */}
      <TextField
        label="Nazwisko"
        variant="outlined"
        fullWidth
        margin="normal"
        {...register("surname", { required: "Nazwisko jest wymagane" })}
        error={!!errors.surname}
        helperText={errors.surname?.message}
      />

      {/* Przycisk */}
      <Button type="submit" variant="contained" color="primary" fullWidth sx={{ mt: 3 }}>
        Dodaj autora
      </Button>
    </Box>
  );
};

export default AddAuthorForm;
