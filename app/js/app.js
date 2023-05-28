import Swiper from 'swiper/bundle'

document.addEventListener('DOMContentLoaded', () => {

	//COLOR SELECTION
	const versionBtns = document.querySelectorAll('.version-button');
	const welcomePage = document.querySelector('.welcome');
	const currentPath = window.location.pathname;

	const malePath = currentPath.endsWith('main-male.html');
	const femalePath = currentPath.endsWith('main-female.html');

	if (versionBtns) {
		versionBtns.forEach((button) => {
			button.addEventListener('click', () => {
				const date = new Date();
				date.setTime(date.getTime() + 365 * 24 * 60 * 60 * 1000);
				document.cookie = `version=${button.getAttribute('data-version')}; path=/; expires=${date.toUTCString()}`;
				location.reload();
			});
		});
	}

	let version = 'male';
	if (femalePath) {
		version = 'female';
	}

	const cookies = document.cookie.split(';');

	for (let cookie of cookies) {
		const [name, value] = cookie.trim().split('=');

		if (name === 'version') {
			version = value;
			break;
		}
	}

	if (welcomePage) {
		version = 'male';
		document.body.classList.remove('female');
	} else if (version === 'female' || femalePath) {
		document.body.classList.add('female');
	} else {
		document.body.classList.remove('female');
	}

	if (version === 'female' && malePath) {
		version = 'male';
		document.body.classList.remove('female');
	}

	if (malePath || femalePath) {
		const links = document.querySelectorAll('a');
		links.forEach((link) => {
			link.addEventListener('click', (e) => {
				e.preventDefault();
				const href = link.getAttribute('href');
				const currentUrl = new URL(window.location.href);
				const url = new URL(currentUrl.origin + currentUrl.pathname);
				url.pathname = url.pathname.replace(/\/[^/]*$/, '/') + href;

				if (femalePath) {
					url.searchParams.set('version', 'female');
					document.cookie = `version=female; path=/`;
				} else {
					url.searchParams.set('version', 'male');
					document.cookie = `version=male; path=/`;
				}
				window.location.href = url.toString();
			});
		});
	}


	window.addEventListener('popstate', () => {
		const urlParams = new URLSearchParams(window.location.search);
		const newVersion = urlParams.get('version');
		if (newVersion) {
			version = newVersion;
			if (version === 'female') {
				document.body.classList.add('female');
			} else {
				document.body.classList.remove('female');
			}
		}
	});

	//TOP INDENT .wrapper
	const navbar = document.querySelector('.navbar');
	const wrapper = document.querySelector('.wrapper');

	function updateWrapperMarginTop() {
		const navbarHeight = navbar.clientHeight;
		wrapper.style.marginTop = navbarHeight + 'px';
	}

	if (wrapper) {
		window.addEventListener('load', updateWrapperMarginTop);
		window.addEventListener('resize', updateWrapperMarginTop);

		navbar.addEventListener('DOMSubtreeModified', updateWrapperMarginTop);
	}

	//SCROLL TOP
	const scrollButton = document.querySelector(".btn-scroll-top"); // Получаем кнопку по ID

	if (scrollButton) {
		window.addEventListener("scroll", function () {
			if (window.scrollY > 150) {
				scrollButton.classList.remove("visually-hidden");
			} else {
				scrollButton.classList.add("visually-hidden");
			}
		});

		function scrollToTop() {
			window.scrollTo({ top: 0, behavior: "smooth" });
		}

		scrollButton.addEventListener("click", scrollToTop);
	}

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
	const popoverBtn = document.getElementById("myPopoverBtn");
	const popover = document.getElementById("myPopover");

	if (popoverBtn && popover) {
		popoverBtn.addEventListener("click", function () {
			popover.classList.toggle("d-none");
		});

		document.addEventListener("click", function (event) {
			const isClickInsidePopover = popover.contains(event.target);
			const isClickInsidePopoverBtn = popoverBtn.contains(event.target);

			if (!isClickInsidePopover && !isClickInsidePopoverBtn) {
				popover.classList.add("d-none");
			}
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

	const alertSwiper = new Swiper('.alert-swiper', {

		spaceBetween: 50,

		pagination: {
			el: '.alert-pagination',
			clickable: true,
		},

		navigation: {
			nextEl: '.alert-button-next',
			prevEl: '.alert-button-prev',
			appendNavigation: '.alert-swiper',
		},

	});

	const heroSwiper = new Swiper('.hero-swiper', {

		pagination: {
			el: '.hero-swiper-pagination',
			clickable: true,
		},

	});

	const featuredSwiper = new Swiper('.featured-swiper', {
		slidesPerView: 3,
		slidesPerGroup: 1,
		spaceBetween: 50,
		breakpoints: {
			280: {
				slidesPerView: 1,
				slidesPerGroup: 1,
				spaceBetween: 100
			},
			768: {
				slidesPerView: 2,
				slidesPerGroup: 1,
				spaceBetween: 20
			},
			1200: {
				slidesPerView: 3,
				slidesPerGroup: 1,
				spaceBetween: 20
			},
			1400: {
				slidesPerView: 3,
				slidesPerGroup: 1,
				spaceBetween: 50
			}
		},

		navigation: {
			nextEl: '.featured-button-next',
			prevEl: '.featured-button-prev',
			appendNavigation: '.featured-swiper',
		},

		pagination: {
			el: '.featured-pagination',
			clickable: true,
		},
	})

	const heroSwiperImg = document.querySelector('.hero-swiper-img');

	if (heroSwiperImg) {
		const heroSwiperPagination = document.querySelector('.hero-swiper-pagination');
		let heroSwiperImgHeight, heroSwiperPaginationTop;

		function setHeroSwiperPaginationTop() {
			heroSwiperImgHeight = heroSwiperImg.offsetHeight;
			heroSwiperPaginationTop = heroSwiperImgHeight - 50;
			heroSwiperPagination.style.top = heroSwiperPaginationTop + 'px';

			if (window.innerWidth <= 768) {
				heroSwiperPagination.style.top = heroSwiperImgHeight - 35 + 'px';
			}
		}

		window.onload = function () {
			setHeroSwiperPaginationTop();
		};

		window.addEventListener('resize', delayHandler(setHeroSwiperPaginationTop, 100));

		window.addEventListener('orientationchange', setHeroSwiperPaginationTop);
	}

	const bannerSwiper = new Swiper('.banner-swiper', {

		spaceBetween: 16,

		navigation: {
			nextEl: '.banner-button-next',
			prevEl: '.banner-button-prev',
			appendNavigation: '.banner-swiper',
		},
		pagination: {
			el: '.banner-pagination',
			clickable: true,
		},
	})

	const advantagesSwiper = new Swiper('.advantages-swiper', {

		slidesPerView: 3,
		slidesPerGroup: 1,
		spaceBetween: 50,
		breakpoints: {
			280: {
				slidesPerView: 1,
				slidesPerGroup: 1,
				spaceBetween: 100
			},
			768: {
				slidesPerView: 2,
				slidesPerGroup: 1,
				spaceBetween: 20
			},
			992: {
				slidesPerGroup: 3,
				slidesPerGroup: 1,
				spaceBetween: 50
			},
			1400: {
				slidesPerView: 3,
				slidesPerGroup: 1,
				spaceBetween: 50
			}
		},

		navigation: {
			nextEl: '.advantages-button-next',
			prevEl: '.advantages-button-prev',
			appendNavigation: '.advantages-swiper',
		},
		// If we need pagination
		pagination: {
			el: '.advantages-pagination',
			clickable: true,
		},
	})

	//CLOCK
	if (document.querySelectorAll("clock")) {
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
			const endTime = new Date("May 30, 2023 00:00:00").getTime(),
				nowTime = new Date().getTime(),
				distanceTime = endTime - nowTime,
				now = {
					m: Math.floor((distanceTime % (1000 * 60 * 60)) / (1000 * 60)),
					s: Math.floor((distanceTime % (1000 * 60)) / 1000)
				}

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

					if (distanceTime <= 0) {
						// reset all digit values to 0
						els.m.forEach(minutes => {
							minutes.digit.dataset.digitBefore = '0';
							minutes.flipFaceA.textContent = '0';
							minutes.digit.dataset.digitAfter = '0';
							minutes.flipFaceB.textContent = '0';
							minutes.flip.classList.add('flipped')
						})

						els.s.forEach(seconds => {
							seconds.digit.dataset.digitBefore = '0';
							seconds.flipFaceA.textContent = '0';
							seconds.digit.dataset.digitAfter = '0';
							seconds.flipFaceB.textContent = '0';
							seconds.flip.classList.add('flipped')
						})

						return;
					} else if (el && el.digit) {
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
		runClock()
	}

	//WRAPPING IN SPAN
	// const bannerTitles = document.querySelectorAll('.banner-title');
	// bannerTitles.forEach(bannerTitle => {
	// 	const words = bannerTitle.textContent.split(' ');
	// 	bannerTitle.textContent = '';
	// 	words.forEach(word => {
	// 		let newWord = '';
	// 		for (let i = 0; i < word.length; i++) {
	// 			if (word[i].toLowerCase() === 'o') {
	// 				newWord += '<span>' + word[i] + '</span>';
	// 			} else {
	// 				newWord += word[i];
	// 			}
	// 		}
	// 		bannerTitle.innerHTML += newWord + ' ';
	// 	});
	// });

	//COOKIES
	const cookieAlert = document.querySelector('.cookie-alert');
	const acceptCookies = document.querySelector('.accept-cookies');

	if (cookieAlert && acceptCookies) {
		if (!localStorage.getItem('cookieAlertClosed')) {
			cookieAlert.classList.remove('d-none');
		}

		acceptCookies.addEventListener('click', () => {
			localStorage.setItem('cookieAlertClosed', true);
			cookieAlert.classList.add('d-none');
		});
	}

	//ACCOUNT INFO
	function addEditFunctionality(form, button) {
		const inputs = form.querySelectorAll('input');

		button.addEventListener('click', () => {
			const isEditing = button.textContent === 'Edit';

			inputs.forEach(input => {
				input.readOnly = !isEditing;
			});

			if (isEditing) {
				setTimeout(() => {
					button.type = 'submit';
				}, 100);
			} else {
				setTimeout(() => {
					button.type = 'button';
				}, 100);
			}

			button.textContent = isEditing ? 'Save' : 'Edit';
		});
	}

	// Shipping form
	const shippingForm = document.querySelector('#shipping-form');
	const shippingBtn = document.querySelector('#shipping-btn');
	if (shippingForm && shippingBtn) {
		addEditFunctionality(shippingForm, shippingBtn);
	}

	// Contact form
	const contactForm = document.querySelector('#contact-form');
	const contactBtn = document.querySelector('#contact-btn');
	if (contactForm && contactBtn) {
		addEditFunctionality(contactForm, contactBtn);
	}

	// Promo form
	const promoForm = document.querySelector('#promo-form');
	const promoBtn = document.querySelector('#promo-btn');
	if (promoForm && promoBtn) {
		addEditFunctionality(promoForm, promoBtn);
	}

	// Billing form
	const billingForm = document.querySelector('#billing-form');
	const billingBtn = document.querySelector('#billing-btn');
	if (billingForm && billingBtn) {
		addEditFunctionality(billingForm, billingBtn);
	}

	// Billing contact form
	const billingContactForm = document.querySelector('#billing-contact-form');
	const billingBtn1 = document.querySelector('#billing-btn1');
	if (billingContactForm && billingBtn1) {
		addEditFunctionality(billingContactForm, billingBtn1);
	}

	// Payment method form
	const paymentForm = document.querySelector('#payment-method-form');
	const paymentBtn = document.querySelector('#payment-btn');
	if (paymentForm && paymentBtn) {
		addEditFunctionality(paymentForm, paymentBtn);
	}

	//BG CHANGE headerBottom
	const browserBtn = document.querySelector('.btn-browser');
	const headerBottom = document.querySelector('.header-bottom');

	if (browserBtn && headerBottom) {
		browserBtn.addEventListener('click', function () {
			if (this.classList.contains('collapsed')) {
				headerBottom.classList.remove('active');
			} else {
				headerBottom.classList.add('active');
			}
		});
	}

	//BTN GO BACK
	function goBack() {
		window.history.back();
	}

	const btnBack = document.querySelector('.btn-back')
	if (btnBack) {
		btnBack.addEventListener('click', goBack);
	}

	//BTN SHOW MORE
	const showMoreButton = document.querySelector('#show-more');

	if (showMoreButton) {
		showMoreButton.addEventListener('click', () => {
			const hiddenCards = document.querySelectorAll('.category-card-none.d-none');
			hiddenCards.forEach(card => card.classList.remove('d-none'));
			showMoreButton.classList.add('d-none');
		});
	}




});
