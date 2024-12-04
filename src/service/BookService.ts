import axios from 'axios';
import { Book } from '../components/bookTable/types';
import { BookFormData } from '../components/addBookForm/AddBookForm';
import { toast } from 'react-toastify';

const BOOK_API_BASE_URL = "http://localhost:8080/api/book";

class BookService {
  // Pobierz listę książek
  getBooks() {
    const token = localStorage.getItem('token'); 
    return axios.get<Book[]>(BOOK_API_BASE_URL, {
        headers: {
            Authorization: `Bearer ${token}` 
        }
    });
  }

  addBook(body: BookFormData) {
    const token = localStorage.getItem('token');
    return axios.post(`${BOOK_API_BASE_URL}`, body, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  }

  generateReport() {
    const token = localStorage.getItem('token');
    return axios.get(`${BOOK_API_BASE_URL}/report`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      responseType: 'blob',
    })
  }

}

export default new BookService();
