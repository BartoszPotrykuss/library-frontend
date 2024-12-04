import { useEffect, useState } from 'react';
import TextField from '@mui/material/TextField';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import TableSortLabel from '@mui/material/TableSortLabel';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import { Book } from './types';
import { toast } from 'react-toastify';
import BookService from '../../service/BookService';
import RentalService from '../../service/RentalService';
import { saveAs } from 'file-saver'; 
import UploadIcon from '@mui/icons-material/Upload';

function BookTable() {
  const [books, setBooks] = useState<Book[]>([]);
  const [order, setOrder] = useState<'asc' | 'desc'>('asc');
  const [orderBy, setOrderBy] = useState<keyof Book>('title');
  const [titleFilter, setTitleFilter] = useState(''); // Filtr dla tytułu
  const [authorFilter, setAuthorFilter] = useState(''); // Filtr dla autora
  const [genreFilter, setGenreFilter] = useState(''); // Filtr dla gatunku
  const [loading, setLoading] = useState(false);
  const [selectedBook, setSelectedBook] = useState<Book | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);

  const role = localStorage.getItem('role');

  const fetchBooks = () => {
    setLoading(true);
    BookService.getBooks()
      .then(response => {
        setBooks(response.data);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        toast.error('Nie udało się pobrać danych o książkach.');
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchBooks();
  }, []);

  const handleBorrow = (book: Book) => {
    RentalService.rentBook(book.title)
      .then(() => {
        toast.success(`Książka "${book.title}" została wypożyczona!`);
        fetchBooks();
      })
      .catch(err => {
        console.error(err);
        toast.error(`Nie udało się wypożyczyć książki "${book.title}". Spróbuj ponownie.`);
      });
  };

  const handleSort = (property: keyof Book) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);

    const sortedBooks = [...books].sort((a, b) => {
      let aValue: any, bValue: any;

      if (property === 'author') {
        aValue = `${a.author.surname} ${a.author.name}`;
        bValue = `${b.author.surname} ${b.author.name}`;
      } else {
        aValue = a[property] ?? '';
        bValue = b[property] ?? '';
      }

      if (aValue < bValue) return isAsc ? -1 : 1;
      if (aValue > bValue) return isAsc ? 1 : -1;
      return 0;
    });

    setBooks(sortedBooks);
  };

  const handleOpenDialog = (book: Book) => {
    setSelectedBook(book);
    setDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setDialogOpen(false);
    setSelectedBook(null);
  };

  const handleConfirmBorrow = () => {
    if (selectedBook) {
      handleBorrow(selectedBook);
    }
    handleCloseDialog();
  };

  // Filtrowanie książek
  const filteredBooks = books.filter((book) => {
    const matchesTitle = book.title.toLowerCase().includes(titleFilter.toLowerCase());
    const matchesAuthor = `${book.author.name} ${book.author.surname}`.toLowerCase().includes(authorFilter.toLowerCase());
    const matchesGenre = book.genre?.toLowerCase().includes(genreFilter.toLowerCase());
    return matchesTitle && matchesAuthor && matchesGenre;
  });

  const handleGenerateReport = () => {
    setLoading(true);
    BookService.generateReport()
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
          label="Filtruj po tytule"
          variant="outlined"
          fullWidth
          value={titleFilter}
          onChange={(e) => setTitleFilter(e.target.value)}
        />
        <TextField
          label="Filtruj po autorze"
          variant="outlined"
          fullWidth
          value={authorFilter}
          onChange={(e) => setAuthorFilter(e.target.value)}
        />
        <TextField
          label="Filtruj po gatunku"
          variant="outlined"
          fullWidth
          value={genreFilter}
          onChange={(e) => setGenreFilter(e.target.value)}
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
        <Table sx={{ minWidth: 650 }} aria-label="Tabela książek">
          <TableHead>
            <TableRow>
              <TableCell>
                <TableSortLabel
                  active={orderBy === 'title'}
                  direction={orderBy === 'title' ? order : 'asc'}
                  onClick={() => handleSort('title')}
                >
                  Tytuł
                </TableSortLabel>
              </TableCell>
              <TableCell>
                <TableSortLabel
                  active={orderBy === 'author'}
                  direction={orderBy === 'author' ? order : 'asc'}
                  onClick={() => handleSort('author')}
                >
                  Autor
                </TableSortLabel>
              </TableCell>
              <TableCell>
                <TableSortLabel
                  active={orderBy === 'quantity'}
                  direction={orderBy === 'quantity' ? order : 'asc'}
                  onClick={() => handleSort('quantity')}
                >
                  Ilość
                </TableSortLabel>
              </TableCell>
              <TableCell>
                <TableSortLabel
                  active={orderBy === 'genre'}
                  direction={orderBy === 'genre' ? order : 'asc'}
                  onClick={() => handleSort('genre')}
                >
                  Gatunek
                </TableSortLabel>
              </TableCell>
              <TableCell>Akcja</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredBooks.map((book, index) => (
              <TableRow key={index}>
                <TableCell>{book.title}</TableCell>
                <TableCell>
                  {book.author.name} {book.author.surname}
                </TableCell>
                <TableCell>{book.quantity}</TableCell>
                <TableCell>{book.genre}</TableCell>
                <TableCell>
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={() => handleOpenDialog(book)}
                    disabled={loading || book.quantity === 0}
                    title={book.quantity === 0 ? 'Brak dostępnych egzemplarzy' : ''}
                  >
                    Wypożycz
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Dialog open={dialogOpen} onClose={handleCloseDialog}>
        <DialogTitle>Potwierdzenie wypożyczenia</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Czy na pewno chcesz wypożyczyć książkę "{selectedBook?.title}"?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog} color="secondary">
            Anuluj
          </Button>
          <Button onClick={handleConfirmBorrow} color="primary" autoFocus>
            Potwierdź
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}

export default BookTable;
