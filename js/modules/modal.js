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