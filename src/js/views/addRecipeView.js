import View from './View.js';
import icons from 'url:../../img/icons.svg';

class AddRecipeView extends View {
    _parentElement = document.querySelector('.upload');
    _message = 'Recipe was successfully uploaded :)';

    _window = document.querySelector('.add-recipe-window');
    _overlay = document.querySelector('.overlay');
    _btnOpen = document.querySelector('.nav__btn--add-recipe');
    _btnClose = document.querySelector('.btn--close-modal');

    constructor() {
        super();
        this._addHandlerShowWindow();
        this._addHandlerCloseWindow();
    }

    toggleWindow() {
        this._overlay.classList.toggle('hidden');
        this._window.classList.toggle('hidden');
    }

    //esta funcion la vamos a correr en cuanto se arme
    _addHandlerShowWindow() {
        //el this dentro de un handler apunta a la funcion de afuera
        this._btnOpen.addEventListener('click', this.toggleWindow.bind(this));
    }

    _addHandlerCloseWindow() {
        //el this dentro de un handler apunta a la funcion de afuera
        this._btnClose.addEventListener('click', this.toggleWindow.bind(this));
    }

    addHandlerUpload(handler) {
        this._parentElement.addEventListener('submit', function (e) {
            e.preventDefault();
            //pasamos la forma -- el this si funcion aporque apunta al elemento
            const dataArr = [...new FormData(this)]; //se espredea para convertirlo a entries
            // const data = new FormData(this);
            const data = Object.fromEntries(dataArr); //crea objeto a partir de entries
            handler(data);
        });
    }

    _generateMarkup() {}
}

export default new AddRecipeView();
