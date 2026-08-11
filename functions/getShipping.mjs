export default async function getShipping(request) {
    try {
        const reqData = await request.json();
        const endpointURL = 'https://carbonsutra1.p.rapidapi.com/freight_estimate';
        const options = {
            method : 'POST',
            headers : {
                'Authorization' : `Bearer ${Netlify.env.get('authorization')}`,
                'x-rapidapi-host' : 'carbonsutra1.p.rapidapi.com',
                'Content-Type': 'application/x-www-form-urlencoded',
                'x-rapidapi-key' : Netlify.env.get('rapidAPIKey')
            },
            body : new URLSearchParams({
                transport_mode : reqData.transport_mode,
                freight_weight : reqData.freight_weight, // In kg, (1kg = 1000g)
                distance_value : reqData.distance_value // In km (1km = 1000m)
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