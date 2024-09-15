import { checkProtected } from './api/auth';

const checkAuth = async () => {
    try {
        await checkProtected();
        return true;
    } catch(error) {
        return false;
    }
};

export const isAuth = await checkAuth();