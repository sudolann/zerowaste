import * as React from "react";
import { Image, Button, ErrorMessage, DialogDeleteRecipe } from '../components';

import gql from 'graphql-tag';
import { useLazyQuery } from '@apollo/react-hooks';
import { Redirect, useHistory } from "react-router";


const GET_RECIPE_DETAILS = gql`
  query GetRecipeDetails($id: ID!) {
    recipe(id: $id) {
        title
        servings
        image
        readyInMinutes
        detailedIngredients
        author
        sourceUrl
        instructions
        user{
            name
        }
    }
  }
`;


export interface RecipeItemProps {
    id: string
    title: string
    image: string
    ingredients: string[]
    deleteEditBtn?: boolean
}

export const RecipeItem: React.FunctionComponent<RecipeItemProps> = ({ id, title, image, ingredients, deleteEditBtn = false }): React.ReactElement => {
    const [open, setOpen] = React.useState(false);
    const [getRecipeData, { data, loading, error }] = useLazyQuery(GET_RECIPE_DETAILS);
    const editRecipe = () => getRecipeData({ variables: { id } })


    if (data) {
        const { servings, instructions, readyInMinutes, detailedIngredients, sourceUrl } = data.recipe
        return <Redirect to={{ pathname: `/editRecipe/${id}`, state: { title, image, servings, instructions, ingredients, readyInMinutes, detailedIngredients, sourceUrl } }} />
    }

    if (open) {
        return <DialogDeleteRecipe open={open} toggleOpen={(value): void => setOpen(value)} recipeId={id} />
    }
    return (
        <div className="flex bg-milk bo mb-4 mr-4 max-w-sm lg:max-w-xl mb-3 list--item relative" key={id}>
            <div className="w-42"><Image src={image} className="rounded-m m-4" size="small" alt={title} /></div>
            <div className="mt-4 mb-4">
                <h3 className="font-bebas text-lightGreen mb-1">{title}</h3>
                <span className="font-roboto uppercase text-xs font-semibold text-darkGray">ingredients: </span>
                <span className='font-roboto text-xs'>{ingredients.join(', ')}</span>
                {deleteEditBtn ? <Button
                    to={{ pathname: `/recipe/${id}`, state: { backPath: '/user' } }}
                >see more
                </Button> : <Button to={`/recipe/${id}`}>see more</Button>}
                {deleteEditBtn && (<div className="">
                    <Button color="coral" onClick={(): void => setOpen(true)}>Delete Recipe</Button>
                    <Button onClick={editRecipe}>Edit Recipe</Button>

                </div>)}
            </div>
        </div>
    );
};
