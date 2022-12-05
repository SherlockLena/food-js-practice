"use strict";

window.addEventListener("DOMContentLoaded", () => {

  //Tabs

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

  //Timer

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

  //Modal window

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

  //Menu items

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

  // getResource('http://localhost:3000/menu')
  // .then(data => {
  //   data.forEach(({img, altimg, title, descr, price}) => {
  //     new MenuItem(img, altimg, title, descr, price, '.menu .container').render();
  //   });
  // });
  axios.get('http://localhost:3000/menu')
  .then(data => {
      data.data.forEach(({img, altimg, title, descr, price}) => {
        new MenuItem(img, altimg, title, descr, price, '.menu .container').render();
      });
    });

    //Forms

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

    //SLIDER

    const prevBtn = document.querySelector('.offer__slider-prev'),
          nextBtn = document.querySelector('.offer__slider-next'),
          slides = document.querySelectorAll('.offer__slide'),
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

    nextBtn.addEventListener('click', () => {
      if (offset == +width.slice(0, width.length - 2) * (slides.length - 1)) {
        offset = 0;
      } else {
        offset += +width.slice(0, width.length - 2);
      }
      slidesField.style.transform = `translateX(-${offset}px)`;
      if (currentSlide == slides.length) {
            currentSlide = 1;
          } else {
            currentSlide++;
      }
      current.textContent = (currentSlide > 10 ? currentSlide : `0${currentSlide}`);
    });

    prevBtn.addEventListener('click', () => {
      if (offset == 0) {
        offset = +width.slice(0, width.length - 2) * (slides.length - 1);
      } else {
        offset -= +width.slice(0, width.length - 2);
      }
      slidesField.style.transform = `translateX(-${offset}px)`;
      if (currentSlide == 1) {
        currentSlide = slides.length;
      } else {
        currentSlide--;
      }
      current.textContent = (currentSlide > 10 ? currentSlide : `0${currentSlide}`);
    });
    

    // showSLides(currentSlide);

    // function showSLides(n) {
    //   if (n > slides.length) {
    //     currentSlide = 1;
    //   } else if (n < 1) {
    //     currentSlide = slides.length;
    //   } else {
    //     currentSlide = n;
    //   }

    //   slides.forEach(item => item.style.display = 'none');
    //   slides[currentSlide - 1].style.display = 'block';
    //   
    // }

    // prevBtn.addEventListener('click', () => {
    //   showSLides(currentSlide - 1);
    // });

    // nextBtn.addEventListener('click', () => {
    //   showSLides(currentSlide + 1);
    // });

});