import { checkProtected, onLogout } from './api/auth';

const checkAuth = async () => {
    const isLocalAuth = localStorage.getItem('isAuth'); //check local storage
    if (isLocalAuth === 'false') { //check if there is an auth token
        try {
            await checkProtected();
            localStorage.setItem('isAuth', 'true');
        } catch(error) {
            localStorage.setItem('isAuth', 'false');
            window.location.href = './login.html';
            await onLogout();
        }
    }
};

checkAuth();