// unused file
export default async function getVehicleMakes(request) {
    try {
        const endpointURL = 'https://carbonsutra1.p.rapidapi.com/vehicle_makes';
        const options = {
            method : 'GET',
            headers : {
                'x-rapidapi-host' : 'carbonsutra1.p.rapidapi.com',
                'x-rapidapi-key' : Netlify.env.get('rapidAPIKey')
            }
        };

        const response = await fetch(endpointURL, options);
        const data = await response.json();
        return new Response(
            JSON.stringify(data),
            {
                status : 200,
                headers: {
                    "Content-Type": "application/json"
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