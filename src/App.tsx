import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Navbar from './components/navbar/NavBar';
import BorrowBook from './pages/borrowBook/BorrowBook';
import 'react-toastify/dist/ReactToastify.css';
import { ToastContainer } from 'react-toastify';
import Register from './components/register/Register';
import ProtectedRoute from './components/protectedRoute/ProtectedRoute';
import Login from './components/login/Login';
import Rentals from './pages/rentals/Rentals';
import AddBook from './pages/addBook/AddBook';
import ProtectedAdminRoute from './components/protectedAdminRoute/ProtectedAdminRoute';
import AddAuthor from './pages/addAuthor/AddAuthor';
import Reservations from './pages/reservations/Reservations';
import AddReservation from './pages/addReservation/AddReservation';
import Users from './pages/users/Users';


function App() {
  return (
    <BrowserRouter>
      <Navbar />
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path='/' element={
          <ProtectedRoute>
            <BorrowBook />
          </ProtectedRoute>
          }
        />
        <Route path='/rentals' element={
          <ProtectedRoute>
            <Rentals />
          </ProtectedRoute>
        }
        />
        <Route path='/reservations' element={
          <ProtectedRoute>
            <Reservations />
          </ProtectedRoute>
        }
        />
        <Route path='/addReservation' element={
          <ProtectedRoute>
            <AddReservation />
          </ProtectedRoute>
        }
        />
        <Route path='/addBook' element={
          <ProtectedAdminRoute>
            <AddBook />
          </ProtectedAdminRoute>
        } />
        <Route path='/addAuthor' element={
          <ProtectedAdminRoute>
            <AddAuthor />
          </ProtectedAdminRoute>
        } />
        <Route path='/users' element={
          <ProtectedAdminRoute>
            <Users />
          </ProtectedAdminRoute>
        } />
      </Routes>
      <ToastContainer position='bottom-right'/>
    </BrowserRouter>
  );
}

export default App;
