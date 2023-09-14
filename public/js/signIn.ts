const signInForm = document.querySelector('form') as HTMLFormElement;

// Envia os dados inseridos no form para o backend
signInForm.addEventListener('submit', async (event) => {
    event.preventDefault();

    const email = (signInForm.querySelector('[name="email"]') as HTMLInputElement).value;
    const password = (signInForm.querySelector('[name="password"]') as HTMLInputElement).value;

    const requestData = {
        email: email,
        password: password
    };

    try {
        const response = await fetch('/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(requestData)
        });

        const responseData = await response.json();

        if (response.status === 400) {
            if (responseData.errors) {
                alert(responseData.errors.join('\n'));
            } else if (responseData.error) {
                alert(responseData.error);
            }
        } else if(response.status === 429) {
            alert(responseData.limitError);
        } else if(response.status === 200) {
            if(responseData.admin) {
                window.location.href = '/pending-schedules';
            } else if(responseData.user) {
                window.location.href = '/my-schedules';
            }
        }
    } catch (error) {
        console.log(error)
        alert('Ocorreu um erro ao processar sua solicitação. Por favor, tente novamente mais tarde.');
    }
});