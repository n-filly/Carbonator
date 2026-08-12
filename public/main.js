const button1 = document.querySelector('#elec-calc');
const button2 = document.querySelector('#vehicle-calc');
const button3 = document.querySelector('#fuel-calc');
const button4 = document.querySelector('#shipping-calc');

const countryList = ["Australia", "Austria", "Bangladesh", "Belgium", "Bhutan", "Brunei", 
                    "Bulgaria", "Cambodia", "Canada", "China", "Croatia", "Cyprus", "Czechia",
                     "Denmark", "Estonia", "EU-27", "Finland", "France", "Germany", "Greece", 
                     "Hong Kong", "Hungary", "Iceland", "India", "Indonesia", "Ireland", "Italy", 
                     "Japan", "Laos", "Latvia", "Lithuania", "Luxembourg", "Macao", "Malaysia", 
                     "Maldives", "Malta", "Mongolia", "Myanmar", "Nepal", "Netherlands", "New Zealand", 
                     "North Korea", "Norway", "Pakistan", "Papua New Guinea", "Philippines", "Poland", 
                     "Portugal", "Qatar", "Romania", "Singapore", "Slovakia", "Slovenia", "South Korea", 
                     "Spain", "Sri Lanka", "Sweden", "Taiwan", "Thailand", "Turkey", "UK", "USA", "Vietnam"];
const vehicleTypesList = ["Car-Type-Mini", "Car-Type-Supermini", "Car-Type-LowerMedium", 
                        "Car-Type-UpperMedium", "Car-Type-Executive", "Car-Type-Luxury", 
                        "Car-Type-Sports", "Car-Type-4x4", "Car-Type-MPV", "Car-Size-Small", 
                        "Car-Size-Medium", "Car-Size-Large", "Car-Size-Average", "Motorbike-Size-Small", 
                        "Motorbike-Size-Medium", "Motorbike-Size-Large", "Motorbike-Size-Average", 
                        "Bus-LocalAverage", "Bus-Coach", "Taxi-Local", "Train-National", "Train-Local", 
                        "Ferry-FootPassenger", "Ferry-CarPassenger", "Ferry-AllPassenger"];

const fuelInputs = {
    Gas : [
        'Butane',
        'CNG',
        'LNG',
        'LPG',
        'Natural gas',
        'Natural gas (100% mineral blend)',
        'Other petroleum gas',
        'Propane',
    ],
    Liquid : [
        'Aviation spirit',
        'Aviation turbine fuel',
        'Burning oil',
        'Diesel (100% mineral diesel)',
        'Diesel (average biofuel blend)',
        'Fuel oil',
        'Gas oil, Lubricants',
        'Marine fuel oil',
        'Marine gas oil',
        'Naphtha',
        'Petrol (100% mineral petrol)',
        'Petrol (average biofuel blend)',
        'Processed fuel oils - distillate oil',
        'Processed fuel oils - residual oil',
        'Refinery miscellaneous',
        'Waste oils',
    ],
    Solid : [
        'Coal (domestic)',
        'Coal (electricity generation - home produced coal only)',
        'Coal (electricity generation)',
        'Coal (industrial)',
        'Coking coal',
        'Petroleum coke',
    ]
}

const button5 = document.querySelector('#reset-all');
// const button6 = document.querySelector(); Possible button to save the process to move that into the local storage

const indivResetBtn = document.querySelectorAll('.reset');


let totalCO2Estimate = 0;
let totalCO2EstimateLBS = 0;


// kg
let carbonUsageByCat = {
    elec : 0,
    vehicle : 0,
    fuel : 0,
    freight : 0
}

// lbs?
let carbonUsageByCatLBS = {
    elec : 0,
    vehicle : 0,
    fuel : 0,
    freight : 0
}

function populateDropdowns(list, id) {
    const dropdown = document.querySelector(`#${id}`);
    list.forEach(function(item) {
        let option = document.createElement('option');
        option.value = item;
        option.textContent = item;
        dropdown.appendChild(option);
    });
}

async function fetchElec(event) {
    event.preventDefault();

    const country = document.querySelector('#electricity-country-input').value;
    const elecAmount = document.querySelector('#electricity-num-input').value;
    const unit = document.querySelector('#electricity-unit-input').value;
    const elecResult = document.querySelector('#elec-result');

    const endpoint = "/.netlify/functions/getElec";
    const options = {
            method: 'POST',
            headers : {
                'Content-Type' : "application/json"
            },
            body : JSON.stringify({
                country_name : country,
                electricity_value : elecAmount,
                electricity_unit : unit
            })
        }
    try {
        let response = await fetch(endpoint, options);
        let res = await response.json();

        let oldElec = carbonUsageByCat['elec'];
        let oldElecLBS = carbonUsageByCatLBS['elec']

        carbonUsageByCat['elec'] = res.co2e_kg;
        carbonUsageByCatLBS['elec'] = res.co2e_lb;

        totalCO2Estimate += carbonUsageByCat['elec'] - oldElec;
        totalCO2EstimateLBS += carbonUsageByCatLBS['elec'] - oldElecLBS;

        elecResult.innerHTML = `Your carbon usage is ${carbonUsageByCat['elec']}kg (or ${carbonUsageByCatLBS['elec']}lbs) for Electricity usage`;
        console.log(res);
        return res;
    } catch (error) {
        console.log(error);
    }
}

