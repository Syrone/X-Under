/** (Start) Affiliate Popup **/
function openPopup(target) {
	var popup = document.getElementById(target);
	popup.classList.add('is-show');
	closePopupExcept(target);
}

function closePopup() {
	var popups = document.getElementsByClassName('affiliate-popup');
	for (var i = 0; i < popups.length; i++) {
		popups[i].classList.remove('is-show');
	}
}

function closePopupExcept(target) {
	var popups = document.getElementsByClassName('affiliate-popup');
	for (var i = 0; i < popups.length; i++) {
		if (popups[i].id !== target) {
			popups[i].classList.remove('is-show');
		}
	}
}

var buttons = document.querySelectorAll('[data-popup-target]');
buttons.forEach(function (button) {
	button.addEventListener('click', function () {
		var target = this.getAttribute('data-popup-target');
		openPopup(target);
	});
});
/** (End) Affiliate Popup **/

/** (Start) Affiliate Form **/
const emailForm = document.getElementById('paymentEmailForm'),
			methodForm = document.getElementById('paymentMethodForm')

emailForm?.addEventListener('submit', function(event) {
  event.preventDefault();

	openPopup('paymentMethodFormModal')
});

methodForm?.addEventListener('submit', function(event) {
  event.preventDefault();

	openPopup('accountInfoModal')
});
/** (End) Affiliate Form **/