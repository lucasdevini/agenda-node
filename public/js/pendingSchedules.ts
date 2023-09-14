async function sendData(event:Event, form:HTMLFormElement) {
    event.preventDefault();

    const id = (form.querySelector('[name="id"]') as HTMLInputElement).value;
    const status = (form.querySelector('[name="status"]') as HTMLInputElement).value;

    const requestData = {
        id,
        status
    }; 

    try {
        const response = await fetch('/pending-schedules', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(requestData)
        });

        const responseData = await response.json();

        if (response.status === 200) {
            window.location.reload()
        } else {
            alert(responseData.error);
        } 
    } catch {
        alert('Ocorreu um erro ao processar sua solicitação. Por favor, tente novamente mais tarde.');
    }
}