import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Movies from './pages/Movies';
import MovieDetail from './pages/MovieDetail';
import Events from './pages/Events';
import ReservationPage from './pages/ReservationPage'; 
import MyPage from './pages/MyPage';
import SignUp from './pages/SignUp';
import SignIn from './pages/SignIn';
import AdminScreenPage from './pages/AdminScreenPage';
import AdminPage from './pages/AdminPage';
import AdminSchedulePage from './pages/AdminSchedulePage';
import AdminCouponPage from './pages/AdminCouponPage';
import AdminEventPage from './pages/AdminEventPage';
import AdminMoviePage from './pages/AdminMoviePage';
import SeatSelectionPage from './pages/SeatSelectionPage';
import SearchResultPage from './pages/SearchResultPage';
import Coupons from './pages/Coupons';
import Wishlist from './pages/Wishlist';
import PaymentPage from './pages/PaymentPage';
import ReservationHistoryPage from './pages/ReservationHistoryPage';
import ReviewRegister from './pages/ReviewRegister';
import MyReveiw from './pages/MyReview';
import MyEvent from './pages/MyEvent';
import Rejoin from './pages/Rejoin';
import Update from './pages/Update';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/movies" element={<Movies />} />
        <Route path="/movies/:movieId" element={<MovieDetail />} />
        <Route path="/events" element={<Events />} />
        <Route path="/reservation" element={<ReservationPage />} /> 
        <Route path="/reservation/seats/:scheduleId" element={<SeatSelectionPage />} />
        <Route path="/payment" element={<PaymentPage />} />
        <Route path="/mypage" element={<MyPage />} />
        <Route path="/review/:movieId" element={<ReviewRegister />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/signin" element={<SignIn />} />
        <Route path="/rejoin" element={<Rejoin />} />
        <Route path="/admin" element={<AdminPage />} />
        <Route path="/admin/screens" element={<AdminScreenPage />} />
        <Route path="/admin/schedules" element={<AdminSchedulePage />} />
        <Route path="/admin/coupons" element={<AdminCouponPage />} />
        <Route path="/admin/events" element={<AdminEventPage />} />
        <Route path="/admin/movies" element={<AdminMoviePage />} />
        <Route path="/search" element={<SearchResultPage />} />
        <Route path="/coupons" element={<Coupons />} />
        <Route path="/wishlist" element={<Wishlist />} />
        <Route path="/reservation/history" element={<ReservationHistoryPage />} />
        <Route path="/myreview" element={<MyReveiw />} />
        <Route path="/myevent" element={<MyEvent />} />
        <Route path="/update" element={<Update />} />
      </Routes>
    </Router>
  );
}

export default App;
