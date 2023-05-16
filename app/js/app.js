import Swiper from 'swiper/bundle'

document.addEventListener('DOMContentLoaded', () => {
	// Delay Handler
	function delayHandler(func, delay) {
		let timeoutId;
		return function () {
			if (timeoutId) {
				clearTimeout(timeoutId);
			}
			timeoutId = setTimeout(() => {
				func();
			}, delay);
		}
	}

	// HEADER POPOVER
	const popoverTShirt = document.querySelector('.tshirt-popover');
	const infoIcon = document.getElementById('info-icon');

	if (popoverTShirt && infoIcon) {
		const popover = new bootstrap.Popover(popoverTShirt, {
			container: 'body',
			offset: [0, -40],
			title: infoIcon.innerHTML + 'NOTICE',
			html: true
		});
	}

	// HEADER BAG
	const closeButtons = document.querySelectorAll('.btn-close-card');
	const dropdownCard = document.querySelector('.dropdown-cards');
	const currentCard = document.querySelector('.current-bag');
	const totalPriceTag = document.querySelector('.total-price');
	const emptyCartMsg = document.querySelector('.empty-cart-msg');
	const bagText = document.querySelector('.bag-text');
	const totalDropdown = document.querySelector('.total-dropdown');
	const btnCheckout = document.querySelector('.btn-checkout');
	const brackets = document.querySelector('.brackets')

	const observer = new MutationObserver(updateCardInfo);
	if (dropdownCard && dropdownCard instanceof Node) {
		observer.observe(dropdownCard, { childList: true, subtree: true });
	}

	closeButtons.forEach(button => button.addEventListener('click', function () {
		button.closest('.dropdown-card').remove();
		updateCardInfo();
	}));

	function updateCardInfo() {
		const cards = dropdownCard.querySelectorAll('.dropdown-card');
		const cardCount = cards.length;
		document.querySelectorAll('.current-bag').forEach(card => {
			if (cardCount > 0) {
				card.textContent = cardCount;
				emptyCartMsg.classList.add('d-none');
				brackets.classList.add('d-inline-block');
			} else {
				card.textContent = '';
				emptyCartMsg.classList.add('d-flex');
				brackets.classList.add('d-none');
				bagText.classList.add('d-none');
				totalDropdown.classList.add('d-none');
				btnCheckout.classList.add('d-none');
			}
		});
		if (cards.length === 0) {
			emptyCartMsg.classList.remove('d-none');
			brackets.classList.add('d-none');
			bagText.classList.add('d-none');
			totalDropdown.classList.add('d-none');
			btnCheckout.classList.add('d-none');
		} else {
			emptyCartMsg.classList.add('d-none');
			brackets.classList.remove('d-none');
			bagText.classList.remove('d-none');
			totalDropdown.classList.remove('d-none');
			btnCheckout.classList.remove('d-none');
			totalPriceTag.textContent = Array.from(cards).reduce((sum, card) => sum + parseFloat(card.querySelector('.card-price').textContent), 0).toFixed(2);
		}
	}

	if (closeButtons && dropdownCard && currentCard && totalPriceTag && emptyCartMsg && bagText && totalDropdown && btnCheckout && brackets) {
		updateCardInfo();
	}

	const heroSwiper = new Swiper('.hero-swiper', {
		// Optional parameters
		loop: true,

		// If we need pagination
		pagination: {
			el: '.swiper-pagination',
			clickable: true,
		},

	});

	const heroSwiperImg = document.querySelector('.hero-swiper-img');

	if (heroSwiperImg) {
		const heroSwiperPagination = document.querySelector('.hero-swiper-pagination');
		let heroSwiperImgHeight, heroSwiperPaginationTop;

		function setHeroSwiperPaginationTop() {
			heroSwiperImgHeight = heroSwiperImg.offsetHeight;
			heroSwiperPaginationTop = heroSwiperImgHeight - 50;
			heroSwiperPagination.style.top = heroSwiperPaginationTop + 'px';

			// добавляем проверку ширины экрана
			if (window.innerWidth <= 768) {
				heroSwiperPagination.style.top = heroSwiperImgHeight - 35 + 'px';
			}
		}

		setHeroSwiperPaginationTop();

		window.addEventListener('resize', delayHandler(setHeroSwiperPaginationTop, 50));

		// добавляем обработчик изменения ориентации экрана
		window.addEventListener('orientationchange', setHeroSwiperPaginationTop);
	}

});
