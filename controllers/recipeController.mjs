import axios from "axios";
import getRecipeModel from "../models/recipe.mjs";
import getPictureModel from "../models/picture.mjs";
import getUserDataModel from "../models/userData.mjs"

function responseStatusCheck(res) {
    if (res.status >= 200 && res.status < 300) {
        return Promise.resolve(res);
    } else {
        return Promise.reject(new Error(res.status));
    }
}

export async function getRecipe(req, res) {
		const headers = JSON.parse(process.env.FOOD_API_HEADERS) ;
    const url = process.env.FOOD_API_BASEURL + "/recipes/complexSearch" ;
    try {

        const params = new URLSearchParams({
            query: req.params.query
        })

        const request = await axios.get(`${url}?${params.toString()}`, { headers }) ;
        const response = await responseStatusCheck(request);
        return res.send(response.data);
    }

    catch (err) {
        return res.status(500).send({ message: "Something went wrong!" })
    }
}

export async function addRecipe(req, res) {
	const UserData = getUserDataModel() ;
	const Recipe = getRecipeModel() ;
    try {
        if (await Recipe.findOne({ id: req.body.id })) {
            const userData = await UserData.findOne({ _id: req.session.userId });
            if (userData.recipes.includes(req.body.id)) {
                userData.recipes = userData.recipes.filter(id => id != req.body.id);
                await userData.save();

                return res.send({ message: "Recipe removed from list!" });
            } else {
                userData.recipes.push(req.body.id);
                await userData.save();

                return res.send({ message: "Recipe added to list successfully!" });
            }
        }
        else {
            const recipe = new Recipe(req.body);
            await recipe.save()

            const userData = await UserData.findOne({ _id: req.session.userId });
            userData.recipes.push(req.body.id);
            await userData.save();

            return res.send({ message: "Recipe added successfully!" });
        }

    }
    catch (err) {
        return res.status(500).send({ message: "Something went wrong!" })
    }

}

export async function getFullRecipe(req, res) {
		const headers = JSON.parse(process.env.FOOD_API_HEADERS) ;
    const url = process.env.FOOD_API_BASEURL + "/recipes/" + req.params.id + "/information"
    try {
        const request = await axios.get(`${url}`, { headers }) ;
        const response = await responseStatusCheck(request);
        return res.send( response.data);
    }

    catch (err) {
        return res.status(500).send({ message: "Something went wrong!" })
    }
}

export async function getIngredientInfo(req, res) {
		const headers = JSON.parse(process.env.FOOD_API_HEADERS) ;
    const url = process.env.FOOD_API_BASEURL + "/food/ingredients/" + req.params.id + "/information"
    try {

        const request = await axios.get(`${url}`,

            {
                params: {
                    amount: req.params.amount,
                    unit: req.params.unit
                },
                headers
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

export async function getIngredientID(req, res) {
		const headers = JSON.parse(process.env.FOOD_API_HEADERS) ;
    const url = process.env.FOOD_API_BASEURL + "/food/ingredients/search"
    try {

        const request = await axios.get(`${url}`,

            {
                params: { query: req.params.query },
                headers
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

export async function addPicture(req, res) {
	const Picture = getPictureModel() ;

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
	const Recipe = getRecipeModel() ;
    try {
        const recipes = await Recipe.find();
        return res.send(recipes);
    }
    catch (err) {
        return res.status(500).send({ message: "Something went wrong!" })
    }
}

export async function getUsersRecipes(req, res) {
	const UserData = getUserDataModel() ;
	const Recipe = getRecipeModel() ;
    try {
        const userData = await UserData.findOne({ _id: req.session.userId });
        const recipes = await Recipe.find({ id: { $in: userData.recipes } });
        return res.send(recipes);
    } catch (err) {
        return res.status(500).send({ message: "Something went wrong!" })
    }
}

export async function checkRecipe(req, res) {
	const UserData = getUserDataModel() ;
	
    try {
        const userData = await UserData.findOne({ _id: req.session.userId });
        const recipes = await userData.recipes;
        if (!recipes) { return res.send(false) }
        else if (recipes.includes(req.params.id)) {
            return res.send(true);
        }
        else {
            return res.send(false);
        }
    }
    catch (err) {
        console.log(err)
        return res.status(500).send({ message: "Something went wrong!" })
    }
}

