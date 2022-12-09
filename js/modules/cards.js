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