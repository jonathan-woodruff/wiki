import { checkProtected } from './api/auth';

const checkAuth = async () => {
    try {
        console.log('hi');
        await checkProtected();
        console.log('yo yo');
        return true;
    } catch(error) {
        return false;
    }
};

export const isAuth = await checkAuth();