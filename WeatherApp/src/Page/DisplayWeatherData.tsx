import React from 'react'
import { Box ,Typography} from '@mui/material'

    interface WeatherDataProps {
        temp: {
          temperature_2m_max: number[];
          temperature_2m_min: number[];
        };
        findAverageTemp: number;
      }
      

const DisplayWeatherData :React.FC<WeatherDataProps>= (props) => {
  return (
    <div>
      <Box sx={{ width: '100vw', display: 'flex', justifyContent: 'center' }}>
                {props.temp.temperature_2m_max && props.temp.temperature_2m_min && (
                    <Box sx={{ width: '10rem', display: 'flex', flexDirection: 'column',mt:3}}>
                        <Typography>Average Temperature: {props.findAverageTemp}°C</Typography>
                        <Typography>Max Temp: {props.temp.temperature_2m_max[0]}°C</Typography>
                        <Typography>Min Temp: {props.temp.temperature_2m_min[0]}°C</Typography>
                    </Box>
                )}
            </Box>
    </div>
  )
}

export default DisplayWeatherData
