import React, { useState, useEffect } from 'react';
import { TextField, Autocomplete, CircularProgress } from '@mui/material';
import axios from 'axios';

const SearchBar = ({ onSearch }) => {
    const [city, setCity] = useState('');
    const [suggestions, setSuggestions] = useState([]);
    const [loading, setLoading] = useState(false);
    const [open, setOpen] = useState(false);

    const fetchSuggestions = async (value) => {
        setLoading(true);
        try {
            const response = await axios.get(`https://api.weatherbit.io/v2.0/cities?city=${value}&key=YOUR_WEATHERBIT_API_KEY`);
            setSuggestions(response.data.data.map(city => city.city_name));
            setOpen(true);
        } catch (error) {
            console.error('Error fetching city suggestions', error);
        } finally {
            setLoading(false);
        }
    };

    const handleInputChange = (event, value) => {
        setCity(value);
        if (value.length > 2) {  // Para evitar muchas solicitudes, comenzamos a buscar después de 3 caracteres
            fetchSuggestions(value);
        } else {
            setSuggestions([]);
            setOpen(false);
        }
    };

    const handleSearch = (event, value) => {
        onSearch(value);
        setOpen(false);
    };

    useEffect(() => {
        if (!city) {
            setOpen(false);
        }
    }, [city]);

    return (
        <Autocomplete
            freeSolo
            options={suggestions}
            inputValue={city}
            onInputChange={handleInputChange}
            onChange={handleSearch}
            loading={loading}
            open={open}
            onOpen={() => setOpen(true)}
            onClose={() => setOpen(false)}
            renderInput={(params) => (
                <TextField 
                    {...params} 
                    label="Buscar ciudad" 
                    variant="outlined"
                    InputProps={{
                        ...params.InputProps,
                        endAdornment: (
                            <>
                                {loading ? <CircularProgress color="inherit" size={20} /> : null}
                                {params.InputProps.endAdornment}
                            </>
                        ),
                    }}
                    className="search-bar"
                    style={{ marginRight: '10px' }} // Añadir margen derecho
                />
            )}
        />
    );
};

export default SearchBar;
