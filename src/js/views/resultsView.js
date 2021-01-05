import View from './View.js';
import previewView from './previewView.js';
import icons from 'url:../../img/icons.svg';

class ResultsView extends View {
    _parentElement = document.querySelector('.results');
    _errorMesaage = 'No recipes found for your query. Please try again.';
    _message = 'Success!!';

    _generateMarkup() {
        return this._data.map((bookmarks) => previewView.render(bookmarks, false)).join();
    }
}

export default new ResultsView();
