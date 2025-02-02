import users from './users.json';

export interface User {
	userName: string;
	firstName: string;
	lastName: string;
	pin: string;
}

export function authenticateUser(userName: string, pin: string): User | undefined {
	return users.find((u) => u.userName === userName && u.pin === pin);
}