// We estimate using the vehicle's general type
async function getVehicleCarbonEstimate(event) {
    event.preventDefault();

    const vehicleType = document.querySelector('#vehicle-size-input').value;
    const vehicleFuel = document.querySelector('#vehicle-fuel-input').value;
    const unit = document.querySelector('#vehicle-unit-input').value;
    const vehicleDist = document.querySelector('#vehicle-distance-input').value;
    const vehicleResult = document.querySelector('#vehicle-result');

    const endpoint = "/.netlify/functions/getVehicle";
    const options = {
        method : 'POST',
        headers : {
            'Content-Type' : "application/json"
        }, 
        body : JSON.stringify ({
            vehicle_type : vehicleType,
            fuel_type : vehicleFuel,
            distance_unit : unit,
            distance_value : vehicleDist,
        })
    }
    try {
        let response = await fetch(endpoint, options);
        let res = await response.json();

        let oldVehicle = carbonUsageByCat['vehicle'];
        let oldVehicleLBS = carbonUsageByCatLBS['vehicle'];

        carbonUsageByCat['vehicle'] = res.co2e_kg;
        carbonUsageByCatLBS['vehicle'] = res.co2e_lb;

        totalCO2Estimate += carbonUsageByCat['vehicle'] - oldVehicle;
        totalCO2EstimateLBS += carbonUsageByCatLBS['vehicle'] - oldVehicleLBS;

        vehicleResult.innerHTML = `Your carbon usage is ${carbonUsageByCat['vehicle']}kg (or ${carbonUsageByCatLBS['vehicle']}lbs)`;
        console.log(res)
        return res;
    } catch(error) {
        console.log(error);
    }
}

// scrapped
// async function getVehicleMakes() {
//     const endpoint = "/.netlify/functions/getVehicleMakes";
//     const options = {
//         method : 'GET',
//     }
//     try {
//         let response = await fetch(endpoint, options)
//         let res = await response.json();
//         return res;
//     } catch (error) {
//         console.log(error);
//     }
// }

// async function showVehicleMakes() {
//     const vehicleMakesList = await getVehicleMakes();

//     const vehicleMakesDropdown = document.querySelector('#vehicle-size-input');

//     vehicleMakesList.forEach(function(make) {
//         let option = document.createElement('option');
//         option.value = make.id;
//         option.innerHTML = make.name;
//         vehicleMakesDropdown.appendChild(option);
//     });
// }

async function getFuelEstimate(event) {
    event.preventDefault();

    const fuelType = document.querySelector('#fuel-type-input').value;
    const fuelName = document.querySelector('#fuel-name-input').value;
    const fuelAmount = document.querySelector('#fuel-amount-input').value;
    const result = document.querySelector('#fuel-result');

    const endpoint = "/.netlify/functions/getFuel";
    const options = {
        method : 'POST',
        headers : {
            'Content-Type' : "application/json"
        }, 
        body : JSON.stringify ({
            fuel_usage : fuelType,
            fuel_name : fuelName,
            fuel_value : fuelAmount
        })
    }
    try {
        let response = await fetch(endpoint, options);
        let res = await response.json();

        let oldFuel = carbonUsageByCat['fuel'];
        let oldFuelLBS = carbonUsageByCatLBS['fuel'];

        carbonUsageByCat['fuel'] = res.co2e_kg;
        carbonUsageByCatLBS['fuel'] = res.co2e_lb;

        totalCO2Estimate += carbonUsageByCat['fuel'] - oldFuel;
        totalCO2EstimateLBS += carbonUsageByCatLBS['fuel'] - oldFuelLBS;

        result.innerHTML = `Your carbon usage is ${carbonUsageByCat['fuel']}kg (or ${carbonUsageByCatLBS['fuel']}lbs) for Fuel usage`;
        console.log(res);
        return res;
    } catch(error) {
        console.log(error);
    }
}

function fuelInputCheck(event) {
    event.preventDefault();
    let fuelTypeSelect = document.querySelector('#fuel-type-input');
    let fuelNamesSelect = document.querySelector('#fuel-name-input');

    fuelNamesSelect.innerHTML = `<option value="">Select Fuel Name</option>`;

    if (fuelTypeSelect.value === "") {
        return;
    } else {
        let selectedCollection = fuelInputs[fuelTypeSelect.value];
        selectedCollection.forEach(function(name) {
            let newOption = document.createElement('option');
            newOption.value = name;
            newOption.textContent = name;
            fuelNamesSelect.appendChild(newOption);
        });   
    }
}

