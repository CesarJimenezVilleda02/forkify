class SearchView {
    _parentEl = document.querySelector('.search');

    getQuery() {
        const query = this._parentEl.querySelector('.search__field').value;
        this._clearInput();
        return query;
    }

    _clearInput() {
        this._parentEl.querySelector('.search__field').value = '';
    }

    addHandlerSearch(handler) {
        //si le pega al boton del tipo submit o si le da enter
        this._parentEl.addEventListener('submit', (e) => {
            e.preventDefault();
            handler();
        });
    }
}

export default new SearchView();
