function tabs(tabsSelector, tabsContentSelector, tabsParentSelector, activeClass) {

    const tabs = document.querySelectorAll(tabsSelector),
        tabsContent = document.querySelectorAll(tabsContentSelector),
        tabsParent = document.querySelector(tabsParentSelector);

    function hideTabContent() {
    tabsContent.forEach((item) => {
        item.classList.add('hide');
        item.classList.remove('show', 'fade');
    });

    tabs.forEach(tab => {
        tab.classList.remove(activeClass);
    });
    }

    function showTabContent(number = 0) {
    tabsContent[number].classList.add('show', 'fade');
    tabsContent[number].classList.remove('hide');
    tabs[number].classList.add(activeClass);
    }

    hideTabContent();
    showTabContent();

    tabsParent.addEventListener('click', (e) => {
    const target = e.target;

    if(target && target.classList.contains(tabsSelector.slice(1))) {
        tabs.forEach((item, i) => {
        if(target == item) {
            hideTabContent();
            showTabContent(i);
        }
        });
    }
    });
}

export default tabs;