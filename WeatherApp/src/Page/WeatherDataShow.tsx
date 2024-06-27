import React, { useCallback, useEffect, useMemo, useState } from 'react';
import Container from '@mui/material/Container';
import Box from '@mui/material/Box';
import { Select, MenuItem, FormControl, InputLabel, Button, Typography } from '@mui/material';
import cityDetails from '../cityDetails.json';
import axios from 'axios';
import { SelectChangeEvent } from '@mui/material/Select';

const WeatherDataShow: React.FC = () => {
    const [temp, setTemp] = useState<{ temperature_2m_max?: number[]; temperature_2m_min?: number[] }>({});
    const [currentCity, setCurrentCity] = useState<string>('');
    const [selectedCity, setSelectedCity] = useState<string>('');
    const [errors, setErrors] = useState<{ cityName?: boolean }>({});

    const fetchWeatherData = useCallback(async (latitude: string, longitude: string) => {
        if (currentCity) {
            try {
                const response = await axios.get(`https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&daily=temperature_2m_max,temperature_2m_min&forecast_days=1`);
                setTemp(response.data.daily);
            } catch (error: any) {
                console.log(error.message);
            }
        } 
    }, [currentCity]);

    const findAverageTemp = useMemo<number>(() => {
        if (!temp.temperature_2m_max || !temp.temperature_2m_min) {
            return 0;
        }
        const maxTemp = temp.temperature_2m_max[0];
        const minTemp = temp.temperature_2m_min[0];
        return (maxTemp + minTemp) / 2;
    }, [temp]);

    const handleCityChange = (event: SelectChangeEvent) => {
        setSelectedCity(event.target.value as string);
    };

    const onSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        if (!selectedCity) {
            setErrors({ cityName: true });
            return;
        }
        setErrors({ cityName: false });

        const cityDetail = cityDetails.find(cityDetail => cityDetail.city === selectedCity);
        if (cityDetail) {
            setCurrentCity(selectedCity);
            const info = { cityName: selectedCity, latitude: cityDetail.lat, longitude: cityDetail.lng };
            localStorage.setItem('information', JSON.stringify(info));
            console.log(cityDetail.lat, cityDetail.lng);
        }
    };

    useEffect(() => {
        const info = localStorage.getItem('information');
        if (info) {
            const infos = JSON.parse(info);
            setCurrentCity(infos.cityName);
            setSelectedCity(infos.cityName);  
            fetchWeatherData(infos.latitude, infos.longitude);
        }
    }, [fetchWeatherData]);
    useEffect(() => {
        // Function to reload the page
        const reloadPage = () => {
          window.location.reload();
        };
    
        // Set interval to reload the page every 10 minutes (600,000 milliseconds)
        const intervalId = setInterval(reloadPage, 60000);
    
        // Cleanup the interval on component unmount
        return () => clearInterval(intervalId);
      }, []);

    return (
        <Container>
            <Box>
                <form onSubmit={onSubmit}>
                    <Box style={{
                        width: '100vw', display: 'flex', flexDirection: 'column', justifyContent: 'center',
                        alignItems: "center"
                    }}>
                        <FormControl error={!!errors.cityName} margin="normal" style={{ width: '10rem' }}>
                            <InputLabel id="City-label">Select City</InputLabel>
                            <Select
                                labelId="City-label"
                                label="CityName"
                                value={selectedCity || ""}
                                onChange={handleCityChange}
                            >
                                <MenuItem value=""><em>None</em></MenuItem>
                                {cityDetails.map((cityDetail, index) => (
                                    <MenuItem key={index} value={cityDetail.city}>{cityDetail.city}</MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                        <Button type="submit" variant="contained" color="primary" style={{ marginTop: '20px' }}>
                            Next
                        </Button>
                    </Box>
                </form>
            </Box>
            <Box>
                {temp.temperature_2m_max && temp.temperature_2m_min && (
                    <div>
                        <Typography>Average Temperature: {findAverageTemp}°C</Typography>
                        <Typography>Max Temp: {temp.temperature_2m_max[0]}°C</Typography>
                        <Typography>Min Temp: {temp.temperature_2m_min[0]}°C</Typography>
                    </div>
                )}
            </Box>
        </Container>
    );
}

export default WeatherDataShow;
