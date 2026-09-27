import { Router } from "express";
import { UserRoutes } from "../module/user/user.router";
import { AuthRoutes } from "../module/auth/auth.router";
import { PropertyRoutes } from "../module/property/property.router";
import { BookingRoutes } from "../module/booking/booking.router";

const router = Router();

const moduleRoutes = [
	{
		path: "/auth",
		route: AuthRoutes,
	},
	{
		path: "/property",
		route: PropertyRoutes,
	},
	{
		path: "/users",
		route: UserRoutes,
	},
	{
		path: "/booking",
		route: BookingRoutes,
	},
];

moduleRoutes.forEach((route) => router.use(route.path, route.route));

export default router;