async function getShippingEstimate(event) {
    event.preventDefault();

    const shippingMethod = document.querySelector('#shipping-method-input').value;
    const freightWeight = document.querySelector('#shipping-weight-input').value;
    const freightDist = document.querySelector('#shipping-distance-input').value;
    const weightUnit = document.querySelector('#shipping-w-units-input').value;
    const distUnit = document.querySelector('#shipping-d-units-input').value;
    const shippingResult = document.querySelector('#shipping-result');

    const endpoint = "/.netlify/functions/getShipping";
    const options = {
        method : 'POST',
        headers : {
            'Content-Type' : "application/json"
        }, 
        body : JSON.stringify ({
            transport_mode : shippingMethod,
            freight_weight : freightWeight, // In kg, (1kg = 1000g)
            distance_value : freightDist // In km (1km = 1000m)
        })
    }
    try {
        let response = await fetch(endpoint, options);
        let res = await response.json();

        let oldFreight = carbonUsageByCat['freight'];
        let oldFreightLBS = carbonUsageByCatLBS['freight'];

        carbonUsageByCat['freight'] = res.co2e_kg;
        carbonUsageByCatLBS['freight'] = res.co2e_lb;

        totalCO2Estimate += carbonUsageByCat['freight'] - oldFreight;
        totalCO2EstimateLBS += carbonUsageByCatLBS['freight'] - oldFreightLBS;

        shippingResult.innerHTML = `Your carbon usage is ${carbonUsageByCat['freight']}kg (or ${carbonUsageByCatLBS['freight']}lbs)`;
        console.log(res)
        return res;
    } catch(error) {
        console.log(error);
    }
}

// Maybe a reset button if the user want to remove everything instead of letting them manually edit everything to default?
function resetAllInputContent(event) {
    event.preventDefault();
    const containers = document.querySelectorAll('.card-body');
    containers.forEach(function(container){
        const inputs = container.querySelectorAll('input, select');

        inputs.forEach(function(input) {
            input.value = "";
        });

        const containerResult = container.querySelector('.carbon-result');
        containerResult.innerHTML = "";
    });

    const fuelNamesSelect = document.querySelector('#fuel-name-input');

    fuelNamesSelect.innerHTML = '<option value="">Select fuel name</option>';

    totalCO2Estimate = 0;
    totalCO2EstimateLBS = 0;
    Object.keys(carbonUsageByCat).forEach(function(key) {
        carbonUsageByCat[key] = 0;
        carbonUsageByCatLBS[key] = 0;
    });  
}

// Clear a single section if the user no longer wants to calculate that, the parameter takes in the container_id
// I kinda recommend that the id matches the dictionary key to reset the value
function clearSingleSection(event){
    event.preventDefault();
    const btn = event.currentTarget;
    console.log(btn);

    const id = btn.id;

    const inputs = document.querySelectorAll(`.${id}`);

    if (id == 'fuel') {
        fuelInputCheck(event);
    }
    
    inputs.forEach(function(input) {
        input.value = "";
    });

    const result = document.querySelector(`#${id}-result`);
    result.innerHTML = "";

    totalCO2Estimate -= carbonUsageByCat[btn.id];
    totalCO2EstimateLBS -= carbonUsageByCatLBS[btn.id];
    carbonUsageByCat[btn.id] = 0;
    carbonUsageByCatLBS[btn.id] = 0;
} 


// Set event listener to the individual clear containers
indivResetBtn.forEach(function(btn) {
    btn.addEventListener('click', clearSingleSection);
})


// Local storage of the 3 most recent calculation? (is it possible to have the history show what the user has input for each container?)
// Might scrap this if its too complicated or its just an overkill for this project setting
/*
function saveToLocalStorage(event, param1, param2, ..., param-n) {
    event.preventDefault();
    localStorage.setItem(, );
}

function clearQuery(event) {
    event.preventDefault();
}

function clearLocalMemory(event){
    event.preventDefault();
}
*/

// Functions that can be likely to be included if the saveToLocalStorage method is a success: click to clear a history item and include the 4th most
// recent into the local storage list once we remove it (removeQuery), and clear all method (clearLocalMemory)?


button1.addEventListener('click', fetchElec);
button2.addEventListener('click', getVehicleCarbonEstimate);
button3.addEventListener('click', getFuelEstimate);
button4.addEventListener('click', getShippingEstimate);
button5.addEventListener('click', resetAllInputContent);
// button6.addEventListener('click', saveToLocalStorage);
document.querySelector('#fuel-type-input').addEventListener('change', fuelInputCheck);

populateDropdowns(countryList, 'electricity-country-input');
populateDropdowns(vehicleTypesList, 'vehicle-size-input');
