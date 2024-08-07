/// <reference types="astro/client" />

import type {User} from '@workos-inc/node';

declare global {
	namespace App {
		interface Locals {
			user: User;
		}
	}
}
