import axios from "axios";


function responseStatusCheck(res) {

	if (res.status >= 200 && res.status < 300) {
		return Promise.resolve(res);
	} else {
		return Promise.reject(new Error(res.status));
	}
}

export async function getBodyparts(req, res) {

	const key = process.env.EXERCISEAPI;
	const url = "https://exercisedb.p.rapidapi.com/exercises/bodyPartList"
	try {
		const params = new URLSearchParams({

		})

		const request = await axios.get(`${url}`,
        {headers:{
			"X-RapidAPI-Key": key,
            'X-RapidAPI-Host': 'exercisedb.p.rapidapi.com'
        }})
		const response = await responseStatusCheck(request);
		const data = response.data;

		return res.send(data);
	}

	catch (err) {
        console.log (err)
		return res.status(500).send({ message: "Something went wrong!" })
	}
}

export async function getExercise(req, res) {
	console.log("MOO! I am not a cow! (but I like exercise!)") ;

	const key = process.env.EXERCISEAPI;
	const bodypart = req.params.bodypart ;
	const url = `https://exercisedb.p.rapidapi.com/exercises/bodyPart/${bodypart}`
	try {
		const params = new URLSearchParams({

		})

		const request = await axios.get(`${url}`,
        {headers:{
			"X-RapidAPI-Key": key,
            'X-RapidAPI-Host': 'exercisedb.p.rapidapi.com'
        }})
		const response = await responseStatusCheck(request);
		const data = response.data;

		return res.send(data);
	}

	catch (err) {
        console.log (err)
		return res.status(500).send({ message: "Something went wrong!" })
	}
}