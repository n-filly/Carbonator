export default async function getElec(request) {
    try {
        const reqData = await request.json();
        const endpointURL = 'https://carbonsutra1.p.rapidapi.com/electricity_estimate';
        const options = {
            method : 'POST',
            headers : {
                'Authorization' : `Bearer ${Netlify.env.get('authorization')}`,
                'x-rapidapi-host' : 'carbonsutra1.p.rapidapi.com',
                'Content-Type': 'application/x-www-form-urlencoded',
                'x-rapidapi-key' : Netlify.env.get('rapidAPIKey')
            },
            body : new URLSearchParams({
                type : 'estimate-electricity',
                country_name : reqData.country_name,
                electricity_value : reqData.electricity_value,
                electricity_unit : reqData.electricity_unit
            })
        };

        const response = await fetch(endpointURL, options);
        const data = await response.json();
        return new Response(
            JSON.stringify(data),
            {
                status : 200,
                headers : {
                    'Content-Type' : 'application/json'
                }
            }
        );
    } catch (error) {
        return new Response(
            JSON.stringify({
                error : 'Could not complete fetch call'
            }),
            {
                status : 500,
                headers : {
                    'Content-Type' : 'application/json'
                }
            }
        );
    }
}