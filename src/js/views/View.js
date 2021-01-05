import icons from 'url:../../img/icons.svg';

export default class View {
    /**
     * Render the received object to the DOM
     * @param {Object | Object[]} data The data to be rendered (e.g. recipe)
     * @param {boolean} [render=true] If false, create markup string instead of rendering to the DOM
     * @returns {undefined | string} A markup string is returned if render=false
     * @this {Object} View instance
     * @author Cesar Jimenez
     * @todo Finish implementation
     */
    _data;
    render(data, render = true) {
        //funciona para indefinido
        // console.log(data);

        if (!data || (Array.isArray(data) && data.length === 0)) return this.renderError();

        this._data = data;

        if (!render) return this._generateMarkup();

        this._clear();
        this._parentElement.insertAdjacentHTML('afterbegin', this._generateMarkup());
    }

    update(data) {
        // if (!data || (Array.isArray(data) && data.length === 0)) return this.renderError();

        this._data = data;
        const newMarkup = this._generateMarkup();

        //nos va a sar un objeto node DOM
        const newDOM = document.createRange().createContextualFragment(newMarkup);
        const newElements = Array.from(newDOM.querySelectorAll('*'));
        const currentElements = Array.from(this._parentElement.querySelectorAll('*'));

        // console.log(newElements, currentElements);

        newElements.forEach((newEl, i) => {
            const curEl = currentElements[i];
            // if(!newEl.innerText === currentElements[i].textContent)
            //metodo que compara nodes directamente
            if (!newEl.isEqualNode(curEl) && newEl.firstChild?.nodeValue.trim() !== '') {
                //cosas que solo contienen texto
                // console.log(newEl.firstChild.nodeValue.trim());

                curEl.textContent = newEl.textContent;
            }

            //update changed attributes
            if (!newEl.isEqualNode(curEl)) {
                // console.log(newEl.attributes); //los atributos del html
                Array.from(newEl.attributes).forEach((attr) => {
                    curEl.setAttribute(attr.name, attr.value);
                });
            }
        });
    }

    _clear() {
        this._parentElement.innerHTML = '';
    }

    renderSpinner() {
        const markup = `<div class="spinner">
          <svg>
            <use href="${icons}#icon-loader"></use>
          </svg>
        </div>`;
        this._clear();
        this._parentElement.insertAdjacentHTML('afterbegin', markup);
    }

    renderError(message = this._errorMesaage) {
        const markup = `
            <div class="error">
                <div>
                <svg>
                    <use href="${icons}#icon-alert-triangle"></use>
                </svg>
                </div>
                <p>${message}</p>
            </div> `;
        this._clear();
        this._parentElement.insertAdjacentHTML('afterbegin', markup);
    }

    renderMessage(message = this._message) {
        const markup = `
            <div class="message">
                <div>
                <svg>
                    <use href="${icons}#icon-smile"></use>
                </svg>
                </div>
                <p>${message}</p>
            </div> `;
        this._clear();
        this._parentElement.insertAdjacentHTML('afterbegin', markup);
    }
}
