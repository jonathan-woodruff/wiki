import { checkProtected } from './api/auth';

const checkAuth = async () => {
    let data = {};
    data.isAuth = false;
    try {
        const response = await checkProtected();
        data = response.data;
        console.log('yoyoyo');
        console.log(data.isAuth);
        return data.isAuth;
    } catch(error) {
        return false;
    }
};

export const isAuth = await checkAuth();