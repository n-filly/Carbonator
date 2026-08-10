// TODO: Replace the placeholer test value to actual selected or inputed value later if everything is set

// Oh also, we might have to handle the case where users might input a negative value for the numerical inputs, but i am not sure if the api handles that atm
// Update: I believed that the API turns negative values into 1 as an inputed value. And assumptions are now scrapped

const authorization = "KEY HERE"; // This is subject to change since we might learn how to hide that
const rapidAPIKey = "KEY HERE";

const button1 = document.querySelector('#test');
const button2 = document.querySelector('#test-1');
const button3 = document.querySelector('#test-2');
const button4 = document.querySelector('#test-3');

const fuelInputs = {
    gas : [
        'Butane',
        'CNG',
        'LNG',
        'LPG',
        'Natural gas',
        'Natural gas (100% mineral blend)',
        'Other petroleum gas',
        'Propane',
    ],
    liquid : [
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
    solid : [
        'Coal (domestic)',
        'Coal (electricity generation - home produced coal only)',
        'Coal (electricity generation)',
        'Coal (industrial)',
        'Coking coal',
        'Petroleum coke',
    ]
}

// const button5 = document.querySelector(); This is the reset all button btw, this will be in developement if the 4 main method works and we have time
// const button6 = document.querySelector(); Possible button to save the process to move that into the local storage

// const indivResetBtn = document.querySelectorAll();

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

// Compute total emmision for a single query
/*
function compute total(dictionary, global) {
    global = 0;
    dictionary.forEach(function(category) {
        global += dictionary[category];
    })
    return global;
}
*/

async function fetchElec() {
    try {
        let response = await fetch("https://carbonsutra1.p.rapidapi.com/electricity_estimate", {
            method: 'POST',
            headers: {
                'Authorization' : `Bearer ${authorization}`,
                'Content-Type' : 'application/x-www-form-urlencoded',
                'x-rapidapi-host' : 'carbonsutra1.p.rapidapi.com',
                'x-rapidapi-key' : rapidAPIKey
            },
            body : new URLSearchParams({
                type : 'estimate-electricity',
                country_name : 'USA',
                electricity_value : 100,
                electricity_unit : 'kWh'
            })
        });
        let res = await response.json();
        console.log(res);
        return res;
    } catch (error) {
        console.log(error);
    }
}

// We estimate using the vehicle's general type
async function getVehicleCarbonEstimate() {
    try {
        let response = await fetch("https://carbonsutra1.p.rapidapi.com/vehicle_estimate_by_type", {
            method : 'POST',
            headers : {
                'Authorization' : `Bearer ${authorization}`,
                'Content-Type' : 'application/x-www-form-urlencoded',
                'x-rapidapi-host' : 'carbonsutra1.p.rapidapi.com',
                'x-rapidapi-key' : rapidAPIKey
            },
            body : new URLSearchParams({
                vehicle_type : "Car-Type-Mini",
                fuel_type : "Unknown",
                distance_unit : "mi",
                distance_value : 100,
            })
        });
        let res = await response.json();
        console.log(res)
        return res;
    } catch(error) {
        console.log(error);
    }
}

async function getFuelEstimate() {
    try {
        let response = await fetch("https://carbonsutra1.p.rapidapi.com/fuel_estimate ", {
            method : 'POST',
            headers : {
                'Authorization' : `Bearer ${authorization}`,
                'Content-Type' : 'application/x-www-form-urlencoded',
                'x-rapidapi-host' : 'carbonsutra1.p.rapidapi.com',
                'x-rapidapi-key' : rapidAPIKey
            },
            body : new URLSearchParams({
                fuel_usage : "Gas", // dropdown
                fuel_name : "Propane", // dropdown based on the inputed from the above dropdown
                fuel_value : 9 // in tonnes (1 ton = 1000kg) 
            })
        });
        let res = await response.json();
        console.log(res)
        return res;
    } catch(error) {
        console.log(error);
    }
}

/*
function fuelInputCheck() {
    let fuelTypeSelect = document.querySelector();
    let fuelNamesSelect = document.querySelector();

    fuelNamesSelect.innerHTML = `<option value="">Select Fuel Name</option>`;

    if (fuelTypeSelect.value === "") {
        return;
    } else {
        let selectedCollection = fuelInputs[fuelTypeSelect];
        selectedCollection.forEach(function(name) {
            let newOption = document.createElement('option');
            newOption.value = name;
            newOption.textContent = name;
            fuelNamesSelect.appendChild(newOption);
        });   
    }
}
*/

async function getShippingEstimate() {
    try {
        let response = await fetch("https://carbonsutra1.p.rapidapi.com/freight_estimate" , {
            method : 'POST',
            headers : {
                'Authorization' : `Bearer ${authorization}`,
                'Content-Type' : 'application/x-www-form-urlencoded',
                'x-rapidapi-host' : 'carbonsutra1.p.rapidapi.com',
                'x-rapidapi-key' : rapidAPIKey
            },
            body : new URLSearchParams({
                transport_mode : "Air",
                freight_weight : 2, // In kg, (1kg = 1000g)
                distance_value : 2200 // In km (1km = 1000m)
            })
        })
        let res = await response.json();
        console.log(res)
        return res;
    } catch(error) {
        console.log(error);
    }
}

// Maybe a reset button if the user want to remove everything instead of letting them manually edit everything to default?
/*
function resetAllInputContent(event) {
    const containers = document.querySelectorAll();
    containers.forEach(function(container){
        let id = container.id;
        clearSingleSection(id); 
    })

    totalCO2Estimate = 0;
    totalCO2EstimateLBS = 0;
    carbonUsageByCat.forEach(function(key) {
        carbonUsageByCat[key] = 0;
    });  
}
*/

// Clear a single section if the user no longer wants to calculate that
/*
function clearSingleSection(id?){
    const containersID = document.querySelector();
    somehow loop through the form elements and reset that?
} 
*/

/* Set event listener to the individual clear containers
indivResetFunction.forEach(function(btn) {
    let id = btn.id;
    id.addEventListener('click', clearSingleSection);
})
*/

// Local storage of the 3 most recent calculation? (is it possible to have the history show what the user has input for each container?)
// Might scrap this if its too complicated or its just an overkill for this project setting
/*
function saveToLocalStorage(param1, param2, ..., param-n) {
    localStorage.setItem(, );
}
*/

// Functions that can be likely to be included if the saveToLocalStorage method is a success: click to clear a history item and include the 4th most
// recent into the local storage list once we remove it (removeQuery), and clear all method (clearLocalMemory)?

// Will add the event listener to the buttons later if we happened to have the HTML setted up
// Assume we are currently having 4 buttons
button1.addEventListener('click', fetchElec);
button2.addEventListener('click', getVehicleCarbonEstimate);
button3.addEventListener('click', getFuelEstimate);
button4.addEventListener('click', getShippingEstimate);
// button5.addEventListener('click', resetAllInputContent);
// button6.addEventListener('click', saveToLocalStorage);
// document.querySelector().addEventListener('change', fuelInputCheck);