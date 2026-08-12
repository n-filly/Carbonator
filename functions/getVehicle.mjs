export default async function getVehicle(request) {
    try {
        const reqData = await request.json();
        const endpointURL = 'https://carbonsutra1.p.rapidapi.com/vehicle_estimate_by_type';
        const options = {
            method : 'POST',
            headers : {
                'Authorization' : `Bearer ${Netlify.env.get('authorization')}`,
                'x-rapidapi-host' : 'carbonsutra1.p.rapidapi.com',
                'Content-Type': 'application/x-www-form-urlencoded',
                'x-rapidapi-key' : Netlify.env.get('rapidAPIKey')
            },
            body : new URLSearchParams({
                vehicle_type : reqData.vehicle_type,
                fuel_type : reqData.fuel_type,
                distance_unit : reqData.distance_unit,
                distance_value : reqData.distance_value,
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