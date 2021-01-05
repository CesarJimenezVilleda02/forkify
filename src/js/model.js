import { API_URL, RESULTS_PER_PAGE, KEY } from './config.js';
// import { getJSON, sendJSON } from './helpers.js';
import { AJAX } from './helpers.js';
import recipeView from './views/recipeView.js';

export const state = {
    recipe: {},
    bookmarks: [],
    search: {
        query: '',
        page: 1,
        results: [],
        resultsPerPage: RESULTS_PER_PAGE,
    },
};

const createRecipeObject = function (data) {
    const { recipe } = data.data;
    return {
        id: recipe.id,
        title: recipe.title,
        publisher: recipe.publisher,
        sourceUrl: recipe.source_url,
        image: recipe.image_url,
        servings: recipe.servings,
        cookingTime: recipe.cooking_time,
        ingredients: recipe.ingredients,
        //conditionally add properties
        ...(recipe.key && { key: recipe.key }),
        //si recipe no existe entonces no pasa nada, si si existe la segunda parte
        //se ejecuta y regresa
    };
};

//va a cambiar la recipe actual
export const loadRecipe = async function (recipeID) {
    try {
        const data = await AJAX(`${API_URL}${recipeID}?key=${KEY}`);
        // const res = await fetch(`${API_URL}/${recipeID}`);
        // const data = await res.json();

        // if (!res.ok) throw new Error(`${data.message} (${res.status})`);
        // console.log(res, data);

        //reformat the recipe object

        state.recipe = createRecipeObject(data);

        if (state.bookmarks.some((b) => b.id === recipeID)) state.recipe.bookmarked = true;
        else state.recipe.bookmarked = false;
        // console.log(state.recipe);
    } catch (e) {
        //temporary error handling
        // console.error(`${e}`);
        //tenemos que pasar el error al controller
        throw e;
    }
};

export const loadSearchResults = async function (query) {
    state.search.page = 1;
    try {
        state.search.query = query;
        const data = await AJAX(`${API_URL}?search=${query}&key=${KEY}`);

        state.search.results = data.data.recipes.map((rec) => {
            return {
                id: rec.id,
                title: rec.title,
                publisher: rec.publisher,
                image: rec.image_url,
                ...(rec.key && { key: rec.key }),
            };
        });

        // console.log(state);
    } catch (error) {
        throw error;
    }
};
// loadSearchResults('pizza');

export const getSearchResultsPage = function (page = state.search.page) {
    state.search.page = page;
    const start = (page - 1) * state.search.resultsPerPage;
    const end = page * state.search.resultsPerPage; //slice no incluye el ultimo

    //return a part of the results
    return state.search.results.slice(start, end);
};

export const updateServings = function (newServings) {
    state.recipe.ingredients.forEach((ing) => {
        ing.quantity = (ing.quantity * newServings) / state.recipe.servings;
    });

    state.recipe.servings = newServings;
};

const persistBookmarks = function () {
    localStorage.setItem('bookmarks', JSON.stringify(state.bookmarks));
    // console.log('localStorage', localStorage.getItem('bookmarks'));
};

export const addBookmark = function (recipe) {
    state.bookmarks.push(recipe);

    // markcurrent recipe as bookmark
    if (recipe.id === state.recipe.id) state.recipe.bookmarked = true;
    persistBookmarks();
};

export const deleteBookmark = function (id) {
    //delete bookmark
    const index = state.bookmarks.findIndex((el) => el.id === id);
    state.bookmarks.splice(index, 1);

    if (id === state.recipe.id) state.recipe.bookmarked = false;
    persistBookmarks();
};

const init = function () {
    const bookmarks = localStorage.getItem('bookmarks');
    if (bookmarks) state.bookmarks = JSON.parse(bookmarks);
};
init();
// console.log(state.bookmarks);

const clearBookmarks = function () {
    localStorage.clear('bookmarks');
};
clearBookmarks();

export const uploadRecipe = async function (newRecipe) {
    try {
        const ingredients = Object.entries(newRecipe)
            .filter((entry) => {
                // console.log(entry);
                return entry[0].startsWith('ingredient') && entry[1] !== '';
            })
            .map((ing) => {
                // const ingArr = ing[1].replaceAll(' ', '').split(',');
                const ingArr = ing[1].split(',').map((el) => el.trim());
                if (ingArr.length !== 3) throw new Error('Wrong ingredient format! Plase use the correct format');

                const [quantity, unit, description] = ingArr;
                return { quantity: quantity ? Number(quantity) : null, unit, description };
            });

        const recipe = {
            title: newRecipe.title,
            source_url: newRecipe.sourceUrl,
            image_url: newRecipe.image,
            publisher: newRecipe.publisher,
            cooking_time: +newRecipe.cookingTime,
            servings: +newRecipe.servings,
            ingredients,
        };

        console.log(recipe);
        const data = await AJAX(`${API_URL}?key=${KEY}`, recipe);
        state.recipe = createRecipeObject(data);
        addBookmark(state.recipe);

        // console.log(ingredients);
    } catch (error) {
        throw error;
    }
};
