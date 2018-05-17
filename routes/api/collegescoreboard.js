const router = require("express").Router();
const axios = require("axios");
const QUERYURL = "https://api.data.gov/ed/collegescorecard/v1/schools/?api_key=pTArHCwVfBH8pDnZG0UAOdFF6iDRecYtEs9rCIc3";
router.get("/search/:zip/:distance", function (req, res) {
    let query = QUERYURL;
    query += `&zip=${req.params.zip}`;
    query += `&distance=${req.params.distance}`;
    query += `&2015.academics.program_available.assoc_or_bachelors=true`;
    query += "&sort=2015.completion.rate_suppressed.overall%3adesc";
    let fields = [
        "id",
        "school.name",
        "school.city",
        "school.state",
        "2015.student.size",
        "school.school_url",
        "school.ownership",
        "school.locale",
        "2015.academics.program_available.bachelors"
    ];
    query += `&fields=${fields.join(",")}`;

    axios.get(query)
        .then(function (response) {
            let results = [];
            for(var i = 0; i < response.data.results.length; i++) {
                let type;
                if(response.data.results[i]["2015.academics.program_available.bachelors"]) type = "Four Year";
                else type = "Two Year";

                let ownership;
                switch (response.data.results[i]["school.ownership"]) {
                    case 1: ownership = "Public";
                        break;
                    case 2: ownership = "Private (Non-Profit)";
                        break;
                    case 3: ownership = "Private (For-Profit)";
                        break;
                }
    
                let location;
                switch (response.data.results[i]["school.locale"]) {
                    case 11:
                    case 12:
                    case 13: location = "City";
                        break;
                    case 21:
                    case 22:
                    case 23: location = "Suburb";
                        break;
                    case 31:
                    case 32:
                    case 33: location = "Town";
                        break;
                    case 41:
                    case 42:
                    case 43: location = "Rural";
                        break;
                }
                
                let result = {
                    id: response.data.results[i].id,
                    name: response.data.results[i]["school.name"],
                    city: response.data.results[i]["school.city"],
                    state: response.data.results[i]["school.state"],
                    size: response.data.results[i]["2015.student.size"],
                    url: response.data.results[i]["school_url"],
                    type: type,
                    ownership: ownership,
                    location: location,
                }
                results.push(result);
            }
            res.json(results);
        })
        .catch(function (err) {
            console.log(err);
            res.status(400).end();
        })
});

router.get("/schools/:id", function (req, res) {
    let query = QUERYURL;
    query += `&id=${req.params.id}`;

    axios.get(query)
        .then(function (response) {
            let type;
            if(response.data.results[0]["2015"].academics.program_available.bachelors) type = "Four Year";
            else type = "Two Year";

            let ownership;
            switch (response.data.results[0].school.ownership) {
                case 1: ownership = "Public";
                    break;
                case 2: ownership = "Private (Non-Profit)";
                    break;
                case 3: ownership = "Private (For-Profit)";
                    break;
            }

            let location;
            switch (response.data.results[0].school.locale) {
                case 11:
                case 12:
                case 13: location = "City";
                    break;
                case 21:
                case 22:
                case 23: location = "Suburb";
                    break;
                case 31:
                case 32:
                case 33: location = "Town";
                    break;
                case 41:
                case 42:
                case 43: location = "Rural";
                    break;
            }

            let results = {
                id: response.data.results[0].id,
                name: response.data.results[0].school.name,
                city: response.data.results[0].school.city,
                state: response.data.results[0].school.state,
                lat: response.data.results[0].location.lat,
                lon: response.data.results[0].location.lon,
                size: response.data.results[0]["2015"].student.size,
                url: response.data.results[0].school.school_url,
                type: type,
                ownership: ownership,
                location: location,
                cost: response.data.results[0]["2015"].cost.avg_net_price.overall,
                gradrate: response.data.results[0]["2015"].completion.rate_suppressed.overall,
                earnings: response.data.results[0]["2013"].earnings["10_yrs_after_entry"].median,
                loanrate: response.data.results[0]["2015"].aid.federal_loan_rate,
                debt: response.data.results[0]["2015"].aid.median_debt_suppressed.completers.overall,
                monthly: response.data.results[0]["2015"].aid.median_debt_suppressed.completers.monthly_payments,
                fulltime: 1 - response.data.results[0]["2015"].student.part_time_share,
                parttime: response.data.results[0]["2015"].student.part_time_share,
                race: response.data.results[0]["2015"].student.demographics.race_ethnicity,
                majors: response.data.results[0]["2015"].academics.program_percentage,
                admissionrate: response.data.results[0]["2015"].admissions.admission_rate.overall,
                act: response.data.results[0]["2015"].admissions.act_scores.midpoint.cumulative,
                sat: response.data.results[0]["2015"].admissions.sat_scores.midpoint.writing + response.data.results[0]["2015"].admissions.sat_scores.midpoint.math + response.data.results[0]["2015"].admissions.sat_scores.midpoint.critical_reading
            }
            res.json(results);
        })
        .catch(function (err) {
            console.log(err);
            res.status(400).end();
        })
})

module.exports = router;