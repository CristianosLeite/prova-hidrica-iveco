import { User } from '../types/user.type';

export interface IUserService {
    createUser(user: User): void;

    retrieveUserById(id: string): Promise<User>;

    retrieveAllUsers(): Promise<User[]>;

    getUserByBadgeNumber(badgeNumber: string): Promise<User>;

    updateUser(user: User): Promise<User>;

    deleteUser(id: string): Promise<User>;
}
