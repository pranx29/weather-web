import axios from "axios";

export async function getCity(lat, lon) {
    const url = `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lon}&format=json`;

    return axios.get(url).then(({ data }) => {
        if (data.address) {
            return (
                data.address.city || data.address.town || data.address.village
            );
        } else {
            return "";
        }
    });
}
