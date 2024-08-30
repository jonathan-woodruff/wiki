exports.parseServices = (services) => {
    const countries = [];
    const sectors = [];
    services.forEach(service => {
        countries.push(service.country);
        sectors.push(service.sector);
    });
    return [countries, sectors];
};