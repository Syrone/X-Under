import VanillaCalendar from 'vanilla-calendar-pro';

const today = new Date();
const formattedToday = today.toISOString().split('T')[0];
const calendars = document.querySelectorAll('.vanilla-calendar')

calendars?.forEach((wrapperClass) => {

	const calendar = new VanillaCalendar(wrapperClass, {
		date: {
			max: formattedToday,
		},
		actions: {
			clickDay(event, self) {
				const parentCalendar = self.HTMLElement.closest('.dropdown-calendar'),
					dropdownToggle = parentCalendar.querySelector('.dropdown-toggle'),
					dropdownMenu = parentCalendar.querySelector('.dropdown-menu'),
					inputCalendar = parentCalendar.querySelector('.dropdown-input')

				if (self.selectedDates[0]) {
					inputCalendar.value = self.selectedDates[0];
					dropdownMenu.classList.remove('show');
					dropdownToggle.classList.remove('show');
					dropdownToggle.setAttribute('aria-expanded', 'false');
				}
			},
		},
		settings: {
			visibility: {
				theme: 'light',
				disabled: true,
			},
		},
	});
	calendar.init();

})

const dropdownInputs = document.querySelectorAll('.dropdown-input')

dropdownInputs?.forEach((inputDate) => {
	inputDate.addEventListener('input', (event) => {
		const input = event.target;
		const inputValue = input.value.replace(/\D/g, '');
		const formattedValue = formatInputDate(inputValue);
		input.value = formattedValue;
	});

	inputDate.addEventListener('keydown', (event) => {
		const input = event.target;
		const key = event.key;

		if (key === 'Backspace' || key === 'Delete') {
			input.value = '';
		}
	});
});

function formatInputDate(dateString) {
	const year = dateString.slice(0, 4);
	const month = dateString.slice(4, 6);
	const day = dateString.slice(6, 8);
	return `${year}-${month}-${day}`;
}