const {useState, useEffect} = React;
const APIKEY = "";

let DataSection = ({data}) => {
	let temperature = {...data.Temperature}.Imperial;
	let windDir = {...data.Wind}.Direction
	let windSpeed = {...data.Wind}.Speed
	windSpeed = {...windSpeed}.Imperial
	return(
		<div>
			<p>
			Weather: {data.WeatherText} <br/>
			Precipitation: {data.hasPrecipitation ? data.PrecipitationType : "None"} <br/>
			Temperature: {{...temperature}.Value} F<br/>
			Humidity: {data.RelativeHumidity}% <br/>
			Wind Speed:	{{...windSpeed}.Value} mph<br/>
			Wind Direction:	{{...windDir}.Localized}<br/>
			Link for more information: <a href={data.Link}>Weather</a>
			</p>
		</div>
	);
}

let useDataApi = (initialUrl, initialData) => {
	const [data, setData] = useState(initialData);
	const [locUrl, setLocUrl] = useState(initialUrl);

	useEffect(() => {
		const getData = async () => {
			try {
				const zipSearch = await axios.get(locUrl);
				const postCode = zipSearch.data[0].Key;
				const weatherData = await axios(`http://dataservice.accuweather.com/currentconditions/v1/${postCode}?apikey=${APIKEY}&details=true`);
				setData(weatherData.data[0]);
			} catch {
				console.log("Error in Zip Code Search");
			}
		}
		getData();
	}, [locUrl]);

	return [data, setLocUrl];
}

let App = () => {
	const [zipcode, setZipCode] = useState("20910");
	const [data, fetchData] = useDataApi(`http://dataservice.accuweather.com/locations/v1/postalcodes/search?apikey=${APIKEY}&q=20910`, {});
	
	return(
		<>
			<form onSubmit={e => {
				fetchData(`http://dataservice.accuweather.com/locations/v1/postalcodes/search?apikey=${APIKEY}&q=${zipcode}`);
				e.preventDefault();
			}}>
				<label>
					Zip / Postal Code: 
					<input type="text" name="zipcode" id="zipcode" onChange={e => setZipCode(e.target.value)}/>
				</label>
				<button type="submit">Search</button>
			</form>
			<hr></hr>
			<h1>Weather for {zipcode}</h1>
			<DataSection data={data} />
		</>
	);
}

ReactDOM.render(<App />, document.getElementById("root"));