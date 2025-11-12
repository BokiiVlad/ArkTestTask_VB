import axios from 'axios';

export async function pixApi(inputValue, currentPage) {
    const axiosOptions = {
        params: {
            per_page: 15,
            page: currentPage,
            key: "48300565-6dad9db0463f535246b89c980",
            q: inputValue,
            image_type: "photo",
            orientation: "horizontal",
            safesearch: "true",
        },
    };

    return axios.get(`https://pixabay.com/api/`, axiosOptions)
};