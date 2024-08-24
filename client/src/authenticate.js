import { checkProtected, onLogout } from './api/auth';

const checkAuth = async () => {
    const isLocalAuth = localStorage.getItem('isAuth'); //check local storage
    if (isLocalAuth === 'false') { //check if there is an auth token
        try {
            await checkProtected();
            localStorage.setItem('isAuth', 'true');
        } catch(error) {
            window.location.href = './login.html';
        }
    }
};

checkAuth();