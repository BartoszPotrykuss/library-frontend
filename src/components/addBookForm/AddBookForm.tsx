import { useEffect, useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { TextField, Button, MenuItem, Select, InputLabel, FormControl, Box, Autocomplete } from "@mui/material";
import BookService from "../../service/BookService";
import { toast } from "react-toastify";
import AuthorService from "../../service/AuthorService";
import { Author } from "../bookTable/types";

export interface BookFormData {
  title: string;
  author: Author;
  quantity: number;
  genre: string;
}

const AddBookForm = () => {
  const { register, watch , handleSubmit, control, setValue, reset, formState: { errors } } = useForm<BookFormData>();
  const [existingTitles, setExistingTitles] = useState<string[]>([]);
  const [authors, setAuthors] = useState<Author[]>([]);
  const [books, setBooks] = useState<any[]>([]);

  useEffect(() => {
    BookService.getBooks().then((response) => {
      setBooks(response.data);
      setExistingTitles(response.data.map((book: { title: string }) => book.title));
    });
    AuthorService.getAuthors().then((response) => {
      setAuthors(response.data);
    });
  }, []);

  const handleTitleChange = (value: string | null) => {
    const selectedBook = books.find((book) => book.title === value);
    if (selectedBook) {
      setValue("author", selectedBook.author);
      setValue("genre", selectedBook.genre);
    }
  };

  const onSubmit = (data: BookFormData) => {
    const payload = { ...data };
    BookService.addBook(payload)
      .then(() => {
        toast.success("Książka dodana pomyślnie!");
        reset();
      })
      .catch((err) => {
        console.error("Błąd dodawania książki:", err);
        toast.error("Książka nie została pomyślnie dodana");
      });
  };

  return (
    <Box
      component="form"
      onSubmit={handleSubmit(onSubmit)}
      sx={{ maxWidth: 500, margin: "auto", mt: 4, p: 3, boxShadow: 2, borderRadius: 2 }}
    >
    <Controller
      name="title"
      control={control}
      rules={{ required: "Tytuł jest wymagany" }}
      render={({ field }) => (
        <Autocomplete
          {...field}
          options={existingTitles}
          freeSolo
          value={field.value || ""} // Synchronizacja wartości
          onChange={(event, value) => {
            field.onChange(value); // Ustawienie wartości w react-hook-form
            handleTitleChange(value); // Uzupełnienie pozostałych danych
          }}
          renderInput={(params) => (
            <TextField
              {...params}
              label="Tytuł książki"
              variant="outlined"
              error={!!errors.title}
              helperText={errors.title?.message}
            />
          )}
        />
      )}
    />


      <FormControl fullWidth margin="normal">
        <InputLabel id="author-label">Autor</InputLabel>
        <Controller
          name="author"
          control={control}
          rules={{ required: "Wybierz autora" }}
          render={({ field }) => (
            <Select
              labelId="author-label"
              {...field}
              value={field.value ? field.value.id : ""}
              onChange={(event) => {
                const selectedAuthor = authors.find((author) => author.id === event.target.value);
                field.onChange(selectedAuthor);
              }}
            >
              {authors.map((author) => (
                <MenuItem key={author.id} value={author.id}>
                  {author.name} {author.surname}
                </MenuItem>
              ))}
            </Select>
          )}
        />
        {errors.author && <span>{errors.author.message}</span>}
      </FormControl>

      <TextField
        label="Ilość sztuk"
        type="number"
        variant="outlined"
        fullWidth
        margin="normal"
        {...register("quantity", {
          required: "Podaj ilość sztuk",
          min: { value: 1, message: "Ilość musi być większa od 0" },
        })}
      />
      {errors.quantity && <span>{errors.quantity.message}</span>}

            <TextField
        label="Gatunek"
        variant="outlined"
        fullWidth
        margin="normal"
        InputLabelProps={{
          shrink: !!watch("genre"), // Etykieta się przesuwa, gdy jest wartość
        }}
        {...register("genre", { required: "Podaj gatunek" })}
      />
      {errors.genre && <span>{errors.genre.message}</span>}

      <Button type="submit" variant="contained" color="primary" fullWidth sx={{ mt: 3 }}>
        Dodaj książkę
      </Button>
    </Box>
  );
};

export default AddBookForm;
