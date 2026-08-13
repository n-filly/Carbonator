const button1 = document.querySelector('#elec-calc');
const button2 = document.querySelector('#vehicle-calc');
const button3 = document.querySelector('#fuel-calc');
const button4 = document.querySelector('#shipping-calc');
const button5 = document.querySelector('#reset-all');
const button6 = document.querySelector('#save'); 
const button7 = document.querySelector('#clear');
const button8 = document.querySelector('#confirm-delete');

const list = document.querySelector('#saved-calc');
const indivResetBtn = document.querySelectorAll('.reset');

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

let elecEst = {
    country : '',
    amount : '',
    elecUnit : '',
}

let vehicleEst = {
    vehicleType : '',
    fuelType :  '',
    distanceUnit : '',
    distance : ''
} 

let fuelEst = {
    fuelType : '',
    fuelName : '',
    fuelUnit : '',
    fuelAmount : ''
}

let freightEst = {
    shippingMethod : '',
    shippingWeight : '',
    massUnit : '',
    distance : '',
    distanceUnit : ''
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
    const elecResult = document.querySelector('#elec-result'); 

    if (!inputCheck('elec-container')) {
        elecResult.textContent = "Please make sure to include an answer for each item.";
        return;
    }

    const country = document.querySelector('#electricity-country-input').value;
    const elecAmount = document.querySelector('#electricity-num-input').value;
    const unit = document.querySelector('#electricity-unit-input').value;

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
        let oldElecLBS = carbonUsageByCatLBS['elec'];

        carbonUsageByCat['elec'] = res.data['co2e_kg'];
        carbonUsageByCatLBS['elec'] = res.data['co2e_lb'];

        totalCO2Estimate += carbonUsageByCat['elec'] - oldElec;
        totalCO2EstimateLBS += carbonUsageByCatLBS['elec'] - oldElecLBS;

        elecResult.innerHTML = `Your carbon usage is ${carbonUsageByCat['elec'].toFixed(2)}kg 
                                (or ${carbonUsageByCatLBS['elec'].toFixed(2)}lbs) for Electricity usage`;
        console.log(res);
        computeEmission();

        elecEst.country = country;
        elecEst.amount = parseFloat(elecAmount);
        elecEst.elecUnit = unit;

        return res;
    } catch (error) {
        console.log(error);
    }
}

// We estimate using the vehicle's general type
async function getVehicleCarbonEstimate(event) {
    event.preventDefault();
    const vehicleResult = document.querySelector('#vehicle-result');

    if (!inputCheck('vehicle-container')) {
        vehicleResult.textContent = "Please make sure to include an answer for each item.";
        return;
    }

    const vehicleType = document.querySelector('#vehicle-size-input').value;
    const vehicleFuel = document.querySelector('#vehicle-fuel-input').value;
    const unit = document.querySelector('#vehicle-unit-input').value;
    const vehicleDist = document.querySelector('#vehicle-distance-input').value;

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

        carbonUsageByCat['vehicle'] = res.data['co2e_kg'];
        carbonUsageByCatLBS['vehicle'] = res.data['co2e_lb'];

        totalCO2Estimate += carbonUsageByCat['vehicle'] - oldVehicle;
        totalCO2EstimateLBS += carbonUsageByCatLBS['vehicle'] - oldVehicleLBS;

        vehicleResult.innerHTML = `Your carbon usage is ${carbonUsageByCat['vehicle'].toFixed(2)}kg
                                     (or ${carbonUsageByCatLBS['vehicle'].toFixed(2)}lbs)`;
        console.log(res);
        computeEmission();

        vehicleEst.vehicleType = vehicleType;
        vehicleEst.fuelType = vehicleFuel;
        vehicleEst.distanceUnit = unit;
        vehicleEst.distance = parseFloat(vehicleDist);

        return res;
    } catch(error) {
        console.log(error);
    }
}

