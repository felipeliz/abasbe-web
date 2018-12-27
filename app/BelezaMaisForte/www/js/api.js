var api = {
    prefix: "http://alysonfreitas.minivps.info/abasbe/",
    resolve: function (suffix) {
        return this.prefix + suffix;
    }
}
api.prefix = "http://localhost:53581/"; //dev