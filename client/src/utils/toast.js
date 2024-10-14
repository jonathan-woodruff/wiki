import * as bootstrap from 'bootstrap'; //js

export const showToast = (div, title, body, titleText, bodyText, isSuccess=true) => {
    div.style.display = 'block';
    const toast = new bootstrap.Toast(div);
    title.innerHTML = titleText;
    body.innerHTML = bodyText;
    if (!isSuccess) div.classList.replace('bg-dark', 'bg-danger');
    toast.show();
};