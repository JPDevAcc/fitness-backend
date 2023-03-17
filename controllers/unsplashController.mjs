import axios from "axios";


function responseStatusCheck(res) {

	if (res.status >= 200 && res.status < 300) {
		return Promise.resolve(res);
	} else {
		return Promise.reject(new Error(res.status));
	}
}

export async function getUnsplashPic(req, res) {

	const key = process.env.UNSPLASH_KEY;
	const url = "https://api.unsplash.com/photos/random"
	try {
		const params = new URLSearchParams({
			client_id: key,
			count: 1
		})

		const request = await axios.get(`${url}?${params.toString()}`)
		const response = await responseStatusCheck(request);
		const data = response.data;

		return res.send(data);
	}

	catch (err) {
		return res.status(500).send({ message: "Something went wrong!" })
	}
}