class Formatter {
    appliesTo(reading) {
        return true;
    }

    format(reading) {
        return `${reading.name}: ${reading.value}`
    }
}

module.exports=Formatter