async function getFuelEstimate(event) {
    event.preventDefault();
    const result = document.querySelector('#fuel-result');

    if (!inputCheck('fuel-container')) {
        result.textContent = "Please make sure to include an answer for each item.";
        return;
    }

    const fuelType = document.querySelector('#fuel-type-input').value;
    const fuelName = document.querySelector('#fuel-name-input').value;
    const unit = document.querySelector('#fuel-unit-input').value;
    const fuelAmount = document.querySelector('#fuel-amount-input').value; 

    const intFuel = parseFloat(fuelAmount);

    const endpoint = "/.netlify/functions/getFuel";
    const options = {
        method : 'POST',
        headers : {
            'Content-Type' : "application/json"
        }, 
        body : JSON.stringify ({
            fuel_usage : fuelType,
            fuel_name : fuelName,
            fuel_value : unit === 'kg' ? intFuel / 1000 : convertLBStoKG(intFuel) / 1000 // convert to metric tonnes
        })
    }
    try {
        let response = await fetch(endpoint, options);
        let res = await response.json();

        let oldFuel = carbonUsageByCat['fuel'];
        let oldFuelLBS = carbonUsageByCatLBS['fuel'];

        carbonUsageByCat['fuel'] = res.data['co2e_kg'];
        carbonUsageByCatLBS['fuel'] = res.data['co2e_lb'];

        totalCO2Estimate += carbonUsageByCat['fuel'] - oldFuel;
        totalCO2EstimateLBS += carbonUsageByCatLBS['fuel'] - oldFuelLBS;

        result.innerHTML = `Your carbon usage is ${carbonUsageByCat['fuel'].toFixed(2)}kg 
                            (or ${carbonUsageByCatLBS['fuel'].toFixed(2)}lbs) for Fuel usage`;
        console.log(res);
        computeEmission();

        fuelEst.fuelType = fuelType;
        fuelEst.fuelName = fuelName;
        fuelEst.fuelUnit = unit;
        fuelEst.fuelAmount = intFuel;

        return res;
    } catch(error) {
        console.log(error);
    }
}

function fuelInputCheck(event) {
    event.preventDefault();

    let fuelTypeSelect = document.querySelector('#fuel-type-input');
    let fuelNamesContainer = document.querySelector('.fuel-name-container');

    if (fuelTypeSelect.value === "") {
        fuelNamesContainer.style.display = 'none';
        return;
    } else {
        fuelNamesContainer.style.display = 'block';
        let nameDropdown = document.querySelector('#fuel-name-input');

        nameDropdown.innerHTML = `<option value="">Select Fuel Name</option>`;

        let selectedCollection = fuelInputs[fuelTypeSelect.value];

        selectedCollection.forEach(function(name) {
            let newOption = document.createElement('option');
            newOption.value = name;
            newOption.textContent = name;
            nameDropdown.appendChild(newOption);
        });   
    }
}

async function getShippingEstimate(event) {
    event.preventDefault();
    const shippingResult = document.querySelector('#shipping-result');

    if (!inputCheck('freight-container')) {
        shippingResult.textContent = "Please make sure to include an answer for each item.";
        return;
    }

    const shippingMethod = document.querySelector('#shipping-method-input').value;
    const freightWeight = document.querySelector('#shipping-weight-input').value;
    const freightDist = document.querySelector('#shipping-distance-input').value;
    const weightUnit = document.querySelector('#shipping-w-units-input').value;
    const distUnit = document.querySelector('#shipping-d-units-input').value;

    const intWeight = parseFloat(freightWeight);
    const intDist = parseFloat(freightDist);

    const endpoint = "/.netlify/functions/getShipping";
    const options = {
        method : 'POST',
        headers : {
            'Content-Type' : "application/json"
        }, 
        body : JSON.stringify ({
            transport_mode : shippingMethod,
            freight_weight : weightUnit === 'kg' ? intWeight : convertLBSToKG(intWeight),
            distance_value : distUnit === 'km' ? intDist : convertMIToKM(intDist) 
        })
    }
    try {
        let response = await fetch(endpoint, options);
        let res = await response.json();

        let oldFreight = carbonUsageByCat['freight'];
        let oldFreightLBS = carbonUsageByCatLBS['freight'];

        carbonUsageByCat['freight'] = res.data['co2e_kg'];
        carbonUsageByCatLBS['freight'] = res.data['co2e_lb'];

        totalCO2Estimate += carbonUsageByCat['freight'] - oldFreight;
        totalCO2EstimateLBS += carbonUsageByCatLBS['freight'] - oldFreightLBS;

        shippingResult.innerHTML = `Your carbon usage is ${carbonUsageByCat['freight'].toFixed(2)}kg 
                                    (or ${carbonUsageByCatLBS['freight'].toFixed(2)}lbs)`;
        console.log(res);
        computeEmission();

        freightEst.shippingMethod = shippingMethod;
        freightEst.shippingWeight = intWeight;
        freightEst.massUnit = weightUnit;
        freightEst.distance = intDist;
        freightEst.distanceUnit = distUnit;

        return res;
    } catch(error) {
        console.log(error);
    }
}

