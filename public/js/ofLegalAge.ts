// Limita a usuário com 18 anos ou mais
const dateInput = document.getElementById("date") as HTMLInputElement;

const currentDay = new Date();
const maxDate = new Date(currentDay.getFullYear() - 18, currentDay.getMonth(), currentDay.getDate());

const maxYear = maxDate.getFullYear();
const maxMonth = (maxDate.getMonth() + 1).toString().padStart(2, '0');
const maxDay = maxDate.getDate().toString().padStart(2, '0');
dateInput.setAttribute("max", `${maxYear}-${maxMonth}-${maxDay}`);