/******/ (() => { // webpackBootstrap
/******/ 	var __webpack_modules__ = ({

/***/ "./js/modules/calculator.js":
/*!**********************************!*\
  !*** ./js/modules/calculator.js ***!
  \**********************************/
/***/ ((module) => {

function calculator() {

    const result = document.querySelector('.calculating__result span');
    let sex = localStorage.getItem('sex') ? localStorage.getItem('sex') : 'female',
        height, weight, age,
        ratio = localStorage.getItem('ratio') ? localStorage.getItem('ratio') : 1.375;

    localStorage.setItem('sex', sex);
    localStorage.setItem('ratio', +ratio);

    function initLocalSettings(selector, activeClass) {
        const elements = document.querySelectorAll(selector);

        elements.forEach(elem => {
            elem.classList.remove(activeClass);
            if(elem.getAttribute('id') === localStorage.getItem('sex')) {
                elem.classList.add(activeClass);
            }
            if (elem.getAttribute('data-ratio') === localStorage.getItem('ratio')) {
                elem.classList.add(activeClass);
            }
        });
    }

    initLocalSettings('#gender div', 'calculating__choose-item_active');
    initLocalSettings('.calculating__choose_big div', 'calculating__choose-item_active');

    function calcTotal() {
        if(!sex || !height || !weight || !age || !ratio) {
            result.textContent = '____';
            return;
        }

        if(sex === 'female') {
            result.textContent = Math.round((447.6 + (9.2 * weight) + (3.1 * height) - (4.3 * age)) * ratio);
        } else {
            result.textContent = Math.round((88.36 + (13.4 * weight) + (4.8 * height) - (5.7 * age)) * ratio);
        }
    }

    function getStaticInfo(selector, activeClass) {
        const elements = document.querySelectorAll(selector);

        elements.forEach(elem => {
            elem.addEventListener('click', (e) => {
            if(e.target.getAttribute('data-ratio')) {
                ratio = +e.target.getAttribute('data-ratio');
                localStorage.setItem('ratio', +ratio);
            } else {
                sex = e.target.getAttribute('id');
                localStorage.setItem('sex', sex);
            }
    
            elements.forEach(elem => {
                elem.classList.remove(activeClass);
            });
            e.target.classList.add(activeClass);
    
            calcTotal();
            }); 
        });
    }

    getStaticInfo('#gender div', 'calculating__choose-item_active');
    getStaticInfo('.calculating__choose_big div', 'calculating__choose-item_active');

    function getDynamicInfo(selector) {
        const input = document.querySelector(selector);

        input.addEventListener('input', () => {

            if(input.value.match(/\D/g)) {
            input.style.border ='1px solid red';
            } else {
            input.style.border ='none';
            }

            switch(input.getAttribute('id')) {
            case 'height': 
                height = +input.value;
                break;
            case 'weight':
                weight = +input.value;
                break;
            case 'age':
                age = +input.value;
                break;
            }
            calcTotal();
        });
    }

    getDynamicInfo('#height');
    getDynamicInfo('#weight');
    getDynamicInfo('#age');
}

module.exports = calculator;

/***/ }),

/***/ "./js/modules/cards.js":
/*!*****************************!*\
  !*** ./js/modules/cards.js ***!
  \*****************************/
/***/ ((module) => {

function cards() {
    class MenuItem {
        constructor(src, alt, name, description, price, parentSelector, ...classes) {
          this.src = src;
          this.alt = alt;
          this.name = name;
          this.description = description;
          this.price = price;
          this.parent = document.querySelector(parentSelector);
          this.classes = classes;
          this.transfer = 37;
          this.exchangeToUAH();
        }
    
        exchangeToUAH() {
          this.price = this.price * this.transfer;
        }
    
        render() {
          const element = document.createElement('div');
    
          if(!this.classes.includes('menu__item')) {
            this.element = 'menu__item';
            element.classList.add(this.element);
          }
    
          this.classes.forEach(className => element.classList.add(className));
    
          element.innerHTML = `
              <img src=${this.src} alt=${this.alt}>
              <h3 class="menu__item-subtitle">${this.name}</h3>
              <div class="menu__item-descr">${this.description}</div>
              <div class="menu__item-divider"></div>
              <div class="menu__item-price">
                  <div class="menu__item-cost">Цена:</div>
                  <div class="menu__item-total"><span>${this.price}</span> грн/день</div>
              </div>
          `;
          this.parent.append(element);
        }
    }
    
    const getResource = async (url) => {
        let res = await fetch(url);
    
        if (!res.ok) {
          throw new Error(`Could not fetch ${url}, status: ${res.status}`);
        }
        
        return await res.json();
    };

    axios.get('http://localhost:3000/menu')
    .then(data => {
        data.data.forEach(({img, altimg, title, descr, price}) => {
            new MenuItem(img, altimg, title, descr, price, '.menu .container').render();
        });
    });
}

module.exports = cards;

/***/ }),

/***/ "./js/modules/forms.js":
/*!*****************************!*\
  !*** ./js/modules/forms.js ***!
  \*****************************/
/***/ ((module) => {

function forms() {

    const forms = document.querySelectorAll('form');

    const message = {
        loading: "img/form/spinner.svg",
        success: "Спасибо! Скоро мы с Вами свяжемся",
        failure: "Что-то пошло не так"
    };

    forms.forEach(item => {
        bindPostData(item);
    });

    const postData = async (url, data) => {
        let res = await fetch(url, {
            method: "POST",
            headers: {
                'Content-type': 'application/json'
            },
            body: data
        });
      
        return await res.json();
    };

    function bindPostData(form) {
        form.addEventListener('submit', (e) => {
            e.preventDefault();

        let statusMessage = document.createElement('img');
            statusMessage.src = message.loading;
            statusMessage.style.cssText = `
                display: block;
                margin: 0 auto;
            `;
        form.insertAdjacentElement('afterend', statusMessage);

        const formData = new FormData(form);

        const json = JSON.stringify(Object.fromEntries(formData.entries()));

        postData('http://localhost:3000/requests', json)
        .then(data => {
            console.log(data);
            showMessage(message.success);
            statusMessage.remove();
        })
        .catch(() => {
            showMessage(message.failure);
        })
        .finally(() => {
            form.reset();
        });
      });
    }

    function showMessage(message) {
        const prevModalDialog = document.querySelector('.modal__dialog');

        prevModalDialog.classList.add('hide');
        openModal();

        const thanksModal = document.createElement('div');
        thanksModal.classList.add('modal__dialog');
        thanksModal.innerHTML = `
        <div class = "modal__content">
            <div class = "modal__close" data-close>&times;</div>
            <div class = "modal__title">${message}</div>
        </div>`;

        document.querySelector('.modal').append(thanksModal);
        setTimeout(() => {
            thanksModal.remove();
            prevModalDialog.classList.add('show');
            prevModalDialog.classList.remove('hide');
            closeModal();
        }, 4000);
    }
}

module.exports = forms;

/***/ }),

/***/ "./js/modules/modal.js":
/*!*****************************!*\
  !*** ./js/modules/modal.js ***!
  \*****************************/
/***/ ((module) => {

function modal() {
    const modalTrigger = document.querySelectorAll('[data-modal]'),
        modalWindow = document.querySelector('.modal');

    function openModal() {
        modalWindow.classList.add('show');
        modalWindow.classList.remove('hide');
        document.body.style.overflow = 'hidden';
        clearInterval(modalTimerID);
    }

    function closeModal() {
        modalWindow.classList.remove('show');
        modalWindow.classList.add('hide');
        document.body.style.overflow = '';
    }

    function showModalByScroll() {
        if(window.pageYOffset + document.documentElement.clientHeight >= document.documentElement.scrollHeight - 1) {
            openModal();
            window.removeEventListener('scroll', showModalByScroll);
        }
    }

    modalTrigger.forEach(btn => {
        btn.addEventListener('click', openModal);
    });

    modalWindow.addEventListener('click', (e) => {
        if(e.target === modalWindow || e.target.getAttribute('data-close') == "") {
        closeModal();
        }
    });

    document.addEventListener('keydown', (e) => {
        if(e.code === "Escape" && modalWindow.classList.contains('show')) {
        closeModal();
        }
    });

    const modalTimerID = setTimeout(openModal, 10000);

    window.addEventListener('scroll', showModalByScroll);
}

module.exports = modal;

/***/ }),

/***/ "./js/modules/slider.js":
/*!******************************!*\
  !*** ./js/modules/slider.js ***!
  \******************************/
/***/ ((module) => {

function slider() {

    const prevBtn = document.querySelector('.offer__slider-prev'),
          nextBtn = document.querySelector('.offer__slider-next'),
          slides = document.querySelectorAll('.offer__slide'),
          slider = document.querySelector('.offer__slider'),
          total = document.querySelector('#total'),
          current = document.querySelector('#current'),
          slidesWrapper = document.querySelector('.offer__slider-wrapper'),
          slidesField = document.querySelector('.offer__slider-inner'),
          width = window.getComputedStyle(slidesWrapper).width;

    let currentSlide = 1,
        offset = 0;

    total.textContent = (slides.length > 10 ? slides.length : `0${slides.length}`);
    current.textContent = (currentSlide > 10 ? currentSlide : `0${currentSlide}`);

    slidesField.style.width = 100 * slides.length + '%';
    slidesField.style.display = 'flex';
    slidesField.style.transition = '0.5s all';

    slidesWrapper.style.overflow = 'hidden';

    slides.forEach(slide => {
        slide.style.width = width;
    });

    slider.style.position = 'relative';

    const dots = document.createElement('ol'),
          dotsArr = [];
    
    dots.classList.add('carousel-indicators');
    slider.append(dots);

    for (let i = 0; i < slides.length; i++) {
        const dot = document.createElement('li');
        dot.setAttribute('data-slide-to', i + 1);
        dot.classList.add('dot');
        if (i == 0) {
            dot.style.opacity = 1;
        }
        dots.append(dot);
        dotsArr.push(dot);
    }

    function setCurrent () {
        current.textContent = (currentSlide > 10 ? currentSlide : `0${currentSlide}`);
        dotsArr.forEach(dot => dot.style.opacity = '.5');
        dotsArr[currentSlide - 1].style.opacity = 1;
    }

    function convertStringToNubmer(str) {
        return +str.replace(/\D/g, '');
    }

    nextBtn.addEventListener('click', () => {
        if (offset == convertStringToNubmer(width) * (slides.length - 1)) {
            offset = 0;
        } else {
            offset += convertStringToNubmer(width);
        }
        slidesField.style.transform = `translateX(-${offset}px)`;
        if (currentSlide == slides.length) {
                currentSlide = 1;
            } else {
                currentSlide++;
        }
        setCurrent();
    });

    prevBtn.addEventListener('click', () => {
        if (offset == 0) {
            offset = convertStringToNubmer(width) * (slides.length - 1);
        } else {
            offset -= convertStringToNubmer(width);
        }
        slidesField.style.transform = `translateX(-${offset}px)`;
        if (currentSlide == 1) {
            currentSlide = slides.length;
        } else {
            currentSlide--;
        }
        setCurrent();
    });

    dotsArr.forEach(dot => {
        dot.addEventListener('click', (e) => {
            const slideTo = e.target.getAttribute('data-slide-to');

            currentSlide = slideTo;
            offset = convertStringToNubmer(width) * (slideTo - 1);

            slidesField.style.transform = `translateX(-${offset}px)`; 

            setCurrent();
        });
    });
}

module.exports = slider;

/***/ }),

/***/ "./js/modules/tabs.js":
/*!****************************!*\
  !*** ./js/modules/tabs.js ***!
  \****************************/
/***/ ((module) => {

function tabs() {

    const tabs = document.querySelectorAll(".tabheader__item"),
        tabsContent = document.querySelectorAll(".tabcontent"),
        tabsParent = document.querySelector(".tabheader__items");

    function hideTabContent() {
    tabsContent.forEach((item) => {
        item.classList.add('hide');
        item.classList.remove('show', 'fade');
    });

    tabs.forEach(tab => {
        tab.classList.remove('tabheader__item_active');
    });
    }

    function showTabContent(number = 0) {
    tabsContent[number].classList.add('show', 'fade');
    tabsContent[number].classList.remove('hide');
    tabs[number].classList.add('tabheader__item_active');
    }

    hideTabContent();
    showTabContent();

    tabsParent.addEventListener('click', (e) => {
    const target = e.target;

    if(target && target.classList.contains('tabheader__item')) {
        tabs.forEach((item, i) => {
        if(target == item) {
            hideTabContent();
            showTabContent(i);
        }
        });
    }
    });
}

module.exports = tabs;

/***/ }),

/***/ "./js/modules/timer.js":
/*!*****************************!*\
  !*** ./js/modules/timer.js ***!
  \*****************************/
/***/ ((module) => {

function timer() {
    const deadline = '2022-12-11';

    function getTimeRemaining(endtime) {
        let days, hours, minutes, seconds;
        const t = Date.parse(endtime) - Date.parse(new Date());

        if(t <= 0) {
            days = 0;
            hours = 0;
            minutes = 0;
            seconds = 0;
        } else {
            days = Math.floor(t / (1000 * 60 * 60 * 24));
            hours = Math.floor((t / (1000 * 60 * 60)) % 24);
            minutes = Math.floor((t / (1000 * 60)) % 60);
            seconds = Math.floor((t / 1000) % 60);
        }
        
        return {
            'total': t,
            'days': days,
            'hours': hours,
            'minutes': minutes,
            'seconds': seconds
        };
    }

    function getZero(num) {
        if(num >= 0 && num < 10) {
            return `0${num}`;
        } else {
            return num;
        }
    }

    function setClock(selector, endtime) {
        const timer = document.querySelector(selector),
            days = timer.querySelector('#days'),
            hours = timer.querySelector('#hours'),
            minutes = timer.querySelector('#minutes'),
            seconds = timer.querySelector('#seconds'),
            timeInterval = setInterval(updateClock, 1000);

    updateClock();
    
    function updateClock() {
        const t = getTimeRemaining(endtime);

        days.innerHTML = getZero(t.days);
        hours.innerHTML = getZero(t.hours);
        minutes.innerHTML = getZero(t.minutes);
        seconds.innerHTML = getZero(t.seconds);

        if (t.total <= 0) {
            clearInterval(timeInterval);
        }
    }
  }

    setClock('.timer', deadline);
}

module.exports = timer;

/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
var __webpack_exports__ = {};
// This entry need to be wrapped in an IIFE because it need to be in strict mode.
(() => {
"use strict";
/*!**********************!*\
  !*** ./js/script.js ***!
  \**********************/


window.addEventListener("DOMContentLoaded", () => {
    const tabs = __webpack_require__(/*! ./modules/tabs */ "./js/modules/tabs.js"),
          timer = __webpack_require__(/*! ./modules/timer */ "./js/modules/timer.js"),
          slider = __webpack_require__(/*! ./modules/slider */ "./js/modules/slider.js"),
          modal = __webpack_require__(/*! ./modules/modal */ "./js/modules/modal.js"),
          forms = __webpack_require__(/*! ./modules/forms */ "./js/modules/forms.js"),
          cards = __webpack_require__(/*! ./modules/cards */ "./js/modules/cards.js"),
          calculator = __webpack_require__(/*! ./modules/calculator */ "./js/modules/calculator.js");
    tabs();
    timer();
    slider();
    modal();
    forms();
    cards();
    calculator();
});
})();

/******/ })()
;
//# sourceMappingURL=bundle.js.map