var api = {
    prefix: "http://admin.belezamaisforte.com.br/",
    resolve: function (suffix) {
        return this.prefix + suffix;
    }
}
//api.prefix = "http://localhost:53581/"; //dev