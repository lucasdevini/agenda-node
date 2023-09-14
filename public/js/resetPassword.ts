const resetPasswordForm = document.querySelector('form') as HTMLFormElement;

// Envia os dados para o backend
resetPasswordForm.addEventListener('submit', async (event) => {
    event.preventDefault();

    const newPassword = (resetPasswordForm.querySelector('[name="new_password"]') as HTMLInputElement).value;
    const confirmPassword = (resetPasswordForm.querySelector('[name="confirm_password"]') as HTMLInputElement).value;

    const requestData = {
        newPassword,
        confirmPassword
    };

    try {
        const response = await fetch('/reset-password', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(requestData)
        });

        const responseData = await response.json();

        if (response.status === 200) {
            alert(responseData.success);
            window.location.href = '/login';
        } else if (response.status === 400) {
            if (responseData.errors) {
                alert(responseData.errors.join('\n'));
            } else if (responseData.error) {
                alert(responseData.error);
            }
        } else if(response.status === 429) {
            alert(responseData.limitError);
        } else if(response.status === 500) {
            alert('erro no alert do controller');
            window.location.href = '/register';
        }
    } catch (error) {
        alert('Ocorreu um erro ao processar sua solicitação. Por favor, tente novamente mais tarde.');
    }
});