angular.module('filterPhone', []).filter('tel', function () {
    return function (tel) {
        if (!tel) { return ''; }

        var value = tel.toString().trim().replace(/^\+/, '');
        value = value.replace(/\D/g, '');

        if (value.match(/[^0-9]/)) {
            return tel;
        }

        var city, number;

        switch (value.length) {
            case 10:
                city = value.slice(0, 2);
                number = value.slice(2);
                number = number.slice(0, 4) + '-' + number.slice(4);
                break;
            case 11:
                city = value.slice(0, 2);
                number = value.slice(2);
                number = number.slice(0, 5) + '-' + number.slice(5);
                break;
            default:
                return tel;
        }


        return (" (" + city + ") " + number).trim();
    };
});