function resetAllInputContent(event) {
    event.preventDefault();

    const inputs = document.querySelectorAll('input, select');
    inputs.forEach(function(input) {
        if (input.tagName === 'INPUT') {
            input.value = 0;
        } else {
            input.value = "";
        }

        if (input.id === 'fuel-type-input') {
            fuelInputCheck(event);
        }
    });

    const containerResult = document.querySelectorAll('.carbon-result');
    containerResult.forEach(function(result) {
        result.innerHTML = "";
    })
        elecEst.country = '';
        elecEst.amount = '';
        elecEst.elecUnit = '';

        vehicleEst.vehicleType = '';
        vehicleEst.fuelType = '';
        vehicleEst.distanceUnit = '';
        vehicleEst.distance = '';

        fuelEst.fuelType = '';
        fuelEst.fuelName = '';
        fuelEst.fuelUnit = '';
        fuelEst.fuelAmount = '';

        freightEst.shippingMethod = '';
        freightEst.shippingWeight = '';
        freightEst.massUnit = '';
        freightEst.distance = '';
        freightEst.distanceUnit = '';

    totalCO2Estimate = 0;
    totalCO2EstimateLBS = 0;
    Object.keys(carbonUsageByCat).forEach(function(key) {
        carbonUsageByCat[key] = 0;
        carbonUsageByCatLBS[key] = 0;
    });  
    computeEmission();
}

function clearSingleSection(event){
    let dictionarySelection = {
        elec : elecEst,
        vehicle : vehicleEst,
        fuel : fuelEst,
        freight : freightEst
    }

    event.preventDefault();
    const btn = event.currentTarget;
    console.log(btn);

    const id = btn.id;

    const inputs = document.querySelectorAll(`.${id}`);
    
    inputs.forEach(function(input) {
        if (input.tagName === 'INPUT') {
            input.value = 0;
        } else {
            input.value = "";
        }
    });

    if (id == 'fuel') {
        fuelInputCheck(event);
    }

    const result = document.querySelector(`#${id}-result`);
    result.innerHTML = "";

    let selectedDictionary = dictionarySelection[id];

    Object.keys(selectedDictionary).forEach(function(key) {
        selectedDictionary[key] = ''; 
    });

    totalCO2Estimate -= carbonUsageByCat[btn.id];
    totalCO2EstimateLBS -= carbonUsageByCatLBS[btn.id];
    carbonUsageByCat[btn.id] = 0;
    carbonUsageByCatLBS[btn.id] = 0;
    computeEmission();
} 

indivResetBtn.forEach(function(btn) {
    btn.addEventListener('click', clearSingleSection);
})

function computeEmission() {
    const kgRes = document.querySelector('#kg');
    const lbRes = document.querySelector('#lbs');
    const compareTo = document.querySelector('#total-emissions');
    const resultText = document.querySelector('#final-result');

    kgRes.textContent = `In kg: ${totalCO2Estimate.toFixed(2)}kg`;
    lbRes.textContent = `In lbs: ${totalCO2EstimateLBS.toFixed(2)}lbs`;

    if (totalCO2Estimate === 0) {
        compareTo.textContent = 'Stolas';
        resultText.textContent = 'You are like this demon owl prince!';
    }
}

function inputCheck(containerID) {
    const container = document.querySelector(`#${containerID}`);
    const inputs = container.querySelectorAll('input, select');
    for (let input of inputs) {
        if(input.value === "") {
            return false;
        }
    }
    return true;
}

function convertLBStoKG(amountLBS) {
    return amountLBS / 2.20462262185;
}

function convertMItoKM(amountMI) {
    return amountMI * 1.609344;
}


