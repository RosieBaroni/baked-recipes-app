import React from 'react';
import Card from '../Components/Card/Card';
import getRecipes from './API';
import { getProgress } from './localStorageSaves';

const MAX_LENGTH = 6;
const MAGIC_NUMBER_32 = 32;

export function ingredientsAndMeasure(keyType, text) {
  return (Object.entries(keyType[0]).filter(
    ([key, value]) => key.includes(text) && value,
  ));
}

export function cardRecomendatioConstructor(arrRecommended, type) {
  let recomendations;
  if (type === 'Meal') {
    recomendations = arrRecommended.map((item, i3) => (
      <Card
        key={ i3 }
        datatestRecipeCard={ `${i3}-recomendation-card` }
        datatestCardImage={ `${i3}-recomendation-img` }
        datatestCardName={ `${i3}-recomendation-title` }
        title={ item.strDrink }
        thumb={ item.strDrinkThumb }
      />
    ));
  } else {
    recomendations = arrRecommended.map((item, i3) => (
      <Card
        key={ i3 }
        datatestRecipeCard={ `${i3}-recomendation-card` }
        datatestCardImage={ `${i3}-recomendation-img` }
        datatestCardName={ `${i3}-recomendation-title` }
        title={ item.strMeal }
        thumb={ item.strMealThumb }
      />
    ));
  } return recomendations;
}

export function ingredientDivConstructor(ingredients, measure) {
  return ingredients.map(([key, value], i) => (
    <div key={ key }>
      <p
        data-testid={ `${i}-ingredient-name-and-measure` }
      >
        {`${value} ${measure[i] && measure[i][1]}`}
      </p>
    </div>
  ));
}

export function videoDivConstructor(video) {
  const videoEmbed = video.slice(MAGIC_NUMBER_32);
  return (
    <>
      <h1>Video</h1>
      <iframe
        src={ `https://www.youtube.com/embed/${videoEmbed}` }
        title="YouTube video player"
        frameBorder="0"
        allow="accelerometer; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
        data-testid="video"
      />
      {/* <video
        controls
        src={ video }
        type="video/mp4"
      >
        <track
          default
          kind="captions"
          srcLang="en"
          src={ video }
          data-testid="video"

        />
        Sorry, your browser doesnt support embedded videos.
      </video> */}
    </>
  );
}

export async function getRecommendations(pagePath, setRecommended) {
  const { type: pageType } = pagePath;
  if (pageType === 'foods') {
    const { drinks: recommendedDrinks } = await
    getRecipes('cocktail', 'search', 's=');
    setRecommended(recommendedDrinks?.slice(0, MAX_LENGTH));
  } else if (pageType === 'drinks') {
    const { meals: recommendedDrinks } = await
    getRecipes('meal', 'search', 's=');
    setRecommended(recommendedDrinks?.slice(0, MAX_LENGTH));
  }
}

export async function fetchApi(setRecipe, setIngredients,
  setMeasure, pagePath) {
  if (!JSON.parse(localStorage.getItem('inProgressRecipes'))) {
    localStorage.setItem('inProgressRecipes', JSON.stringify({
      cocktails: {},
      meals: {},
    }));
  }
  const { type: pageType, id: pageId } = pagePath;
  if (pageType === 'foods') {
    const { meals } = await getRecipes('meal', 'lookup', `i=${pageId}`);
    setRecipe(meals);
    setIngredients(ingredientsAndMeasure(meals, 'strIngredient'));
    setMeasure(ingredientsAndMeasure(meals, 'strMeasure'));
  } else if (pageType === 'drinks') {
    const { drinks } = await getRecipes('cocktail', 'lookup', `i=${pageId}`);
    setRecipe(drinks);
    setIngredients(ingredientsAndMeasure(drinks, 'strIngredient'));
    setMeasure(ingredientsAndMeasure(drinks, 'strMeasure'));
  }
}
export function recipeButtonName(type, pageId, setShowStart) {
  const lsProgress = getProgress();
  if (type === 'Meal' && lsProgress.meals[pageId]) {
    setShowStart(false);
  } if (type === 'Drink' && lsProgress.cocktails[pageId]) {
    setShowStart(false);
  }
}

export function handleStartButton(id, type, history, saveInProgressRecipe) {
  if (type === 'Meal') {
    saveInProgressRecipe('meals', id, []);
    history.push(`/foods/${id}/in-progress`);
  } else {
    saveInProgressRecipe('cocktails', id, []);
    history.push(`/drinks/${id}/in-progress`);
  }
}
