<template>
    <awesome-snackbar :message="message" />
</template>
  
<script>
import AwesomeSnackbar from 'awesome-snackbar';
import router from '../router'
let inst = null


const showError = (errorMessage, type = 'error') => {
    if (errorMessage === 'Invalid token!') {
        inst = new AwesomeSnackbar(`${errorMessage} Please login!`, {
            afterHide: () => inst = null
        });
        localStorage.removeItem('sessionStorage')
        router.push('/login')
        return
    }
    if (type == 'welcome' && inst?.message?.includes('Welcome')) return
    if (type === 'welcome') {
        inst = new AwesomeSnackbar(`Welcome, `, {
            position: 'top-center',
            actionText: `${errorMessage}! 🤩`,
            afterHide: () => inst = null
        });
        return
    }

    inst = new AwesomeSnackbar(errorMessage, {
        afterHide: () => inst = null
    });
};

export { showError };
</script>
  
<style scoped></style>
  