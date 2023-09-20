const form = document.querySelector('form') as HTMLFormElement;

// Referências dos campos do form
const userName = (form.querySelector('[name="name"]') as HTMLInputElement);
const userDate = (form.querySelector('[name="date"]') as HTMLInputElement);
const userEmail = (form.querySelector('[name="email"]') as HTMLInputElement);
const userPhone = (form.querySelector('[name="phone"]') as HTMLInputElement);
const userPassword = (form.querySelector('[name="password"]') as HTMLInputElement);
const userQuestion1 = (form.querySelector('[name="question1"]') as HTMLInputElement);
const userAnswer1 = (form.querySelector('[name="answer1"]') as HTMLInputElement);
const userQuestion2 = (form.querySelector('[name="question2"]') as HTMLInputElement);
const userAnswer2 = (form.querySelector('[name="answer2"]') as HTMLInputElement);
//

// Armazena os campos de input
const dadosPessoaisDiv = document.getElementById('dados-pessoais') as HTMLElement;
const dadosPessoaisInputs = dadosPessoaisDiv.querySelectorAll('input');

const perguntasSegurancaDiv = document.getElementById('perguntas-seguranca') as HTMLElement;
const perguntasSegurancaInputs = perguntasSegurancaDiv.querySelectorAll('input');

// Função para limitar a entrada do input name a letras
function validarNome(input: HTMLInputElement) {
    input.value = input.value.replace(/[^a-zA-ZÀ-ÿ\s]/g, '');
}

// Função para limitar a entrada dos inputs answers a letras, números, hífen e espaços
function validarResposta(input: HTMLInputElement) {
    input.value = input.value.replace(/[^a-zA-Z0-9\s-]/g, '');
}

// Função para atualizar o estilo do input
function updateInputStyle(input: HTMLInputElement, isValid: boolean) {
    if (isValid) {
        input.classList.remove('border-red-700');
        input.classList.add('border-green-700');
    } else {
        input.classList.remove('border-green-700');
        input.classList.add('border-red-700');
    }
}

// verifica se os dados inseridos nos inputs de dados pessoais são válidos:
for(let i = 0; i < dadosPessoaisInputs.length; i++) {
    dadosPessoaisInputs[i].addEventListener('input', () => {
        const nameInput = dadosPessoaisInputs[i].value;

        if (dadosPessoaisInputs[i].name === 'name') {
            validarNome(dadosPessoaisInputs[i]);
        } else if(dadosPessoaisInputs[i].name === 'email') {
            updateInputStyle(dadosPessoaisInputs[i], false);

            if(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(nameInput)) {
                updateInputStyle(dadosPessoaisInputs[i], true);
            }
        } else if(dadosPessoaisInputs[i].name === 'phone') {
            // inputmask como o campo telefone
            const phoneInput = document.getElementById('phone') as HTMLInputElement;
    
            function formatPhoneNumber(value: string) {
                const cleanedValue = value.replace(/\D/g, '');
                const match = cleanedValue.match(/^(\d{2})(\d{0,5})(\d{0,4})$/);
                
                if (match) {
                    return (match[1] ? '(': '') + match[1] + (match[2]  ? ') ' : '') + match[2] + (match[2] && match[3] ? '-' : '') + match[3];
                }
        
                return value;
            }

            phoneInput.addEventListener('input', (event) => {
                const input = (event.target as HTMLInputElement).value.replace(/\D/g, '');
                const formattedInput = formatPhoneNumber(input);
            
                phoneInput.value = formattedInput;
            });
            //

            updateInputStyle(dadosPessoaisInputs[i], false);

            if(/^\(\d{2}\) \d{4,5}-\d{4}$/.test(nameInput)) {
                updateInputStyle(dadosPessoaisInputs[i], true);
            }
        } else if (dadosPessoaisInputs[i].name === 'password') {
            updateInputStyle(dadosPessoaisInputs[i], false);
            
            if(nameInput.length >= 8 && /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[$*&@#^()_+\-=\[\]{}|\\:;'"<>,.?\/])[0-9a-zA-Z$*&@#^()_+\-=\[\]{}|\\:;'"<>,.?\/]{8,}$/.test(nameInput)) {
                updateInputStyle(dadosPessoaisInputs[i], true);
            } 
        }
    });  
}    

const selects = document.querySelectorAll('select');

for (let i = 0; i < selects.length; i++) {
    selects[i].addEventListener('change', () => {
        const selectedOption = selects[i].value;

        for (let j = 0; j < selects.length; j++) {
            if (i !== j) {
                const options = selects[j].querySelectorAll('option');
                options.forEach(option => {
                    if (option.value === selectedOption) {
                        option.disabled = true;
                    } else {
                        option.disabled = false;
                    }
                });
            }
        }
    });
}

// verifica se os dados inseridos nos inputs de resposta de segurança são válidos:
for(let i = 0; i < perguntasSegurancaInputs.length; i++) {
    perguntasSegurancaInputs[i].addEventListener('input', () => {
        validarResposta(perguntasSegurancaInputs[i]);
    });  
} 

// Envia os dados para o backend
form.addEventListener('submit', async (event) => {
    event.preventDefault();

    // Dados enviados na requisição
    const requestData = {
        name: userName.value,
        date: userDate.value,
        email: userEmail.value,
        phone: userPhone.value,
        password: userPassword.value,
        question1: userQuestion1.value,
        answer1: userAnswer1.value,
        question2: userQuestion2.value,
        answer2: userAnswer2.value
    };

    try {
        const response = await fetch('/register', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(requestData)
        });

        const responseData = await response.json();

        // Tratamento das respostas do servidor  
        if (response.status === 200) {
            alert('Cadastro realizado com sucesso!');
            window.location.href = '/login';
        } else if (response.status === 400) {
            if (responseData.errors) {
                responseData.errors.forEach((error: any) => {
                    const { msg, path } = error;
                    const errorElement = document.getElementById(`${path}Error`);
                    
                    // Erros da parte de dados pessoais
                    const pathsPessoais = [
                        'name', 
                        'date', 
                        'email', 
                        'phone', 
                        'password'
                    ]

                    // Retorna o usuário a parte de dados pessoais caso haja algum erro
                    let erroValidacao = false;

                    for (let i = 0; i < pathsPessoais.length; i++) {
                        if (path === pathsPessoais[i]) {
                            erroValidacao = true;
                            break;
                        }
                    }

                    // Insere o erro abaixo do respectivo input
                    if (errorElement) {
                        const errorInput = document.querySelector(`#${path}`) as HTMLElement;

                        const clearErrorStyles = () => {
                            errorInput.style.borderColor = '';
                            errorElement.textContent = '';
                        };

                        if (errorInput) {
                            errorInput.style.borderColor = 'red';
                            errorInput.addEventListener('input', clearErrorStyles);
                        }

                        errorElement.textContent = msg;
                    }
                });
            } else if (responseData.error) {
                alert(responseData.error);
            }
        } else if(response.status === 500) {
            alert('erro no alert do controller');
            window.location.href = '/register';
        }
    } catch (error) {
        alert('Ocorreu um erro ao processar sua solicitação. Por favor, tente novamente mais tarde.');
    }
});
//