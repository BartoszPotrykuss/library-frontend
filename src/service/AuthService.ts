import axios from "axios";

const AUTH_BASE_API_URL = "http://localhost:8080/auth";

class AuthService {
    register(name: string, password: string, email: string) {
        return axios.post(`${AUTH_BASE_API_URL}/register`, { name, password, email });
    }

    login(username: string, password: string) {
        return axios.post(`${AUTH_BASE_API_URL}/token`, { username, password });
    }

    logout() {
        localStorage.removeItem('token');
    }

    getUsers() {
        const token = localStorage.getItem('token');
        return axios.get(`${AUTH_BASE_API_URL}/api/users`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
      }

    updateUserWallet(username: string, fee: number) {
        const token = localStorage.getItem('token');
        return axios.patch(
        `${AUTH_BASE_API_URL}/api/user/username/${username}/wallet`,
        JSON.stringify(-fee),
        {
            headers: {
                Authorization: `Bearer ${token}`,
                'Content-Type': 'application/json', 
                },
        }
        );
    }
  
    updateUserRole(username: string, newRole: string) {
        const token = localStorage.getItem('token');
        return axios.patch(
            `${AUTH_BASE_API_URL}/api/user/${username}/role`,
            newRole,
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'text/plain',
                },
            }
        );
    }
    
    getUserWallet(username: string) {
        const token = localStorage.getItem('token');
        return axios.get(`${AUTH_BASE_API_URL}/api/user/${username}/wallet`,{
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });
    }
      
}

export default new AuthService();