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