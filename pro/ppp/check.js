//get PPP lists
const response = await fetch('./ppp/ppp-data.json');
const data = await response.json();
const lifetimePPPList = data.products[1].purchasing_power_parity_prices;
const subsPPPList = data.products[0].variants[0].options[0].recurrence_prices.yearly.purchasing_power_parity_prices;
const $ = document.querySelector.bind(document);
const $$ = document.querySelectorAll.bind(document);
const lifetimeUSPrice = 4900;

//get iso from IP
const config = {
  method: 'get',
  url: 'https://api.geoapify.com/v1/ipinfo?&apiKey=26e5b825f41a427180d02415a2bbf00b',
  headers: {},
};
try {
  const response = await axios(config);
  //look up ISO in PPP lists
  let iso = response.data.country.iso_code;
  let name = response.data.country.name;
  //test
  // iso = 'DE';
  // name = 'Germany';
  let lifetimePPP = lifetimePPPList[iso];
  if (lifetimePPP && lifetimePPP < lifetimeUSPrice) {
    //got a PPP
    let subsPPP = subsPPPList[iso];
    let perc = 100 - Math.floor((lifetimePPP / lifetimeUSPrice) * 100);
    //show it
    $('#pppBlurb').style.display = 'block';
    $('#pppCountry').innerText = name;
    $('#pppPerc').innerText = perc + '%';
    $('#priceLifetime').innerText = '$' + (lifetimePPP / 100).toFixed(2);
    $('#priceLifetime').classList.add('gold');
    $('#priceSubs').innerText = '$' + (subsPPP / 100).toFixed(2);
    $('#priceSubs').classList.add('gold');
    $$('.price-orig').forEach((el) => (el.style.display = 'block'));
  }
} catch (err) {
  console.log(err);
}
