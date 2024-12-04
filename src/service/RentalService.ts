import axios from "axios";
import { Rental } from "../components/rentalsTable/types";

const RENTAL_API_BASE_URL = "http://localhost:8080/api/rentals"

class RentalService {

  getRentals() {
    const token = localStorage.getItem('token');
    return axios.get(`${RENTAL_API_BASE_URL}/rent`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  }

  // Wypożycz książkę
  rentBook(bookTitle: string) {
    const token = localStorage.getItem('token');
    const requestBody = { title: bookTitle };
    return axios.post(`${RENTAL_API_BASE_URL}/rent`, requestBody, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  }

  deleteRental(rental: Rental) {
    const token = localStorage.getItem('token');
    return axios.patch(
      `${RENTAL_API_BASE_URL}/return/${rental.id}`, 
      {},
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
  }
  

  generateReport() {
    const token = localStorage.getItem('token');
    return axios.get(`${RENTAL_API_BASE_URL}/rent/report`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      responseType: 'blob',
    })
  }
}

export default new RentalService();