import { Router } from 'express';
import { bookingController } from './booking.controller';
import auth from '../../middleware/auth';
import { requireAnyRole } from '../../middleware/authorize';

const router = Router();

router.post('/', auth(), requireAnyRole(['admin','customer']), bookingController.createBooking);

router.get('/', auth(), requireAnyRole(['admin','customer']), bookingController.getBookings);

router.put('/:bookingId', auth(), requireAnyRole(['admin','customer']), bookingController.updateBooking);

export const bookingRoutes = router;
