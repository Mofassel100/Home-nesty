import { Router } from 'express';
import { UserRoutes } from '../module/user/user.router';
import { AuthRoutes } from '../module/auth/auth.router';


const router = Router();

const moduleRoutes = [
  {
    path: '/auth',
    route: AuthRoutes,
  },
 
];

moduleRoutes.forEach((route) => router.use(route.path, route.route));

export default router;