class Builder {
    constructor() {
        this.loaded = false;
    }
    fetchData() {
        let result = [];
        try {
            result = JSON.parse(localStorage[Builder.STORAGE_KEY]);
        }
        catch (e) {
            console.error(e.message);
            localStorage[Builder.STORAGE_KEY] = '';
        }
        return result;
    }
    persistData(value) {
        if (!value)
            throw "No value to store";
        localStorage[Builder.STORAGE_KEY] = JSON.stringify(value);
    }
}
Builder.STORAGE_KEY = 'An2g03gud01g-hhj5';
