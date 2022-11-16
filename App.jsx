const {useState, useEffect} = React;
const APIKEY = "";
const {Form, Button, Container} = ReactBootstrap;

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
			<a href={data.Link}>Click for more information</a>
			</p>
		</div>
	);
};

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
};

let App = () => {
	const [zipcode, setZipCode] = useState("20910");
	const [data, fetchData] = useDataApi(`http://dataservice.accuweather.com/locations/v1/postalcodes/search?apikey=${APIKEY}&q=20910`, {});
	
	return(
		<Container>
			<h1 className="text-center">Find the Current Weather</h1>
			<Form onSubmit={e => {
				fetchData(`http://dataservice.accuweather.com/locations/v1/postalcodes/search?apikey=${APIKEY}&q=${zipcode}`);
				e.preventDefault();
			}}>
				<Form.Group className="mb-3">
					<Form.Label>Zip / Postal Code</Form.Label>
					<Form.Control onChange={e => setZipCode(e.target.value)} placeholder="ex. 20910"/>
				</Form.Group>
				<Button type="submit">Search</Button>
			</Form>
			<hr></hr>
				<h1>Weather for {zipcode}</h1>
				<DataSection data={data} />
		</Container>
	);
};

ReactDOM.render(<App />, document.getElementById("root"));