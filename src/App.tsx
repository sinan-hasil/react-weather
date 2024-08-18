import { Button } from "react-bootstrap";
import "./style.css";
import { useEffect, useRef, useState } from "react";
import "@fontsource/roboto/300.css";
import "@fontsource/roboto/400.css";
import "@fontsource/roboto/500.css";
import "@fontsource/roboto/700.css";

interface WeatherData {
  id: number;
  description: string;
  icon: string;
  name: string;
}

interface ApiResponse {
  weather: WeatherData[];
  name: string;
  sys: {
    sunrise: number;
    sunset: number;
  };
}

function App() {
  const [weather, setWeather] = useState<WeatherData[]>([]);
  const [city, setCity] = useState<string>("");
  const [showOutput, setShowOutput] = useState<boolean>(false);
  const inputRef = useRef<HTMLInputElement | null>(null);
  const [sunrise, setSunrise] = useState<string>("");
  const [sunset, setSunset] = useState<string>("");

  useEffect(() => {
    inputRef.current?.focus();

    const weatherApi = async () => {
      try {
        const response = await fetch(
          `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=baae8599059bee380d5ccf23de1905b4&units=metric`
        );
        const data: ApiResponse = await response.json();
        console.log(data);
        setWeather(data.weather.map((item) => ({ ...item, name: data.name })));
        //console.log(weather);
        //console.log(typeof data.weather[0]);
        setSunrise(convertHour(data.sys.sunrise * 1000));
        setSunset(convertHour(data.sys.sunset * 1000));
        setShowOutput(true);
      } catch (error) {
        console.log(error);
      }
    };

    if (city) {
      weatherApi();
    }
  }, [city, showOutput]);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget as HTMLFormElement;
    const cityInput = form.elements.namedItem("city") as HTMLInputElement;
    setCity(cityInput.value);
  };

  const turkishWeather = (desc: string) => {
    switch (desc) {
      case "clear sky":
        return "Açık Gökyüzü";
      case "few clouds":
        return "Az Bulutlu";
      case "scattered clouds":
        return "Parçalı Bulutlu";
      case "overcast clouds":
        return "kapalı";
      case "broken clouds":
        return "Kısmen Bulutlu";
      case "shower rain":
        return "Sağanak Yağış";
      case "rain":
        return "Yağmurlu";
      case "thunderstorm":
        return "Gök gürültülü fırtına";
      case "snow":
        return "Karlı";
      case "mist":
        return "Sisli";
      default:
        return desc;
    }
  };

  const icon = (desc: string) => {
    switch (desc) {
      case "clear sky":
        return <i className="bi bi-brightness-high-fill"></i>;
      case "few clouds":
        return <i className="bi bi-clouds"></i>;
      case "scattered clouds":
        return <i className="bi bi-clouds"></i>;
      case "overcast clouds":
        return <i className="bi bi-cloud-fill"></i>;
      case "broken clouds":
        return <i className="bi bi-clouds-fill"></i>;
      case "shower rain":
        return <i className="bi bi-cloud-rain-fill"></i>;
      case "rain":
        return <i className="bi bi-cloud-drizzle"></i>;
      case "thunderstorm":
        return <i className="bi bi-cloud-lightning-rain-fill"></i>;
      case "snow":
        return <i className="bi bi-thermometer-snow"></i>;
      case "mist":
        return <i className="bi bi-cloud-fog2-fill"></i>;
      default:
        return desc;
    }
  };

  const convertHour = (milliseconds: number) => {
    const date = new Date(milliseconds);
    const hours = date.getHours().toString().padStart(2, "0");
    const minutes = date.getMinutes().toString().padStart(2, "0");
    return `${hours}:${minutes}`;
  };

  // const Icon = styled.i`
  // color: ${Icon === "bi bi-brightness-high-fill" ? (yellow) : ()};
  // `

  return (
    <>
    <h4 className="text-center text-white mt-3 ms-5">HAVA DURUMU</h4>
      

      <div className="background">
        <div>
          <form className="form" onSubmit={handleSubmit}>
            <input
              type="text"
              placeholder="ŞEHİR GİRİNİZ..."
              name="city"
              ref={inputRef}
              autoComplete="off"
            />
            <Button variant="primary" type="submit">
              Hava durumunu Görüntüle
            </Button>
          </form>
        </div>
        <div className="weather-icon">
          {showOutput &&
            weather.map((item) => {
              return <p className="weatherView">{icon(item.description)}</p>;
            })}
        </div>
        {showOutput && (
          <div className="view">
            {weather.map((result) => {
              return (
                <div key={result.id}>
                  <div>
                    <div>
                      <i className="bi bi-geo-alt-fill"></i>{" "}
                      <span>{result.name.split(" ")[0]}</span>
                    </div>
                  </div>
                  <div className="d-flex gap-2">
                    <div>{icon(result.description)}</div>
                    <div>{turkishWeather(result.description)}</div>
                  </div>
                  <div>
                    <i className="bi bi-sunrise-fill"></i> Gündoğumu: {sunrise}
                  </div>
                  <div>
                    <i className="bi bi-sunset-fill"></i> Günbatımı: {sunset}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </>
  );
}

export default App;
