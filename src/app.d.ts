// See https://kit.svelte.dev/docs/types#app
// for information about these interfaces

import type { User } from "$lib/users/auth";

// and what to do when importing types
declare global {
	namespace App {
	  interface Locals {
		user: User | null;
	  }
	  // interface Error {}
	  // interface PageData {}
	  // interface Platform {}
	}
  }
  
  export {};
  