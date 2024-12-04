import axios from "axios";
import { ReservationRequest } from "./types";

const RESERVATION_API_BASE_URL = "http://localhost:8080/api/reservation"

class ReservationService {
    getReservation() {
        const token = localStorage.getItem('token');
        return axios.get(RESERVATION_API_BASE_URL, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
    }

    addReservation(reservationRequest: ReservationRequest) {
        const token = localStorage.getItem('token');
        const requestBody = reservationRequest;
        return axios.post(RESERVATION_API_BASE_URL, requestBody, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
    }
}

export default new ReservationService();