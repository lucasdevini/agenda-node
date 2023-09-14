const questionForm = document.querySelector('form') as HTMLFormElement;

// Envia os dados do form para o backend
questionForm.addEventListener('submit', async (event) => {
    event.preventDefault();

    const answer1 = (questionForm.querySelector('[name="answer1"]') as HTMLInputElement).value;
    const answer2 = (questionForm.querySelector('[name="answer2"]') as HTMLInputElement).value;

    const requestData = {
        answer1,
        answer2
    };

    try {
        const response = await fetch('/question', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(requestData)
        });

        const responseData = await response.json();

        if (response.ok) {
            alert('Respostas corretas!');
            window.location.href = '/reset-password';
        } else if (response.status === 400) {
            if (responseData.errors) {
                alert(responseData.errors);
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