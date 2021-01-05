import * as model from './model.js';
import { MODAL_CLOSE_SECONDS } from './config.js';
import recipeView from './views/recipeView.js';
import searchView from './views/searchView.js';
import resultsView from './views/resultsView.js';
import bookmarksView from './views/bookmarksView.js';
import paginationView from './views/paginationView.js';
import addRecipeView from './views/addRecipeView.js';

//para polifillear todoo y que todos los browsers soporten esta app
import 'core-js/stable';
import 'regenerator-runtime/runtime';

// const recipeContainer = document.querySelector('.recipe');

// const timeout = function (s) {
//     return new Promise(function (_, reject) {
//         setTimeout(function () {
//             reject(new Error(`Request took too long! Timeout after ${s} second`));
//         }, s * 1000);
//     });
// };

// https://forkify-api.herokuapp.com/v2

///////////////////////////////////////

// console.log('Parcel is working');

if (module.hot) {
    module.hot.accept();
}

const controlRecipes = async function () {
    try {
        //agarrando el id del hash en la liga
        const id = window.location.hash;
        // console.log(id);

        if (!id) return;
        recipeView.renderSpinner();

        //update results view to marked selected search result
        console.log(id);

        resultsView.update(model.getSearchResultsPage());
        // debugger;
        bookmarksView.update(model.state.bookmarks);

        const recipeID = id.slice(1);
        // console.log(recipeID);

        //loading recipe data
        // renderSpinner(recipeContainer);

        await model.loadRecipe(recipeID); //no regresa nada, pero si modifica el state

        //el path actual de los iconos no va a funcionar porque los iconos salend e una nueva ubicacion
        //para arreglar esto se importó el path como variable y se insertó en el código

        // //cuando tienes lo mismo de los dos lados mejor lo partes
        // const { recipe } = model.state;

        //rendering recipe data
        // recipeView.render(model.state.recipe);

        recipeView.render(model.state.recipe);
    } catch (e) {
        // alert(e);
        //lo vamos pasando hasta que llega al controlador
        // console.error(e);

        recipeView.renderError();
    }

    // controlAddBookmark();

    // controlServings();
};

const controlSearchResults = async function () {
    try {
        resultsView.renderSpinner();

        const query = searchView.getQuery();
        if (!query) return;

        await model.loadSearchResults(query);
        // console.log(model.state.search.results);
        resultsView.render(model.getSearchResultsPage());

        //render initial pagination buttons
        paginationView.render(model.state.search);
    } catch (err) {
        console.log(err);
    }
};
//publisher subscriber pattern, se escucha en el view

const controlPagination = function (page) {
    // console.log('pag controller');

    resultsView.render(model.getSearchResultsPage(page));
    paginationView.render(model.state.search);
};

const controlServings = function (servings) {
    //Update the recipe servings(in state)
    model.updateServings(servings);
    //Update the view
    // recipeView.render(model.state.recipe);
    recipeView.update(model.state.recipe); //solo va a actualizar ciertos elementos
};

const controlAddBookmark = function () {
    //add remove bookmark
    if (!model.state.recipe.bookmarked) model.addBookmark(model.state.recipe);
    else if (model.state.recipe.bookmarked) model.deleteBookmark(model.state.recipe.id);

    //update ui
    recipeView.update(model.state.recipe);

    //render bookmarks
    bookmarksView.render(model.state.bookmarks);
};

const cotrolBookmarks = function () {
    bookmarksView.render(model.state.bookmarks);
};

const controlAddRecipe = async function (newRecipe) {
    try {
        addRecipeView.renderSpinner();

        // console.log(newRecipe);
        await model.uploadRecipe(newRecipe); //para que si la podamos atrapar tenemos que esperar su resolucion
        //por eso convertimos a toda la funcion en async
        // console.log(model.state.recipe);

        //render recipe
        recipeView.render(model.state.recipe);

        //success message
        addRecipeView.renderMessage();

        //RENDER BOOKMARK VIEW
        bookmarksView.render(model.state.bookmarks);

        //change id in url
        window.history.pushState(null, '', `#${model.state.recipe.id}`);

        //close window
        setTimeout(function () {
            addRecipeView.toggleWindow();
        }, MODAL_CLOSE_SECONDS * 1000);
    } catch (error) {
        console.log(error);
        addRecipeView.renderError(error.message);
    }
};

//publisher subscriber
const init = function () {
    recipeView.addHandlerRender(controlRecipes);
    recipeView.addHandlerUpdateServings(controlServings);
    recipeView.addHandlerAddBookmark(controlAddBookmark);
    searchView.addHandlerSearch(controlSearchResults);
    paginationView.addHandlerClick(controlPagination);
    bookmarksView.addHandlerRender(cotrolBookmarks);
    addRecipeView.addHandlerUpload(controlAddRecipe);
};
init();

//estos eventos no estan tan chidos aqui porque al final teiene que ver mas co el dom que con el controller
// ['hashchange', 'load'].forEach((e) => {
//     window.addEventListener(e, controlRecipes);
// });

//ES lo mismo ^

// lo que va a escuchar cuando la liga cambia -- cuando tiene un componente un href que no hace nada esta se añade a la liga en la
//que te encuentras
// window.addEventListener('hashchange', controlRecipes);
// window.addEventListener('load', controlRecipes);
