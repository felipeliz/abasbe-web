/* ocLazyLoad config */

app
    .config([
        '$ocLazyLoadProvider',
        function ($ocLazyLoadProvider) {
            $ocLazyLoadProvider.config({
                debug: false,
                events: false,
                modules: [
                    // ----------- FORM ELEMENTS -----------
                    {
                        name: 'lazy_autosize',
                        files: [
                            'bower_components/autosize/dist/autosize.js',
                            'app/modules/angular-autosize.js'
                        ],
                        serie: true
                    },
                    {
                        name: 'lazy_iCheck',
                        files: [
                            "bower_components/jquery-icheck/icheck.js",
                            'app/modules/angular-icheck.js'
                        ],
                        serie: true
                    },
                    {
                        name: 'lazy_uiSelect',
                        files: [
                            'bower_components/angular-ui-select/select.min.css',
                            'bower_components/angular-ui-select/select.js'
                        ],
                        serie: true
                    },
                    {
                        name: 'lazy_selectizeJS',
                        files: [
                            'bower_components/selectize/dist/js/standalone/selectize.min.js',
                            'app/modules/angular-selectize.js'
                        ],
                        serie: true
                    },
                    {
                        name: 'lazy_switchery',
                        files: [
                            'bower_components/switchery/dist/switchery.js',
                            'app/modules/angular-switchery.js'
                        ],
                        serie: true
                    },
                    {
                        name: 'lazy_ionRangeSlider',
                        files: [
                            'bower_components/ion.rangeslider/js/ion.rangeSlider.min.js',
                            'app/modules/angular-ionRangeSlider.js'
                        ],
                        serie: true
                    },
                    {
                        name: 'lazy_character_counter',
                        files: [
                            'app/modules/angular-character-counter.js'
                        ]
                    },
                    {
                        name: 'lazy_parsleyjs',
                        files: [
                            'assets/js/custom/parsleyjs_config.js',
                            'bower_components/parsleyjs/dist/parsley.min.js'
                        ],
                        serie: true
                    },
                    {
                        name: 'lazy_wizard',
                        files: [
                            'assets/js/custom/parsleyjs_config.js',
                            'bower_components/parsleyjs/dist/parsley.min.js',
                            'bower_components/lodash/lodash.min.js',
                            'bower_components/angular-wizard/dist/angular-wizard.min.js'
                        ],
                        serie: true
                    },
                    {
                        name: 'lazy_tinymce',
                        files: [
                            'bower_components/tinymce/tinymce.min.js',
                            'app/modules/angular-tinymce.js'
                        ],
                        serie: true
                    }
                ]
            })
        }
    ]);