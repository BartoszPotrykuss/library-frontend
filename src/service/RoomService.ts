import axios from "axios";

const ROOM_API_BASE_URL = "http://localhost:8080/api/room"

class RoomService {
    getRoom() {
        const token = localStorage.getItem('token');
        return axios.get(ROOM_API_BASE_URL, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
    }
}

export default new RoomService();