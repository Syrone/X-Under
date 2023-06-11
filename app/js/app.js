import Swiper from 'swiper/bundle'

document.addEventListener('DOMContentLoaded', () => {
	//COOKIE
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


	function setCookie(name, value, days) {
		const date = new Date();
		date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
		const expires = `expires=${date.toUTCString()}`;
		document.cookie = `${name}=${value};${expires};path=/`;
	}

	function getCookie(name) {
		const nameWithEquals = `${name}=`;
		const decodedCookie = decodeURIComponent(document.cookie);
		const cookieArray = decodedCookie.split(';');
		for (let i = 0; i < cookieArray.length; i++) {
			let cookie = cookieArray[i].trim();
			if (cookie.indexOf(nameWithEquals) === 0) {
				return cookie.substring(nameWithEquals.length, cookie.length);
			}
		}
		return '';
	}

	// Modal hearXUnderModal
	if (document.getElementById('hearXUnderModal')) {
		const formSubmittedKey = 'formSubmitted';
		const showModal = () => {
			const myModal = new bootstrap.Modal(document.getElementById('hearXUnderModal'));
			myModal.show();
		};

		const showModalWithDelay = (delay) => {
			setTimeout(() => {
				if (!getCookie(formSubmittedKey)) {
					showModal();
				}
			}, delay);
		};

		if (!getCookie(formSubmittedKey)) {
			showModalWithDelay(300000); // Показать через 5 минут = 300000
		}

		document.getElementById('hearXUnderModal').addEventListener('hidden.bs.modal', () => {
			if (!getCookie(formSubmittedKey)) {
				showModalWithDelay(600000); // Показать снова через 10 минут = 600000
			}
		});

		document.getElementById('hearXUnderForm').addEventListener('submit', (event) => {
			event.preventDefault();
			setCookie(formSubmittedKey, 'true', 365); // Сохранить cookie на 1 год
			const myModal = bootstrap.Modal.getInstance(document.getElementById('hearXUnderModal'));
			myModal.hide();
		});
	}

	//END COOKIE

	//NO SCROLL
	const bagDropdownMenu = document.querySelector('.bag-dropdown-menu');

	if (bagDropdownMenu) {
		function updateOverflowHidden() {
			if (bagDropdownMenu.classList.contains('show')) {
				document.documentElement.classList.add('overflow-hidden');
				document.body.classList.add('overflow-hidden');
			} else {
				document.documentElement.classList.remove('overflow-hidden');
				document.body.classList.remove('overflow-hidden');
			}
		}

		updateOverflowHidden();

		const observeBagDropdown = new MutationObserver(function (mutations) {
			mutations.forEach(function (mutation) {
				if (mutation.type === 'attributes' && mutation.attributeName === 'class') {
					updateOverflowHidden();
				}
			});
		});

		observeBagDropdown.observe(bagDropdownMenu, { attributes: true });
	}

	//TOP INDENT .wrapper and .header-dropdown-bag
	const navbar = document.querySelector('.navbar');
	const wrapper = document.querySelector('.wrapper');
	const headerDropdownBag = document.querySelector('.bag-dropdown-menu');


	if (wrapper) {
		const dropdownOverflow = headerDropdownBag.querySelector('.dropdown-overflow');
		function updateWrapperMarginTop() {
			const navbarHeight = navbar.clientHeight;
			const bagDropdownHeight = 100 * window.innerHeight / 100 - (navbarHeight + 64);

			wrapper.style.marginTop = navbarHeight + 'px'
			dropdownOverflow.style.maxHeight = `${bagDropdownHeight}px`;
		}


		window.addEventListener('load', updateWrapperMarginTop);
		window.addEventListener('resize', updateWrapperMarginTop);

		navbar.addEventListener('DOMSubtreeModified', updateWrapperMarginTop);
	}


	//SCROLL TOP
	const scrollButton = document.querySelector(".btn-scroll-top")

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

	const alertSwiper = new Swiper('.alert-swiper', {

		autoplay: {
			delay: 5000,
			disableOnInteraction: false,
		},

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
		autoplay: {
			delay: 5000,
			disableOnInteraction: false,
		},

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

		autoplay: {
			delay: 5000,
			disableOnInteraction: false,
		},

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
				slidesPerView: 3,
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
	if (document.querySelectorAll(".clock")) {

		function initElements(type, prefix) {
			const els = [{}, {}]

			if (!['s', 'm', 'h', 'd'].includes(type)) return els

			const target = document.querySelector(`.${prefix}flip-clock-${type}`)

			if (!target) return els

			let el

			el = els[0]
			el.digit = target.querySelector(`.${prefix}digit-left`)
			if (el.digit) {
				el.flip = el.digit.querySelector(`.${prefix}flip`)
				el.flipFaces = el.flip.querySelectorAll(`.${prefix}flip-face`)
				el.flipFaceA = el.flipFaces[0]
				el.flipFaceB = el.flipFaces[1]
			}

			el = els[1]
			el.digit = target.querySelector(`.${prefix}digit-right`)
			if (el.digit) {
				el.flip = el.digit.querySelector(`.${prefix}flip`)
				el.flipFaces = el.flip.querySelectorAll(`.${prefix}flip-face`)
				el.flipFaceA = el.flipFaces[0]
				el.flipFaceB = el.flipFaces[1]
			}

			return els
		}

		let timeoutIds = [];

		function runClock(prefix, endTime, timeoutId) {
			const nowTime = new Date().getTime(),
				distanceTime = endTime - nowTime,
				now = {
					d: Math.floor(distanceTime / (1000 * 60 * 60 * 24)),
					h: Math.floor((distanceTime % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
					m: Math.floor((distanceTime % (1000 * 60 * 60)) / (1000 * 60)),
					s: Math.floor((distanceTime % (1000 * 60)) / 1000),
				}

			now.d = now.d < 10 ? `0${now.d}` : `${now.d}`
			now.h = now.h < 10 ? `0${now.h}` : `${now.h}`
			now.m = now.m < 10 ? `0${now.m}` : `${now.m}`
			now.s = now.s < 10 ? `0${now.s}` : `${now.s}`
			now.d0 = now.d[1]
			now.d1 = now.d[0]
			now.h0 = now.h[1]
			now.h1 = now.h[0]
			now.m0 = now.m[1]
			now.m1 = now.m[0]
			now.s0 = now.s[1]
			now.s1 = now.s[0]

			// console.log(`${now.d} days, ${now.h} hours, ${now.m} minutes, ${now.s} seconds`);

			const els = {
				s: initElements('s', prefix),
				m: initElements('m', prefix),
				h: initElements('h', prefix),
				d: initElements('d', prefix),
			}

			if (distanceTime == 0) {
				els.d.forEach(days => {
					days.digit.dataset.digitBefore = '0';
					days.flipFaceA.textContent = '0';
					days.digit.dataset.digitAfter = '0';
					days.flipFaceB.textContent = '0';
					days.flip.classList.add('flipped')
				})

				els.h.forEach(hours => {
					hours.digit.dataset.digitBefore = '0';
					hours.flipFaceA.textContent = '0';
					hours.digit.dataset.digitAfter = '0';
					hours.flipFaceB.textContent = '0';
					hours.flip.classList.add('flipped')
				})

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

				const index = timeoutIds.indexOf(timeoutId);
				if (index !== -1) {
					timeoutIds.splice(index, 1);
				}
				clearTimeout(timeoutId);
				return;
			} else {
				timeoutIds.push(timeoutId);
			}

			for (const t of Object.keys(els)) {
				for (const i of ['0', '1']) {
					const curr = now[`${t}${i}`]
					let next = curr - 1

					if (t === 'h' && i === '0' && next < 0) {
						next = 5;
					} else if (t === 'h' && i === '1' && next < 0) {
						next = 9;
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
								if (el.digit.contains(el.flip)) {
									el.digit.replaceChild(flipClone, el.flip);
								}
								el.flip = flipClone
								el.flipFaces = el.flip.querySelectorAll(`.${prefix}flip-face`)
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

			setTimeout(() => runClock(prefix, endTime), 1000);
		}

		runClock('timer3-', new Date("June 14, 2023 23:59:59").getTime());
		runClock('timer1-', new Date("June 17, 2023 23:59:59").getTime());
		runClock('timer2-', new Date("June 20, 2023 23:59:59").getTime());
	}

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

	// BTN GO BACK
	function goBack() {
		window.history.back();
	}

	const btnBack = document.querySelectorAll('.btn-back');
	if (btnBack) {
		btnBack.forEach(function (btn) {
			btn.addEventListener('click', goBack);
		});
	}

	//PRODUCT SWIPER
	const productThumbsSlider = new Swiper('.product-slider-thumbs', {
		spaceBetween: 10,
		slidesPerView: 2,
		slidesPerGroup: 1,
		slideToClickedSlide: true,
		freeMode: true,

		navigation: {
			nextEl: '.product-tumb-button-next',
			prevEl: '.product-tumb-button-prev',
			appendNavigation: '.product-slider-thumbs',
		},
	});

	const productSlider = new Swiper('.product-slider', {
		slidesPerView: 1,
		slidesPerGroup: 1,
		spaceBetween: 10,

		thumbs: {
			swiper: productThumbsSlider,
		},
	});

	// productSlider.controller.control = productThumbsSlider;
	// productThumbsSlider.controller.control = productSlider;

	//PRODUCT QUANTITY
	const buttonDecrement = document.querySelectorAll('.button-decrement');
	const buttonIncrement = document.querySelectorAll('.button-increment');
	const productQuantity = document.querySelectorAll('.product-quantity');

	if (buttonDecrement && buttonIncrement && productQuantity) {
		for (let i = 0; i < buttonDecrement.length; i++) {
			buttonDecrement[i].addEventListener('click', () => {
				let currentValue = parseInt(productQuantity[i].value);
				if (currentValue > 1) {
					productQuantity[i].value = currentValue - 1;
				}
			});
		}

		for (let i = 0; i < buttonIncrement.length; i++) {
			buttonIncrement[i].addEventListener('click', () => {
				let currentValue = parseInt(productQuantity[i].value);
				productQuantity[i].value = currentValue + 1;
			});
		}
	}

	//PRODUCT REVIEW QUESTIONS
	const userReviewQuestionExists = document.querySelector('.user-review-question');
	const productReviewExists = document.querySelector('.product-review');

	if (userReviewQuestionExists && productReviewExists) {
		document.body.addEventListener('click', function (event) {
			if ((event.target.closest('.user-review-question') || event.target.closest('.user-review-question-duplicate')) && event.target.matches('button')) {
				const userReview = event.target.closest('.product-review');
				const userReviewText = userReview.querySelector('.user-review');
				const userQuestion = userReview.querySelector('.user-review-question');
				const userQuestionDuplicate = userReview.querySelector('.user-review-question-duplicate');

				userQuestion.remove();

				if (userQuestionDuplicate) {
					userQuestionDuplicate.remove();
				}

				userReviewText.classList.remove('col-lg-9');
				userReviewText.classList.add('col-12');
			}
		});
	}


	//RECENT SWIPER
	const recentSwiper = new Swiper('.recent-swiper', {
		slidesPerView: 5,
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
				slidesPerGroup: 2,
				spaceBetween: 15
			},
			992: {
				slidesPerView: 3,
				slidesPerGroup: 3,
				spaceBetween: 15
			},
			1200: {
				slidesPerView: 4,
				slidesPerGroup: 2,
				spaceBetween: 15
			},
			1400: {
				slidesPerView: 5,
				slidesPerGroup: 1,
				spaceBetween: 30
			}
		},

		navigation: {
			nextEl: '.recent-button-next',
			prevEl: '.recent-button-prev',
			appendNavigation: '.recent-swiper',
		},

		pagination: {
			el: '.recent-pagination',
			clickable: true,
		},
	})

	//ZOOM PRODUCT ITEM
	const modalZoomSwiper = new Swiper('.modal-zoom-swiper', {
		slidesPerView: 1,
		slidesPerGroup: 1,
		spaceBetween: 50,

		navigation: {
			nextEl: '.zoom-button-next',
			prevEl: '.zoom-button-prev',
			appendNavigation: '.modal-zoom-swiper',
		},

		pagination: {
			el: '.zoom-pagination',
			clickable: true,
		},
	})

	//VIEW QUICK MODAL SWIPER
	const qViewSwiper = new Swiper('.modal-qview-slider', {
		slidesPerView: 1,
		slidesPerGroup: 1,
		spaceBetween: 15,

		navigation: {
			nextEl: '.modal-qview-next',
			prevEl: '.modal-qview-prev',
			appendNavigation: '.modal-qview-slider',
		},
	})

	const qViewThumbsSlider = new Swiper('.modal-qview-slider-thumbs', {
		spaceBetween: 30,
		slidesPerView: 1,
		slidesPerGroup: 1,
		slideToClickedSlide: true,
	});

	qViewSwiper.controller.control = qViewThumbsSlider;
	qViewThumbsSlider.controller.control = qViewSwiper;

	//Making rating choices and mandatory
	if (document.querySelector('.review')) {
		const ratingForm = document.querySelector('.review-form');
		const cardStars = document.querySelector('.card-stars');
		const iconStars = cardStars.querySelectorAll('.icon-star');
		const ratingInput = document.getElementById('rating-input');

		cardStars.addEventListener('click', (event) => {
			const target = event.target.closest('.icon-star');
			if (!target) return;

			const index = [...iconStars].indexOf(target);

			iconStars.forEach((iconStar, i) => {
				if (i <= index) {
					iconStar.classList.add('active');
				} else {
					iconStar.classList.remove('active');
				}
			});

			ratingInput.value = index + 1;
		});

		ratingForm.addEventListener('submit', (event) => {
			if (!ratingInput.value) {
				event.preventDefault();
				alert('Пожалуйста, выберите рейтинг');
			} else {
				event.preventDefault();
				const ratingValue = ratingInput.value;
				window.location.href = `review-thx.html?rating=${ratingValue}`
			}
		});
	}

	if (document.querySelector('.review-thx')) {
		const urlParams = new URLSearchParams(window.location.search);
		const ratingValue = urlParams.get('rating');

		if (ratingValue) {
			const cardStars = document.querySelector('.card-stars');
			const iconStars = cardStars.querySelectorAll('.icon-star');

			iconStars.forEach((iconStar, i) => {
				if (i < ratingValue) {
					iconStar.classList.add('active');
				} else {
					iconStar.classList.remove('active');
				}
			});
		}
	}

	const returnFormAdd = document.getElementById('addMoreItem');
	const returnForm = document.getElementById('returnForm');

	if (returnForm && returnFormAdd) {
		returnFormAdd.addEventListener('click', () => {
			const newInputs = [
				{ type: 'number', placeholder: 'Order number *', ariaLabel: 'Enter your Order number', required: true },
				{ type: 'text', placeholder: 'Item SKU *', ariaLabel: 'Enter your Item SKU', required: true }
			];

			newInputs.forEach(({ type, placeholder, ariaLabel, required }) => {
				const input = document.createElement('input');
				input.classList.add('form-control', 'form-control-lg', 'form-control-light', 'text-center', 'mb-3');
				input.type = type;
				input.placeholder = placeholder;
				input.setAttribute('aria-label', ariaLabel);
				input.required = required;
				returnForm.insertBefore(input, returnFormAdd);
			});
		});
	}

	//Changing the type of input
	if (document.getElementById('inputDate-Text')) {
		document.getElementById('inputDate-Text').addEventListener('focus', function () {
			this.type = 'date';
		});

		document.getElementById('inputDate-Text').addEventListener('blur', function () {
			this.type = 'text';
		});
	}

	//Pressing the button shows the password
	if (document.getElementById('showPassword') && document.getElementById('inputPassword')) {
		document.getElementById('showPassword').addEventListener('click', function () {
			const passwordInput = document.getElementById('inputPassword');
			if (passwordInput.type === 'password') {
				passwordInput.type = 'text';
			} else {
				passwordInput.type = 'password';
			}
		});
	}

	//Progress bar orders on the account page
	if (document.querySelector('.progress-bar-order')) {
		function updateProgressSteps() {
			const orderProgressBar = document.querySelector('.progress-bar-order');
			const progressValue = parseInt(orderProgressBar.style.width);

			const stepsOrderProgress = [
				{ element: document.querySelector('.progress-step-1'), threshold: 10 },
				{ element: document.querySelector('.progress-step-2'), threshold: 33 },
				{ element: document.querySelector('.progress-step-3'), threshold: 50 },
				{ element: document.querySelector('.progress-step-4'), threshold: 75 },
				{ element: document.querySelector('.progress-step-5'), threshold: 100 },
			];

			stepsOrderProgress.forEach(step => {
				if (progressValue >= step.threshold) {
					step.element.classList.add('active');
				} else {
					step.element.classList.remove('active');
				}
			});
		}

		const orderProgressBar = document.querySelector('.progress-bar-order');
		const observerProgressBar = new MutationObserver(mutations => {
			mutations.forEach(mutation => {
				if (mutation.type === 'attributes' && mutation.attributeName === 'style') {
					updateProgressSteps();
				}
			});
		});

		observerProgressBar.observe(orderProgressBar, { attributes: true });

		updateProgressSteps();
	}

	//GIFT SWIPER
	const giftCardThumbSwiper = new Swiper(".gift-card-slider-thumbs", {
		spaceBetween: 5,
		slidesPerView: 4,
		freeMode: true,
		watchSlidesProgress: true,
	});
	const giftCardSwiper = new Swiper(".gift-card-slider", {
		spaceBetween: 10,
		navigation: {
			nextEl: ".gift-card-tumb-button-next",
			prevEl: ".gift-card-tumb-button-prev",
		},
		thumbs: {
			swiper: giftCardThumbSwiper,
		},
	});

	//BLOG SWIPER
	const blogSwiper = new Swiper(".blog-swiper", {

		spaceBetween: 5,

		autoplay: {
			delay: 5000,
			disableOnInteraction: false,
		},

		navigation: {
			nextEl: '.blog-button-next',
			prevEl: '.blog-button-prev',
			appendNavigation: '.blog-swiper',
		},

		pagination: {
			el: '.blog-swiper-pagination',
			clickable: true,
		},
	});

	//ACCOUNT SWIPER
	const accountItemSwiper = new Swiper(".account-info-swiper", {
		slidesPerView: 3,
		spaceBetween: 40,

		breakpoints: {
			280: {
				slidesPerView: 1,
				slidesPerGroup: 1,
				spaceBetween: 40,
				autoplay: {
					delay: 5000,
					disableOnInteraction: false,
				},
			},
			776: {
				grabCursor: true,
				slidesPerView: 2,
				slidesPerGroup: 1,
				spaceBetween: 40,
				autoplay: {
					delay: 5000,
					disableOnInteraction: false,
				},
			},
			992: {
				slidesPerView: 3,
				slidesPerGroup: 1,
				spaceBetween: 40,
				autoplay: false,
			},
			1200: {
				slidesPerView: 4,
				slidesPerGroup: 1,
				spaceBetween: 40,
				autoplay: false,
			},
			1400: {
				slidesPerView: 5,
				slidesPerGroup: 1,
				spaceBetween: 40,
				autoplay: false,
			},
		},

		navigation: {
			nextEl: '.account-info-next',
			prevEl: '.account-info-prev',
			appendNavigation: '.account-info-swiper',
		},

		pagination: {
			el: '.account-info-pagination',
			clickable: true,
		},
	});

	//AFFILIATE SWIPER
	const affiliateGuideModal = document.querySelector('#affiliateGuideModal');
	if (affiliateGuideModal) {
		affiliateGuideModal.addEventListener('shown.bs.modal', () => {
			const affiliateGuideSwiper = new Swiper(".affiliate-guide-swiper", {
				slidesPerView: 4,
				spaceBetween: 40,

				breakpoints: {
					280: {
						slidesPerView: 1,
						slidesPerGroup: 1,
						spaceBetween: 40,
						autoplay: {
							delay: 5000,
							disableOnInteraction: false,
						},
					},
					992: {
						grabCursor: true,
						slidesPerView: 2,
						slidesPerGroup: 2,
						spaceBetween: 40,
						autoplay: {
							delay: 5000,
							disableOnInteraction: false,
						},
					},
					1200: {
						slidesPerView: 4,
						slidesPerGroup: 1,
						spaceBetween: 40,
						autoplay: false,
					},
				},

				navigation: {
					nextEl: '.affiliate-guide-next',
					prevEl: '.affiliate-guide-prev',
					appendNavigation: '.affiliate-guide-swiper',
				},

				pagination: {
					el: '.affiliate-guide-pagination',
					clickable: true,
				},
			});
		});

		affiliateGuideModal.addEventListener('hidden.bs.modal', () => {
			affiliateGuideSwiper.destroy();
		});
	}




	//Duplicate HTML
	//Page main qview modal
	const qviewHeaders = document.querySelectorAll('.qview-header');
	const qviewHeaderDuplicates = document.querySelectorAll('.qview-header-duplicate');
	const qviewPayProtects = document.querySelectorAll('.pay-protection')
	const qviewPayProtectDuplicates = document.querySelectorAll('.pay-protection-duplicate')

	if (qviewHeaders.length && qviewHeaderDuplicates.length) {
		qviewHeaders.forEach((qviewHeader, index) => {
			if (qviewHeaderDuplicates[index]) {
				qviewHeaderDuplicates[index].insertAdjacentHTML('beforeend', qviewHeader.innerHTML);
			}
		});
	}

	if (qviewPayProtects.length && qviewPayProtectDuplicates.length) {
		qviewPayProtects.forEach((qviewPayProtect, index) => {
			if (qviewPayProtectDuplicates[index]) {
				qviewPayProtectDuplicates[index].insertAdjacentHTML('beforeend', qviewPayProtect.innerHTML);
			}
		});
	}

	//Page Bag
	const infoProducts = document.querySelectorAll('.product-info');
	const infoProductDuplicates = document.querySelectorAll('.product-info-duplicate');

	if (infoProducts.length && infoProductDuplicates.length) {
		infoProducts.forEach((infoProduct, index) => {
			if (infoProductDuplicates[index]) {
				infoProductDuplicates[index].insertAdjacentHTML('beforeend', infoProduct.innerHTML);
			}
		});
	}


	//Page Card
	const productHeader = document.querySelector('.product-header');
	const productHeaderDuplicate = document.querySelector('.product-header-duplicate');

	if (productHeader && productHeaderDuplicate) {
		productHeaderDuplicate.insertAdjacentHTML('beforeend', productHeader.innerHTML);
	}

	const productSupport = document.querySelector('.product-support');
	const productSupportDuplicate = document.querySelector('.product-support-duplicate');

	if (productSupport && productSupportDuplicate) {
		productSupportDuplicate.insertAdjacentHTML('beforeend', productSupport.innerHTML);
	}

	//Page Favorite
	const favoriteBlockBtns = document.querySelectorAll('.block-btn');
	const favoriteBlockBtnDuplicates = document.querySelectorAll('.block-btn-duplicate');

	if (favoriteBlockBtns.length && favoriteBlockBtnDuplicates.length) {
		favoriteBlockBtns.forEach((favoriteBlockBtn, index) => {
			if (favoriteBlockBtnDuplicates[index]) {
				favoriteBlockBtnDuplicates[index].insertAdjacentHTML('beforeend', favoriteBlockBtn.innerHTML);
			}
		});
	}

	//Page Category
	const categoryTop = document.querySelector('.category-top');
	const categoryTopDuplicate = document.querySelector('.category-top-duplicate');
	const categoryBottom = document.querySelector('.category-bottom');
	const categoryBottomDuplicate = document.querySelector('.category-bottom-duplicate');


	if (categoryTop && categoryTopDuplicate) {
		categoryTopDuplicate.insertAdjacentHTML('beforeend', categoryTop.innerHTML);
	}

	if (categoryBottom && categoryBottomDuplicate) {
		categoryBottomDuplicate.insertAdjacentHTML('beforeend', categoryBottom.innerHTML);
	}





	//ВCЁ ЧТО НИЖЕ МОЖНО УДАЛИТЬ. ЖЕЛАТЕЛЬНО ОЗНАКОМИТЬСЯ.
	//Этот код можно будет удалить. Сделан был для демонстрации на странице checkout.html.
	const bagCtas = document.querySelectorAll('.bag-cta');
	const orderButtons = document.querySelectorAll('.btn-bag-order');

	orderButtons.forEach((button, index) => {
		button.addEventListener('click', () => {
			bagCtas[index].classList.add('d-none');

			if (index < bagCtas.length - 1) {
				bagCtas[index + 1].classList.remove('d-none');
			}
		});
	});

	// Возможно этот код тоже не понадобиться. Показывает скрытые карточки на странице категории.
	//BTN SHOW MORE
	const showMoreButton = document.querySelector('#show-more');

	if (showMoreButton) {
		showMoreButton.addEventListener('click', () => {
			const hiddenCards = document.querySelectorAll('.category-card-none.d-none');
			hiddenCards.forEach(card => card.classList.remove('d-none'));
			showMoreButton.classList.add('d-none');
		});
	}

	// Этот код демострировал разные состояние корзины в шапке сайта. Также можно удалить.
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

	//Можно удалить, сделано для демонстрации.
	//Affiliate Account Form and toggle d-none and without reloading
	const affiliatePaymentForm = document.querySelector('#paymentMethodForm');
	const paymentSection = document.querySelector('.account-affiliate-payment');
	const affiliateSection = document.querySelector('.account-affiliate');

	if (affiliatePaymentForm) {
		affiliatePaymentForm.addEventListener('submit', (event) => {
			event.preventDefault(); // отменяем стандартное поведение формы

			const formData = new FormData(affiliatePaymentForm); // получаем данные формы

			const xhr = new XMLHttpRequest(); // создаем объект XMLHttpRequest
			xhr.open('POST', '/submit-form'); // настраиваем запрос
			xhr.send(formData); // отправляем данные на сервер

			xhr.onload = function () {
				if (xhr.status === 200) {
					console.log(xhr.responseText); // выводим ответ сервера в консоль
				}
			};

			paymentSection.classList.add('d-none');
			affiliateSection.classList.remove('d-none');
		});
	}

	if (document.getElementById('guideBankModal') && document.getElementById('guideBankClose')) {
		document.getElementById('guideBankModal').addEventListener('click', function () {
			document.querySelector('.account-affiliate-modal').classList.remove('d-none');
		});

		document.getElementById('guideBankClose').addEventListener('click', function () {
			document.querySelector('.account-affiliate-modal').classList.add('d-none');
		});
	}

	if (document.querySelector('.favorite')) {
		const favorite = document.querySelector('.favorite');
		const favoriteEmpty = document.querySelector('.favorite--empty');

		// Функция для удаления элемента из списка избранного
		function removeFavoriteItem(event) {
			const favoriteItem = event.target.closest('.product-item');
			favoriteItem.classList.add('d-none');

			// Проверяем, есть ли еще элементы в списке избранного
			const favoriteItems = favorite.querySelectorAll('.product-item:not(.d-none)');
			if (favoriteItems.length === 0) {
				favorite.classList.add('d-none');
				favoriteEmpty.classList.remove('d-none');
			}
		}

		// Навешиваем обработчик событий на кнопки удаления
		const btnRemoveList = favorite.querySelectorAll('.btn-remove');
		btnRemoveList.forEach(btnRemove => {
			btnRemove.addEventListener('click', removeFavoriteItem);
		});
	}
});
