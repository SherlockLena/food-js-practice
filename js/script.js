"use strict";

import tabs from "./modules/tabs";
import timer from "./modules/timer";
import slider from "./modules/slider";
import modal, {openModal} from "./modules/modal";
import forms from "./modules/forms";
import cards from "./modules/cards";
import calculator from "./modules/calculator";

window.addEventListener("DOMContentLoaded", () => {
    const modalTimerID = setTimeout(() => openModal('.modal', modalTimerID), 10000);
    const deadline = '2022-12-11';

    tabs(".tabheader__item", ".tabcontent", ".tabheader__items", 'tabheader__item_active');
    timer('.timer', deadline);
    slider({
        container:'.offer__slider',
        nextArrow: '.offer__slider-next',
        prevArrow: '.offer__slider-prev',
        totalCounter: '#total',
        currentCounter: '#current',
        wrapper: '.offer__slider-wrapper',
        field: '.offer__slider-inner',
        slide: '.offer__slide'
    });
    modal('[data-modal]', '.modal', modalTimerID);
    forms('form', modalTimerID);
    cards();
    calculator();
});
