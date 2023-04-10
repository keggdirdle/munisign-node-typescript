start = () => {
    fetch('./start', {}).then(response => response.json());
}

favorites = () => {
    fetch('./favorites', {}).then(response => response.json())
        .then(data => console.log(data));
}

exit = () => {
    fetch('./exit', {}).then(response => response.json())
}
