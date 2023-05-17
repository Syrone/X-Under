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

	//CLOCK
	const els = {
		s: initElements('s'),
		m: initElements('m')
	}

	function initElements(type) {
		const els = [{}, {}]

		if (!['s', 'm'].includes(type)) return els

		const target = document.querySelector(`.flip-clock-${type}`)

		if (!target) return els

		let el

		el = els[0]
		el.digit = target.querySelector('.digit-left')
		el.flip = el.digit.querySelector('.flip')
		el.flipFaces = el.flip.querySelectorAll('.flip-face')
		el.flipFaceA = el.flipFaces[0]
		el.flipFaceB = el.flipFaces[1]

		el = els[1]
		el.digit = target.querySelector('.digit-right')
		el.flip = el.digit.querySelector('.flip')
		el.flipFaces = el.flip.querySelectorAll('.flip-face')
		el.flipFaceA = el.flipFaces[0]
		el.flipFaceB = el.flipFaces[1]

		return els
	}

	function runClock() {
		const endTime = new Date("May 18, 2023 00:00:00").getTime(),
			nowTime = new Date().getTime(),
			distanceTime = endTime - nowTime,
			now = {
				m: Math.floor((distanceTime % (1000 * 60 * 60)) / (1000 * 60)),
				s: Math.floor((distanceTime % (1000 * 60)) / 1000)
			}

		// now.d = now.d 
		now.m = now.m < 10 ? `0${now.m}` : `${now.m}`
		now.s = now.s < 10 ? `0${now.s}` : `${now.s}`
		now.m0 = now.m[1]
		now.m1 = now.m[0]
		now.s0 = now.s[1]
		now.s1 = now.s[0]

		for (const t of Object.keys(els)) {
			for (const i of ['0', '1']) {
				const curr = now[`${t}${i}`]
				let next = curr - 1

				if (t === 'h' && i === '0' && next < 0) {
					next = 5
				} else if (t === 'm' && i === '0' && next < 0) {
					next = 9
				} else if (t === 'm' && i === '1' && next < 0) {
					next = 5
				} else if (t === 's' && i === '0' && next < 0) {
					next = 9
				} else if (t === 's' && i === '1' && next < 0) {
					next = 5
				}

				const el = els[t][i]
				if (el && el.digit) {
					if (!el.digit.dataset.digitBefore) {
						el.digit.dataset.digitBefore = curr
						el.flipFaceA.textContent = el.digit.dataset.digitBefore
						el.digit.dataset.digitAfter = next
						el.flipFaceB.textContent = el.digit.dataset.digitAfter
					} else if (el.digit.dataset.digitBefore !== curr) {
						el.flip.addEventListener('transitionend', function () {
							el.digit.dataset.digitBefore = curr
							el.flipFaceA.textContent = el.digit.dataset.digitBefore

							const flipClone = el.flip.cloneNode(true)
							flipClone.classList.remove('flipped')
							el.digit.replaceChild(flipClone, el.flip)
							el.flip = flipClone
							el.flipFaces = el.flip.querySelectorAll('.flip-face')
							el.flipFaceA = el.flipFaces[0]
							el.flipFaceB = el.flipFaces[1]

							el.digit.dataset.digitAfter = next
							el.flipFaceB.textContent = el.digit.dataset.digitAfter
						}, { once: true })
						if (!el.flip.classList.contains('flipped')) {
							el.flip.classList.add('flipped')
						}
					}
				}
			}
		}

		setTimeout(runClock, 1000)
	}

	runClock();
});
