export default async function getFuel(request) {
    try {
        const reqData = await request.json();
        const endpointURL = 'https://carbonsutra1.p.rapidapi.com/fuel_estimate';
        const options = {
            method : 'POST',
            headers : {
                'Authorization' : `Bearer ${Netlify.env.get('authorization')}`,
                'x-rapidapi-host' : 'carbonsutra1.p.rapidapi.com',
                'Content-Type': 'application/x-www-form-urlencoded',
                'x-rapidapi-key' : Netlify.env.get('rapidAPIKey')
            },
            body : new URLSearchParams({
                fuel_usage : reqData.fuel_usage, // dropdown
                fuel_name : reqData.fuel_name, // dropdown based on the inputed from the above dropdown
                fuel_value : reqData.fuel_value // in tonnes (1 ton = 1000kg) 
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