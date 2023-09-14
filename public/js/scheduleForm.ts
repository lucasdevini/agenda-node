const scheduleForm = document.getElementById('schedule-form') as HTMLFormElement;
const scheduleInputDate = document.getElementById('date') as HTMLInputElement;

// Impede que usuário selecione sábados ou domingos
scheduleInputDate.addEventListener('change', () => {
    const selectedDate = new Date(scheduleInputDate.value);
    const dayOfWeek = selectedDate.getDay(); 

    if (dayOfWeek === 5 || dayOfWeek === 6) {
        alert('Sábados e domingos não são permitidos.');
        scheduleInputDate.value = ''; // Limpa o valor selecionado
    }
});

// Envia os dados para o backend
scheduleForm.addEventListener('submit', async (event) => {
    event.preventDefault();

    const date = (scheduleForm.querySelector('[name="date"]') as HTMLInputElement).value;
    const hour = (scheduleForm.querySelector('[name="hour"]') as HTMLInputElement).value;

    const requestData = {
        date,
        hour
    }; 

    try {
        const response = await fetch('/schedule-form', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(requestData)
        });

        const responseData = await response.json();

        if (response.status === 200) {
            alert(responseData.success);
            window.location.href = '/my-schedules';
        } else if(response.status === 400) {
            if (responseData.errors) {
                alert(responseData.errors);
            } else if (responseData.error) {
                alert(responseData.error);
            }
        } 
    } catch {
        alert('Ocorreu um erro ao processar sua solicitação. Por favor, tente novamente mais tarde.');
    }
});