function saveToLocalStorage(event) {
    event.preventDefault();

    let savedCalculations = {
        electricity : elecEst,
        vehicle : vehicleEst,
        fuel : fuelEst,
        shipping : freightEst,
        breakdown : {
            elec : carbonUsageByCat['elec'],
            vehicle : carbonUsageByCat['vehicle'],
            fuel : carbonUsageByCat['fuel'],
            freight : carbonUsageByCat['freight'],
        },
        breakdownLBS : {
            elec : carbonUsageByCatLBS['elec'],
            vehicle : carbonUsageByCatLBS['vehicle'],
            fuel : carbonUsageByCatLBS['fuel'],
            freight : carbonUsageByCatLBS['freight'],
        },
        totalInKG : totalCO2Estimate,
        totalInLBS : totalCO2EstimateLBS,
    }

    const warning = document.querySelector('#warning');
    let date = new Date();

    if (totalCO2Estimate === 0) {
        warning.textContent = `Please calculate the emissions first before saving 
                                (Or maybe your carbon emissions is close to zero XD)!`;
    } else {
        warning.textContent = '';
        localStorage.setItem(date.toLocaleString(), JSON.stringify(savedCalculations));
        showHistory();
    }
}

function showHistory() {
    list.innerHTML = ''
    let keys = Object.keys(localStorage);
    let total = Object.keys(localStorage).length;

    if (total > 0) {
        for (let key of keys) {
            const saved = JSON.parse(localStorage.getItem(key));
            let item = document.createElement('li');

            console.log(saved);
            
            item.innerHTML = `
                    <div class="history-date">${key}</div>
                    <p>
                        Electricity: ${saved.electricity.amount} ${saved.electricity.elecUnit}
                        (${saved.electricity.country})
                        → ${saved.breakdown.elec} kg (or ${saved.breakdownLBS.elec} lbs)
                    </p>
                    <p>
                        Vehicle: ${saved.vehicle.vehicleType},
                        ${saved.vehicle.fuelType},
                        ${saved.vehicle.distance} ${saved.vehicle.distanceUnit}
                        → ${saved.breakdown.vehicle} kg (or ${saved.breakdownLBS.vehicle} lbs)
                    </p>
                    <p>
                        Fuel: ${saved.fuel.fuelAmount} ${saved.fuel.fuelUnit}
                        ${saved.fuel.fuelName}
                        → ${saved.breakdown.fuel} kg (or ${saved.breakdownLBS.fuel} lbs)
                    </p>
                    <p>
                        Shipping: ${saved.shipping.shippingWeight} ${saved.shipping.massUnit},
                        ${saved.shipping.distance} ${saved.shipping.distanceUnit}
                        → ${saved.breakdown.freight} kg (or ${saved.breakdownLBS.freight} lbs)
                    </p>
                    <div class="history-total">
                        Total: ${saved.totalInKG} kg (or ${saved.totalInLBS} lbs)
                    </div>
                `;
            item.id = key;
            item.addEventListener('click', clearQuery);
            list.prepend(item);
        }
    }
}

function clearQuery(event) {
    event.preventDefault();
    this.classList.add('removed');
    let id = this.id;
    this.addEventListener('click', unselect);
}

function unselect(event) {
    event.preventDefault();
    this.classList.remove('removed');
    this.removeEventListener('click', unselect);
    this.addEventListener('click', clearQuery);
}

button1.addEventListener('click', fetchElec);
button2.addEventListener('click', getVehicleCarbonEstimate);
button3.addEventListener('click', getFuelEstimate);
button4.addEventListener('click', getShippingEstimate);
button5.addEventListener('click', resetAllInputContent);
button6.addEventListener('click', saveToLocalStorage);
document.querySelector('#fuel-type-input').addEventListener('change', fuelInputCheck);

populateDropdowns(countryList, 'electricity-country-input');
populateDropdowns(vehicleTypesList, 'vehicle-size-input');
computeEmission();
showHistory();

button7.addEventListener('click', () => {
    localStorage.clear();
    location.reload();
});

button8.addEventListener('click', () => {
    const removedItems = document.querySelectorAll('.removed');
    removedItems.forEach(item => {
        localStorage.removeItem(item.id);
    });
});