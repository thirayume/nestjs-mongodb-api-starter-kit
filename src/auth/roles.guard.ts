import { CanActivate, ExecutionContext, Injectable } from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { Observable } from "rxjs";
import { ROLES_KEY } from "./roles.decorator";
import { Role } from "./role.enum";

@Injectable()
export class RolesGuard implements CanActivate {
	constructor(
		private reflector: Reflector
	) { }

	canActivate(context: ExecutionContext): boolean {
		const reqRoles = this.reflector.getAllAndOverride<Role[]>(ROLES_KEY, [
			context.getHandler(),
			context.getClass(),
		]);

		if (!reqRoles) {
			return true;
		}

		const request = context.switchToHttp().getRequest();
		const user = request.user;

		return matchRoles(reqRoles, user?.role);
	}
}

function matchRoles(reqRoles: string[], userRole: string[]) {
	return reqRoles.some((role: string) => userRole?.includes(role));
}