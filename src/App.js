import React, { useState, useEffect } from "react";
import "./App.css";
import { sortData } from "./util";
import {
  FormControl,
  Select,
  MenuItem,
  Card,
  CardContent,
} from "@material-ui/core";
import InfoBox from "./InfoBox";
import Map from "./Map";
import Table from "./Table";
import LineGraph from "./LineGraph";
import "leaflet/dist/leaflet.css";
import { prettyPrint } from "./util";
function App() {
  const [countries, setCountries] = useState([]);
  const [country, setCountry] = useState("worldwide");
  const [countryInfo, setCountryInfo] = useState({});
  const [tableData, setTableData] = useState([]);
  const [mapCenter, setMapCenter] = useState({ lat: 34.80476, lng: -40.4796 });
  const [zoom, setZoom] = useState(3);
  const [mapCountries, setMapCountries] = useState([]);
  const [caseType, setCaseType] = useState("cases");
  useEffect(() => {
    fetch("https://disease.sh/v3/covid-19/all")
      .then((response) => response.json())
      .then((data) => setCountryInfo(data));
  }, []);
  useEffect(() => {
    const getCountries = async () => {
      await fetch("https://disease.sh/v3/covid-19/countries")
        .then((responne) => responne.json())
        .then((data) => {
          const countries = data.map((country) => ({
            name: country.country,
            value: country.countryInfo.iso2,
          }));
          const sortedData = sortData(data);
          setTableData(sortedData);
          setMapCountries(data);
          setCountries(countries);
        });
    };
    getCountries();
  }, []);
  const onCountrychange = async (event) => {
    const countryCode = event.target.value;
    setCountry(countryCode);
    const url =
      countryCode === "worldwide"
        ? "https://disease.sh/v3/covid-19/all"
        : `https://disease.sh/v3/covid-19/countries/${countryCode}`;

    await fetch(url)
      .then((response) => response.json())
      .then((data) => {
        setCountryInfo(data);
        countryCode === "worldwide"
          ? setMapCenter([34.80476, -40.4796])
          : setMapCenter([data.countryInfo.lat, data.countryInfo.long]);
        setZoom(4);
      });
  };
  return (
    <div className="app">
      <div className="app__left">
        <div className="app__header">
          <h1>Covid 19 Tracker</h1>
          <FormControl className="app__dropdown">
            <Select
              variant="outlined"
              onChange={onCountrychange}
              value={country}
            >
              <MenuItem value="worldwide">WorldWide</MenuItem>
              {countries.map((country) => (
                <MenuItem value={country.value}>{country.name}</MenuItem>
              ))}
            </Select>
          </FormControl>
        </div>
        <div className="app__stats">
          <InfoBox
            isRed
            active={caseType === "cases"}
            onClick={(e) => setCaseType("cases")}
            title="Cases"
            cases={prettyPrint(countryInfo.todayCases)}
            total={prettyPrint(countryInfo.cases)}
          />
          <InfoBox
            active={caseType === "recovered"}
            onClick={(e) => setCaseType("recovered")}
            title="Recoverd"
            cases={prettyPrint(countryInfo.todayRecovered)}
            total={prettyPrint(countryInfo.recovered)}
          />
          <InfoBox
            isRed
            active={caseType === "deaths"}
            onClick={(e) => setCaseType("deaths")}
            title="Deaths"
            cases={prettyPrint(countryInfo.todayDeaths)}
            total={prettyPrint(countryInfo.deaths)}
          />
        </div>
        <Map
          caseType={caseType}
          countries={mapCountries}
          center={mapCenter}
          zoom={zoom}
        ></Map>
      </div>
      <Card className="app__right">
        <CardContent>
          <h3>Live Cases by countries</h3>
          <Table countries={tableData}></Table>
          <h3 className="chart__header">WorldWide new {caseType}</h3>
          <LineGraph className="app__graph" casesType={caseType}></LineGraph>
        </CardContent>
      </Card>
    </div>
  );
}

export default App;
