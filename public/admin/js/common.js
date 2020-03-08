let serialize2Jason = form => {
    let ret = {};
    form.forEach(item => {
        ret[item.name] = item.value;
    })
    return ret;
};