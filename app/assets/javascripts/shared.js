$(document).on('turbolinks:load', function() {
    /** Initialize all Semantic-UI Dropdowns */
    $('.ui.dropdown').dropdown();
    $('.ui.dropdown').dropdown({
        onShow: function() {
            /** Make the Active item the selected one on open. 
             * Same block of code executes when dropdown is clicked open,
             * as seen in the .click() function below.
             */
            $(this).find('.menu .item').removeClass('selected');
            $(this).find('.menu .item.active').addClass('selected');
        }
    })
    $('.ui.dropdown').find('input').on('input', function() {
        $(this).find('.menu .item').removeClass('selected');
        $(this).find('.menu .item.active').addClass('selected');
    });
    $('.ui.dropdown').click(function() {
        if ($(this).find('.menu .item.active').html() !== undefined) {
            $(this).find('.menu .item').removeClass('selected');
            $(this).find('.menu .item.active').addClass('selected');
        }
    });

    /** Configure Shared Dropdowns */

    /** MutationObserver is used to detect changes in the dropdown. Once a change is detected, 
     * the dropdown text is adjusted to show only the title text.
     */
    var observerConfig = {childList: true, subtree: true, attributes: true, characterData: true};
    
    if ($('#select-customerAccounts').length) {
        $('#select-customerAccounts').dropdown({
            fullTextSearch: true,
            forceSelection: false,
        });
        observer_customerAccounts.observe($('#select-customerAccounts').find('.menu')[0], observerConfig);
    }
    if ($('#select-products').length) {
        $('#select-products').dropdown({
            fullTextSearch: true,
            forceSelection: false,
        });
        observer_products.observe($('#select-products').find('.menu')[0], observerConfig);
    }

    /** Prevent Disabled Links/Buttons from being activated through Keyboard Events */
    $('a').on('keydown keyup keypress', function(e) {
        if ($(this).hasClass('disabled')) {
            e.preventDefault();
        }
    });
});

/** Run page-specific JS */
function executeScriptFor(elementIdentifier, script) {
    $(document).on('turbolinks:load', function() {
        if ($(elementIdentifier).length) {
            script();
        }
    })
}

/** Date Functions */
Date.prototype.addDays = function(days) {
    var result = new Date(this.valueOf());
    result.setDate(result.getDate() + days);
    return result;
}
Date.prototype.formatForDateField = function() {
    return this.getFullYear()
        + '-' + ((this.getMonth() + 1) < 10 ? ('0' + (this.getMonth() + 1)) : (this.getMonth() + 1))
        + '-' + ((this.getDate()) < 10 ? ('0' + this.getDate()) : (this.getDate()));
}

/** Price Functions */
function toPriceString(num) {
    return parseFloat(num).toFixed(2).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}
function getPriceValue(price) {
    return parseFloat(price.replace(new RegExp(',', 'g'), ''));
}

/** Mutation Observers for Shared Dropdowns */
var observer_customerAccounts = new MutationObserver(function () {
    if ($('#select-customerAccounts').dropdown('get value') !== '') {
        if ($('#select-customerAccounts').find('input').val() === '') {
             $('#select-customerAccounts').dropdown('set text', $('#select-customerAccounts').find('.menu .item.active .title.text').html());
        } else {
             $('#select-customerAccounts').dropdown('set text', '');
        }
    }
});
var observer_products = new MutationObserver(function () {
    if ($('#select-products').dropdown('get value') !== '') {
        if ($('#select-products').find('input').val() === '') {
            $('#select-products').dropdown('set text', $('#select-products').find('.menu .item.active .title.text').html() + ' (' + $('#select-products').find('.menu .item.active .value.specs').html() + ')');
        } else {
            $('#select-products').dropdown('set text', '');
        }
    }
});