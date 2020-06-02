import * as React from "react";
import { List, ErrorMessage, ListAddForm, AutocompleteIngredients, LoadingBar, Button } from '../components'
import { useDetailedIngredientState, useRecipeFormState, initialState } from "../hooks";
import cx from 'classnames';
import gql from 'graphql-tag';
import { useMutation } from '@apollo/react-hooks';
import { isUrlValid } from "../utils/validUrl";
import { Redirect } from "react-router";

const ADD_RECIPE = gql`
  mutation CreateRecipe($title: String! $servings: Int! $image: String!, $readyInMinutes: Int! $ingredients: [String!]! $detailedIngredients: [String!]! $instructions: String! $sourceUrl: String) {
    createRecipe(title: $title, servings: $servings image: $image, readyInMinutes: $readyInMinutes, ingredients: $ingredients, detailedIngredients: $detailedIngredients, instructions: $instructions, sourceUrl: $sourceUrl) {
        id
    }
  }
`;

export const AddRecipeForm: React.FunctionComponent = (): React.ReactElement => {
    const { detailedIngredients, addDetailedIngredient, deleteDetailedIngredient } = useDetailedIngredientState();
    const { title, instructions, servings, ingredients, readyInMinutes, sourceUrl, dispatch } = useRecipeFormState();
    const [emptyInput, setEmptyInput] = React.useState<boolean>(false);
    const [createRecipe, { data, error, loading }] = useMutation(ADD_RECIPE);
    const emptyState = initialState.title || initialState.readyInMinutes || ingredients.length === 0 || detailedIngredients.length === 0 || instructions.length === 0

    const handleSubmit = (event): any => {
        event.preventDefault();

        if (emptyState) {
            setEmptyInput(true)
        } else {
            setEmptyInput(false)
            createRecipe({ variables: { title, servings, image: "https://spoonacular.com/recipeImages/543832-556x370.jpg", readyInMinutes, ingredients, detailedIngredients, instructions, sourceUrl } });
        }

    }

    if (loading) return <LoadingBar />
    if (error) {
        return (<ErrorMessage message={`ERROR: ${error.message}`}></ErrorMessage>)
    }
    if (data) {
        // window.location.reload(false)
        return <Redirect to={{ pathname: `/recipe/${data.createRecipe.id}`, state: { backPath: '/user' } }} />
    }
    return (
        <div className="content p-10">
            <div className="flex justify-center items-center">
                <div className="flex flex-col w-1/2 recipe-form">
                    <h1 className="form-header font-bebas uppercase text-darkGray text-center pb-0 m-0">Add Recipe</h1>
                    <form onSubmit={(e): any => handleSubmit(e)}>
                        {emptyInput && title === '' && <ErrorMessage validationMessage='Add title' />}
                        <label className="text-sm text-lightGreen uppercase">Title
                            <input className={cx(emptyInput && title === '' && "inputError")} name="title" type="text" value={title} onChange={(e: React.ChangeEvent<HTMLInputElement>): void => dispatch({ TYPE: 'ADD_TITLE', setTitle: e.target.value })} />
                        </label>
                        {emptyInput && servings === 0 && <ErrorMessage validationMessage='Add servings' />}
                        <label className="text-sm text-lightGreen uppercase">Servings
                        <input className={cx(emptyInput && title === '' ? "inputError mt-2 mb-2" : "mt-2 mb-2")} name="servings" type="number" placeholder="Servings" value={servings}
                                onChange={(e: React.ChangeEvent<HTMLInputElement>): void => {
                                    const val = parseInt(e.target.value, 10);
                                    if (val > 0) dispatch({ TYPE: 'ADD_SERVINGS', setServings: val })
                                }} />
                        </label>
                        {emptyInput && readyInMinutes === 0 && <ErrorMessage validationMessage='Add preparation time' />}
                        <label className="text-sm text-lightGreen uppercase">Ready In Minutes
                        <input className={cx(emptyInput && readyInMinutes === 0 ? "inputError mt-2 mb-2" : "mt-2 mb-2")} name="readyInMinutes" type="number" value={readyInMinutes}
                                onChange={(e: React.ChangeEvent<HTMLInputElement>): void => {
                                    const val = parseInt(e.target.value, 10);
                                    if (val > 0) dispatch({ TYPE: 'ADD_READY_IN_MINUTES', setMinutes: val })
                                }} />
                        </label>
                        {emptyInput && ingredients.length === 0 && <ErrorMessage validationMessage='Add ingredients to make the recipe searchable' />}
                        <AutocompleteIngredients dispatch={dispatch} ingredients={ingredients} emptyInput={emptyInput && ingredients.length === 0} />

                        {emptyInput && detailedIngredients.length === 0 && <ErrorMessage validationMessage='Add detailed ingredients eg: 1 tbsp olive oil' />}
                        <label className="text-sm text-lightGreen uppercase">Detailed ingredient
                        <ListAddForm saveItem={(text: string) => {
                                const trimmedText = text.trim();
                                if (trimmedText.length > 0) {
                                    addDetailedIngredient(trimmedText);
                                }
                            }}
                                emptyInput={emptyInput && detailedIngredients.length === 0}

                            />
                        </label>
                        <List list={detailedIngredients} deleteItem={(index: number): any => deleteDetailedIngredient(index)} />
                        {emptyInput && instructions.length === 0 && <ErrorMessage validationMessage='Add detailed instructions' />}

                        <label className="text-sm text-lightGreen uppercase">Instructions
                        <textarea className={cx(emptyInput && instructions.length === 0 && "inputError")} name="instructions" value={instructions} onChange={(e: any): void => {
                                const text = e.target.value
                                if (text.length > 0) dispatch({ TYPE: 'ADD_INSTRUCTIONS', setInstructions: text })
                            }}></textarea>
                        </label>

                        <label className="text-sm text-lightGreen uppercase">Source Url
                            <input name="sourceUrl" type="text" placeholder="Source Url" value={sourceUrl} onChange={(e: React.ChangeEvent<HTMLInputElement>): void => {
                                isUrlValid(e.target.value) ? dispatch({ TYPE: 'ADD_SOURCE_URL', setUrl: e.target.value }) : dispatch({ TYPE: 'ADD_SOURCE_URL', setUrl: undefined })
                            }} />
                        </label>
                        <Button type="submit">Send Recipe</Button>
                    </form>
                </div>
            </div>
        </div>
    )
};