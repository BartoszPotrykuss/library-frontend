import axios from "axios";
import { Author } from "../components/bookTable/types";
import { AuthorFormData } from "../components/addAuthorForm/AddAuthorForm";

const AUTHOR_API_BASE_URL = "http://localhost:8080/api/author";

class AuthorService {
    getAuthors() {
        const token = localStorage.getItem('token');
        return axios.get<Author[]>(AUTHOR_API_BASE_URL, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        })
    }

    addAuthor(body: AuthorFormData) {
        const token = localStorage.getItem('token');
        return axios.post(AUTHOR_API_BASE_URL, body, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        })
    }
}

export default new AuthorService();