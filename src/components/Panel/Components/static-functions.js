export function capitalizeWord(string) {
    string = string.toLowerCase();
    return string.charAt(0).toUpperCase() + string.slice(1);
}

export function modifyOptionsData(data) {
    let options = [];
    if ( data !== null ) {
        for (let i = 0; i < Object.keys(data).length; i++) {
            let key = Object.keys(data)[i];
            options.push({
                label: data[key],
                value: key
            });
        }
    }
    return options;
}