import { Router } from 'express';
import { vehicleController } from './vehicle.controller';
import auth from '../../middleware/auth';
import { requireRole } from '../../middleware/authorize';

const router = Router();

router.post('/', auth(), requireRole('admin'), vehicleController.createVehicle);

router.get('/', vehicleController.getVehicles);

router.get('/:vehicleId', vehicleController.getVehicle);

router.put('/:vehicleId', auth(), requireRole('admin'), vehicleController.updateVehicle);

router.delete('/:vehicleId', auth(), requireRole('admin'), vehicleController.deleteVehicle);

export const vehicleRoutes = router;
