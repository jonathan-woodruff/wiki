import { checkProtected } from './api/auth';

const checkAuth = async () => {
    try {
        await checkProtected();
    } catch(error) {
        window.location.href = './login.html';
    }
};

checkAuth();