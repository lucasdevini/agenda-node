const phoneInput = document.getElementById('phone') as HTMLInputElement;

// formata o valor digitado no campo phone de acordo com a mudança no valor digitado
phoneInput.addEventListener('input', (event) => {
    const input = (event.target as HTMLInputElement).value.replace(/\D/g, '');
    const formattedInput = formatPhoneNumber(input);

    phoneInput.value = formattedInput;
});

// molda o que foi digitado no campo para o padrão desejado - (xx) xxxxx-xxxx -
function formatPhoneNumber(value: string): string {
    const cleanedValue = value.replace(/\D/g, '');
    const match = cleanedValue.match(/^(\d{2})(\d{0,5})(\d{0,4})$/);

    if (match) {
        return '(' + match[1] + ') ' + match[2] + (match[2] && match[3] ? '-' : '') + match[3];
    }

    return value;
}

// Envia os dados do form para o backend
const forgotPasswordForm = document.querySelector('form') as HTMLFormElement;

forgotPasswordForm.addEventListener('submit', async (event: Event) => {
    event.preventDefault();

    const date = (forgotPasswordForm.querySelector('[name="date"]') as HTMLInputElement).value;
    const email = (forgotPasswordForm.querySelector('[name="email"]') as HTMLInputElement).value;
    const phone = (forgotPasswordForm.querySelector('[name="phone"]') as HTMLInputElement).value;

    const requestData = {
        date,
        email,
        phone
    };

    try {
        const response = await fetch('/forgot-password', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(requestData)
        });

        const responseData = await response.json();

        if (response.status === 400) {
            if (responseData.errors) {
                alert(responseData.errors);
            } else if (responseData.error) {
                alert(responseData.error);
            }
        } else if (response.status === 429) {
            alert(responseData.limitError);
        } else if (response.status === 200) {
            window.location.href = '/question';
        }
    } catch (error) {
        alert('Ocorreu um erro ao processar sua solicitação. Por favor, tente novamente mais tarde.');
    }
});
