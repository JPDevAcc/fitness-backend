import axios from "axios";
import Recipe from "../models/recipe.mjs";
import Picture from "../models/picture.mjs";

function responseStatusCheck(res) {

    if (res.status >= 200 && res.status < 300) {
        return Promise.resolve(res);
    } else {
        return Promise.reject(new Error(res.status));
    }
}

export async function getRecipe(req, res) {


    const key = process.env.FOOD_API_KEY;

    const url = "https://spoonacular-recipe-food-nutrition-v1.p.rapidapi.com/recipes/complexSearch"
    try {

        console.log(req.body)
        const params = new URLSearchParams({
            query: req.params.query
        })

        const request = await axios.get(`${url}?${params.toString()}`,
            {
                headers: {
                    'X-RapidAPI-Key': key,
                    'X-RapidAPI-Host': 'spoonacular-recipe-food-nutrition-v1.p.rapidapi.com'
                }
            }
        )
        const response = await responseStatusCheck(request);
        const data = response.data;

        return res.send(data);
    }

    catch (err) {
        return res.status(500).send({ message: "Something went wrong!" })
    }
}

export async function addRecipe(req, res) {
    console.log(req.body.id)

    try {
        if (await Recipe.findOne({ id: req.body.id })) {
            return res.send({ message: "Recipe already exists!" });
        }
        else {
            const recipe = new Recipe(req.body);
            await recipe.save()
            return res.send({ message: "Recipe added successfully!" });
        }

    }
    catch (err) {
        return res.status(500).send({ message: "Something went wrong!" })
    }

}


export async function addPicture(req, res) {
    const picture = new Picture(req.body);
    try {

        await picture.save()
        return res.send({ result: true });
    }
    catch (err) {
        return res.status(500).send({ message: "Something went wrong!" })
    }

}

export async function getSavedRecipes(req, res) {
    try {
        const recipes = await Recipe.find();
        return res.send(recipes);
    }
    catch (err) {
        return res.status(500).send({ message: "Something went wrong!" })
    }
}
