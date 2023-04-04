import axios from "axios";

function responseStatusCheck(res) {

    if (res.status >= 200 && res.status < 300) {
        return Promise.resolve(res);
    } else {
        return Promise.reject(new Error(res.status));
    }
}

export async function getQuotes(req, res) {

    const key = process.env.QUOTES_API_KEY;
    const url = "https://quotes15.p.rapidapi.com/topic"
    try {
        const request = await axios.post(`${url}`,
            {
                headers: {
                    "X-RapidAPI-Key": key,
                    'X-RapidAPI-Host': 'quotes15.p.rapidapi.com'
                },
                data: {
                    "topic": "motivational",
                    "pageSize": 1,
                    "page": 1
                }
            })
        const response = await responseStatusCheck(request);
        const data = response.data;

        return res.send(data);
    }

    catch (err) {
        console.log(err)
        return res.status(500).send({ message: "Something went wrong!" })
    }
}
