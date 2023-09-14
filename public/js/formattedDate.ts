// Obtém a referência ao elemento do input de data
const inputDate = document.getElementById('date') as HTMLInputElement;

// Obtém a data atual no formato "YYYY-MM-DD" e atribui ao atributo min do input de data
const currentDate = new Date().toISOString().split('T')[0];
inputDate.min = currentDate;