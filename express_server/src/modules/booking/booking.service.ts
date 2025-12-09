import { pool } from "../../config/db";

const createBooking = async (customer_id: number, vehicle_id: number, rent_start_date: string, rent_end_date: string) => {
  const start = new Date(rent_start_date);
  const end = new Date(rent_end_date);
  if (Number.isNaN(start.getTime()) || Number.isNaN(end.getTime()) || end <= start) {
    throw new Error('Invalid rent dates');
  }

  const vehicleRes = await pool.query(`SELECT * FROM vehicles WHERE id = $1`, [vehicle_id]);
  if (vehicleRes.rows.length === 0) throw new Error('Vehicle not found');
  const vehicle = vehicleRes.rows[0];
  if (vehicle.availability_status !== 'available') throw new Error('Vehicle not available');

  const perDay = 24 * 60 * 60 * 1000;
  const days = Math.ceil((end.getTime() - start.getTime()) / perDay);
  const total_price = Number(vehicle.daily_rent_price) * days;

  const result = await pool.query(
    `INSERT INTO bookings(customer_id, vehicle_id, rent_start_date, rent_end_date, total_price, status) VALUES($1,$2,$3,$4,$5,$6) RETURNING *`,
    [customer_id, vehicle_id, rent_start_date, rent_end_date, total_price, 'active']
  );

  await pool.query(`UPDATE vehicles SET availability_status = 'booked', updated_at = NOW() WHERE id = $1`, [vehicle_id]);

  const booking = result.rows[0];
  booking.vehicle = { vehicle_name: vehicle.vehicle_name, daily_rent_price: vehicle.daily_rent_price };

  return booking;
};

const getBookings = async (userId: number, role: string) => {
  if (role === 'admin') {
    const res = await pool.query(
      `SELECT b.id, b.customer_id, b.vehicle_id, b.rent_start_date, b.rent_end_date, b.total_price, b.status, 
       json_build_object('name', u.name, 'email', u.email) as customer,
       json_build_object('vehicle_name', v.vehicle_name, 'registration_number', v.registration_number) as vehicle
       FROM bookings b 
       JOIN users u ON b.customer_id = u.id 
       JOIN vehicles v ON b.vehicle_id = v.id 
       ORDER BY b.id DESC`
    );

    return res;
  } else {
    const res = await pool.query(
      `SELECT b.id, b.vehicle_id, b.rent_start_date, b.rent_end_date, b.total_price, b.status,
       json_build_object('vehicle_name', v.vehicle_name, 'registration_number', v.registration_number, 'type', v.type) as vehicle
       FROM bookings b 
       JOIN vehicles v ON b.vehicle_id = v.id 
       WHERE b.customer_id = $1 
       ORDER BY b.id DESC`, 
      [userId]
    );

    return res;
  }
};

const updateBookingStatus = async (bookingId: string, status: string, userId: number, role: string) => {
  const res = await pool.query(`SELECT * FROM bookings WHERE id = $1`, [bookingId]);
  if (res.rows.length === 0) throw new Error('Booking not found');
  const booking = res.rows[0];

  if (role === 'customer' && booking.customer_id !== userId) {
    throw new Error('Unauthorized');
  }

  if (role === 'customer' && status !== 'cancelled') {
    throw new Error('Customers can only cancel bookings');
  }

  await pool.query(`UPDATE bookings SET status = $1, updated_at = NOW() WHERE id = $2`, [status, bookingId]);

  if (status === 'returned' || status === 'cancelled') {
    await pool.query(`UPDATE vehicles SET availability_status = 'available', updated_at = NOW() WHERE id = $1`, [booking.vehicle_id]);
  }

  const updated = await pool.query(
    `SELECT b.*, json_build_object('availability_status', v.availability_status) as vehicle FROM bookings b JOIN vehicles v ON b.vehicle_id = v.id WHERE b.id = $1`, 
    [bookingId]
  );

  return updated.rows[0];
};

export const bookingService = { createBooking, getBookings, updateBookingStatus };
