import { User } from '../types/user.type';

export interface IUserService {
    createUser(user: User): Promise<User>

    retrieveUser(id: string): Promise<User>

    retrieveAllUsers(): Promise<User[]>

    getUserByBadgeNumber(badgeNumber: number): Promise<User>

    updateUser(user: User): Promise<User>

    deleteUser(id: string): Promise<User>
}
