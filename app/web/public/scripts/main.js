favorites = () => {
    fetch('./favorites', {}).then(response => response.json())
        .then(data => console.log(data));
}
